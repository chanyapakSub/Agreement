'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useRouter } from 'next/navigation';

export function SignContract({ contract, currentToken }: { contract: any, currentToken: string }) {
    const sigCanvas = useRef<any>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [data, setData] = useState(JSON.parse(contract.data));
    const [isResigning, setIsResigning] = useState(false);

    const role = currentToken === contract.lessorToken ? 'lessor' :
        currentToken === contract.lesseeToken ? 'lessee' : 'legacy';

    const currentSignature = role === 'lessor' ? contract.lessorSignature :
        role === 'lessee' ? contract.lesseeSignature :
            contract.signature;

    const isSigned = !!currentSignature;

    const clear = () => sigCanvas.current.clear();

    const handleImageChange = (e: any, sectionId: string, fieldId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newData = { ...data };
                const s = newData.sections.find((sec: any) => sec.id === sectionId);
                const f = s.fields.find((fi: any) => fi.id === fieldId);
                f.value = reader.result as string;
                setData(newData);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (sectionId: string, fieldId: string) => {
        const newData = { ...data };
        const s = newData.sections.find((sec: any) => sec.id === sectionId);
        const f = s.fields.find((fi: any) => fi.id === fieldId);
        f.value = '';
        setData(newData);
    };

    // Inventory Helpers
    const addInventoryItem = (sectionId: string) => {
        const newData = { ...data };
        const section = newData.sections.find((s: any) => s.id === sectionId);
        const timestamp = Date.now();
        const idBase = `custom_${timestamp}`;

        section.fields.push({
            id: `${idBase}_qty`,
            label: 'รายการใหม่ (จำนวน)',
            type: 'text',
            value: '1'
        });
        section.fields.push({
            id: `${idBase}_note`,
            label: 'รายการใหม่ (หมายเหตุ)',
            type: 'text',
            value: ''
        });
        setData(newData);
    };

    const removeInventoryItem = (sectionId: string, baseId: string) => {
        if (!confirm('ต้องการลบรายการนี้ใช่หรือไม่?')) return;
        const newData = { ...data };
        const section = newData.sections.find((s: any) => s.id === sectionId);
        section.fields = section.fields.filter((f: any) =>
            f.id !== `${baseId}_qty` && f.id !== `${baseId}_note`
        );
        setData(newData);
    };

    const updateInventoryLabel = (sectionId: string, baseId: string, newLabel: string) => {
        const newData = { ...data };
        const section = newData.sections.find((s: any) => s.id === sectionId);
        const qtyField = section.fields.find((f: any) => f.id === `${baseId}_qty`);
        const noteField = section.fields.find((f: any) => f.id === `${baseId}_note`);

        if (qtyField) qtyField.label = `${newLabel} (จำนวน)`;
        if (noteField) noteField.label = `${newLabel} (หมายเหตุ)`;

        setData(newData);
    };

    const save = async () => {
        if (sigCanvas.current && sigCanvas.current.isEmpty && sigCanvas.current.isEmpty() && !currentSignature) {
            alert('กรุณาเซ็นชื่อ');
            return;
        }

        setLoading(true);
        let signature = currentSignature;
        if (isResigning || !isSigned) {
            if (sigCanvas.current.isEmpty()) {
                alert('กรุณาเซ็นชื่อ');
                setLoading(false);
                return;
            }
            signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        }

        try {
            await fetch(`/api/contracts/${contract.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: JSON.stringify(data) }),
            });

            const res = await fetch(`/api/contracts/${contract.id}/sign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signature, token: currentToken }),
            });

            if (!res.ok) throw new Error('Failed');

            alert('บันทึกข้อมูลและลงนามเรียบร้อยแล้ว');
            window.location.reload();
        } catch (e) {
            alert('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setLoading(false);
        }
    };

    // Filter sections based on role
    const visibleSections = data.sections.filter((section: any) => {
        if (role === 'lessor') return !section.id.startsWith('sec_lessee');
        if (role === 'lessee') return !section.id.startsWith('sec_lessor');
        return true;
    });

    const isInventorySection = (id: string) => id === 'sec_appliances' || id === 'sec_furniture';

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="bg-white p-8 shadow-lg rounded-xl mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
                    <p className="text-blue-600 font-medium">
                        {role === 'lessor' ? 'ลงนามในฐานะ: ผู้ให้เช่า (Lessor)' :
                            role === 'lessee' ? 'ลงนามในฐานะ: ผู้เช่า (Lessee)' : ''}
                    </p>
                </div>

                <div className="space-y-8 text-sm mb-8 border-b pb-8">
                    {visibleSections.map((section: any) => {
                        // Determine if this section is editable by the current user
                        let isSectionEditable = false;
                        if (role === 'lessor') {
                            isSectionEditable = section.id.startsWith('lessor') ||
                                ['sec_details', 'sec_payment', 'sec_deposit', 'sec_docs', 'sec_appliances', 'sec_furniture'].includes(section.id);
                        } else if (role === 'lessee') {
                            isSectionEditable = section.id.startsWith('lessee');
                        }

                        // Special rendering for Inventory Sections for Lessor
                        if (isInventorySection(section.id) && role === 'lessor') {
                            // Group fields into items
                            const items: any[] = [];
                            section.fields.forEach((f: any) => {
                                if (f.id.endsWith('_qty')) {
                                    const baseId = f.id.replace('_qty', '');
                                    const noteField = section.fields.find((nf: any) => nf.id === `${baseId}_note`);
                                    items.push({
                                        baseId,
                                        label: f.label.replace(' (จำนวน)', ''),
                                        qtyField: f,
                                        noteField: noteField
                                    });
                                }
                            });

                            return (
                                <div key={section.id} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg text-gray-800">{section.title}</h3>
                                        <button
                                            onClick={() => addInventoryItem(section.id)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                        >
                                            + เพิ่มรายการ
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="p-2 font-medium w-1/3">รายการ</th>
                                                    <th className="p-2 font-medium w-1/6">จำนวน</th>
                                                    <th className="p-2 font-medium">หมายเหตุ</th>
                                                    <th className="p-2 font-medium w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {items.map((item) => (
                                                    <tr key={item.baseId} className="group hover:bg-white transition-colors">
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                value={item.label}
                                                                onChange={(e) => updateInventoryLabel(section.id, item.baseId, e.target.value)}
                                                                className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none px-1"
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                value={item.qtyField.value || ''}
                                                                onChange={(e) => {
                                                                    const newData = { ...data };
                                                                    const s = newData.sections.find((sec: any) => sec.id === section.id);
                                                                    const f = s.fields.find((fi: any) => fi.id === item.qtyField.id);
                                                                    f.value = e.target.value;
                                                                    setData(newData);
                                                                }}
                                                                className="w-full bg-white border rounded px-2 py-1 text-center focus:ring-1 focus:ring-blue-500 outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                value={item.noteField?.value || ''}
                                                                onChange={(e) => {
                                                                    const newData = { ...data };
                                                                    const s = newData.sections.find((sec: any) => sec.id === section.id);
                                                                    const f = s.fields.find((fi: any) => fi.id === item.noteField.id);
                                                                    f.value = e.target.value;
                                                                    setData(newData);
                                                                }}
                                                                className="w-full bg-white border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <button
                                                                onClick={() => removeInventoryItem(section.id, item.baseId)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                title="ลบรายการ"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {items.length === 0 && (
                                            <div className="text-center py-8 text-gray-400 text-sm">
                                                ไม่มีรายการ กดปุ่ม "เพิ่มรายการ" เพื่อเริ่ม
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={section.id}>
                                <h3 className="font-bold text-lg mb-3 text-gray-800">{section.title}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.fields.map((field: any) => {
                                        // Check if editable
                                        const isEditable = role !== 'legacy' && (
                                            field.id.startsWith(role) ||
                                            (isSectionEditable && !field.id.startsWith('lessee') && role === 'lessor') // Allow lessor to edit section fields unless explicitly lessee's
                                        );

                                        return (
                                            <div key={field.id} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                                                <label className="block font-semibold text-gray-600 mb-1">{field.label}:</label>
                                                {isEditable ? (
                                                    field.type === 'textarea' ? (
                                                        <textarea
                                                            value={field.value || ''}
                                                            onChange={(e) => {
                                                                const newData = { ...data };
                                                                const s = newData.sections.find((sec: any) => sec.id === section.id);
                                                                const f = s.fields.find((fi: any) => fi.id === field.id);
                                                                f.value = e.target.value;
                                                                setData(newData);
                                                            }}
                                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                                            rows={3}
                                                        />
                                                    ) : field.type === 'image' ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, section.id, field.id)}
                                                                className="w-full p-2 border rounded text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                            />
                                                            {field.value && (
                                                                <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden border">
                                                                    <img
                                                                        src={field.value}
                                                                        alt="Preview"
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(section.id, field.id)}
                                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type={field.type}
                                                            value={field.value || ''}
                                                            onChange={(e) => {
                                                                const newData = { ...data };
                                                                const s = newData.sections.find((sec: any) => sec.id === section.id);
                                                                const f = s.fields.find((fi: any) => fi.id === field.id);
                                                                f.value = e.target.value;
                                                                setData(newData);
                                                            }}
                                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                                        />
                                                    )
                                                ) : (
                                                    <div className="p-2 bg-gray-50 rounded border text-gray-900">
                                                        {field.type === 'image' && field.value ? (
                                                            <img src={field.value} alt={field.label} className="h-32 object-contain" />
                                                        ) : (
                                                            field.value || '-'
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-4">ลงลายมือชื่อ ({role === 'lessor' ? 'ผู้ให้เช่า' : role === 'lessee' ? 'ผู้เช่า' : 'ทั่วไป'})</h3>

                    {isSigned && !isResigning ? (
                        <div className="mb-4">
                            <div className="border rounded-lg p-4 bg-gray-50 flex flex-col items-center">
                                <img src={currentSignature} alt="Signature" className="h-32 object-contain mb-4" />
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        ลงนามแล้ว
                                    </span>
                                    <button
                                        onClick={() => setIsResigning(true)}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
                                    >
                                        แก้ไขลายเซ็น
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 mb-2">กรุณาเซ็นชื่อในกรอบด้านล่าง</p>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white hover:border-blue-400 transition-colors">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    canvasProps={{ className: 'sigCanvas w-full h-64 cursor-crosshair' }}
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <button onClick={clear} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    ล้างลายเซ็น
                                </button>
                                {isResigning && (
                                    <button onClick={() => setIsResigning(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                        ยกเลิกการแก้ไข
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {(isResigning || !isSigned) && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={save}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm w-full md:w-auto"
                            >
                                {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลและลงนาม'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
