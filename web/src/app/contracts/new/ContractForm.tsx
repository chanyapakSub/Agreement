'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ContractForm({ templates }: { templates: any[] }) {
    const router = useRouter();
    const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
    const [contractType, setContractType] = useState('LEASE');
    const [formData, setFormData] = useState<any>(null);
    const [visibleLessees, setVisibleLessees] = useState(1);

    const [loading, setLoading] = useState(false);

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

    useEffect(() => {
        if (selectedTemplate) {
            try {
                const content = JSON.parse(selectedTemplate.content);
                setFormData(content);
            } catch (e) {
                console.error("Error parsing template content", e);
            }
        }
    }, [selectedTemplateId, selectedTemplate]);

    const handleFieldChange = (sectionId: string, fieldId: string, value: string) => {
        if (!formData) return;
        const newData = { ...formData };
        const section = newData.sections.find((s: any) => s.id === sectionId);
        if (section) {
            const field = section.fields.find((f: any) => f.id === fieldId);
            if (field) {
                field.value = value;
                setFormData(newData);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Extract identifier (Room - Condo)
        let room = '';
        let condo = '';

        // Helper to find value
        const findValue = (id: string) => {
            if (!formData) return '';
            for (const s of formData.sections) {
                const f = s.fields.find((field: any) => field.id === id);
                if (f) return f.value;
            }
            return '';
        };

        room = findValue('roomNumber');
        condo = findValue('condoName');
        const identifier = room && condo ? `${room} - ${condo}` : 'New Contract';

        try {
            const res = await fetch('/api/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: selectedTemplateId,
                    identifier,
                    data: JSON.stringify(formData),
                    type: contractType,
                }),
            });

            if (!res.ok) throw new Error('Failed to create contract');

            const contract = await res.json();
            router.push(`/contracts/${contract.id}`);
        } catch (error) {
            alert('Error creating contract');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedTemplate) return <div>No templates found</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border print:hidden space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทสัญญา</label>
                    <select
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="LEASE">สัญญาเช่า (Lease Agreement)</option>
                        <option value="BUY">สัญญาจะซื้อจะขาย (Buy/Sell Agreement)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เลือกแบบฟอร์มสัญญา</label>
                    <select
                        value={selectedTemplateId}
                        onChange={(e) => {
                            setSelectedTemplateId(e.target.value);
                            // formData will be reset by useEffect
                        }}
                        className="w-full p-2 border rounded-lg"
                    >
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            {formData && formData.sections.map((section: any) => {
                // Logic to hide/show extra lessee sections
                if (section.id === 'sec_lessee2' && visibleLessees < 2) return null;
                if (section.id === 'sec_lessee3' && visibleLessees < 3) return null;
                if (section.id === 'sec_lessee4' && visibleLessees < 4) return null;

                return (
                    <div key={section.id} className="bg-white p-6 rounded-xl shadow-sm border print:shadow-none print:border-none print:p-0 relative">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 flex justify-between items-center">
                            {section.title}
                            {/* Show remove button for extra lessees */}
                            {(section.id === 'sec_lessee2' || section.id === 'sec_lessee3' || section.id === 'sec_lessee4') && (
                                <button
                                    type="button"
                                    onClick={() => setVisibleLessees(prev => prev - 1)}
                                    className="text-red-500 text-sm font-normal hover:underline print:hidden"
                                >
                                    ลบข้อมูลผู้เช่านี้
                                </button>
                            )}
                        </h3>
                        {section.id === 'sec_appliances' || section.id === 'sec_furniture' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="p-3 text-left font-medium text-gray-700 w-1/2">รายการ (List)</th>
                                            <th className="p-3 text-center font-medium text-gray-700 w-24">จำนวน (Qty)</th>
                                            <th className="p-3 text-left font-medium text-gray-700">หมายเหตุ (Note)</th>
                                            <th className="p-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {section.fields.filter((f: any) => f.id.endsWith('_qty')).map((qtyField: any) => {
                                            const noteField = section.fields.find((f: any) => f.id === qtyField.id.replace('_qty', '_note'));
                                            const label = qtyField.label.replace(' (จำนวน)', '');

                                            return (
                                                <tr key={qtyField.id} className="hover:bg-gray-50">
                                                    <td className="p-2">
                                                        <input
                                                            type="text"
                                                            value={label}
                                                            onChange={(e) => {
                                                                // Update label for both qty and note fields
                                                                const newLabel = e.target.value;
                                                                const newData = { ...formData };
                                                                const s = newData.sections.find((s: any) => s.id === section.id);
                                                                const qF = s.fields.find((f: any) => f.id === qtyField.id);
                                                                const nF = s.fields.find((f: any) => f.id === noteField.id);
                                                                if (qF) qF.label = `${newLabel} (จำนวน)`;
                                                                if (nF) nF.label = `${newLabel} (หมายเหตุ)`;
                                                                setFormData(newData);
                                                            }}
                                                            className="w-full p-2 border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input
                                                            type="text"
                                                            value={qtyField.value || ''}
                                                            onChange={(e) => handleFieldChange(section.id, qtyField.id, e.target.value)}
                                                            className="w-full p-2 border rounded text-center focus:ring-2 focus:ring-blue-500 outline-none"
                                                            placeholder={qtyField.placeholder}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        {noteField && (
                                                            <input
                                                                type="text"
                                                                value={noteField.value || ''}
                                                                onChange={(e) => handleFieldChange(section.id, noteField.id, e.target.value)}
                                                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                                placeholder="หมายเหตุ"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newData = { ...formData };
                                                                const s = newData.sections.find((s: any) => s.id === section.id);
                                                                s.fields = s.fields.filter((f: any) => f.id !== qtyField.id && f.id !== noteField.id);
                                                                setFormData(newData);
                                                            }}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                            title="ลบรายการ"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div className="p-2 border-t bg-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newData = { ...formData };
                                            const s = newData.sections.find((s: any) => s.id === section.id);
                                            const timestamp = Date.now();
                                            s.fields.push(
                                                { id: `custom_${timestamp}_qty`, label: 'รายการใหม่ (จำนวน)', type: 'text', placeholder: '1', value: '' },
                                                { id: `custom_${timestamp}_note`, label: 'รายการใหม่ (หมายเหตุ)', type: 'text', value: '' }
                                            );
                                            setFormData(newData);
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        เพิ่มรายการ
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {section.fields.map((field: any) => (
                                    <div key={field.id} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {field.label}
                                        </label>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                value={field.value || ''}
                                                onChange={(e) => handleFieldChange(section.id, field.id, e.target.value)}
                                                className="w-full p-2 border rounded-lg h-32 print:border-b print:border-t-0 print:border-x-0 print:rounded-none print:border-gray-400 print:placeholder-transparent print:h-auto print:resize-none"
                                                placeholder={field.placeholder}
                                            />
                                        ) : field.type === 'image' ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                handleFieldChange(section.id, field.id, reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="w-full p-2 border rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                {field.value && (
                                                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
                                                        <img
                                                            src={field.value}
                                                            alt="Preview"
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFieldChange(section.id, field.id, '')}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors print:hidden"
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
                                                onChange={(e) => handleFieldChange(section.id, field.id, e.target.value)}
                                                className="w-full p-2 border rounded-lg print:border-b print:border-t-0 print:border-x-0 print:rounded-none print:border-gray-400 print:placeholder-transparent"
                                                placeholder={field.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Lessee Button logic: Show only on the last visible lessee section */}
                        {section.id === 'sec_lessee' && visibleLessees === 1 && (
                            <div className="mt-4 border-t pt-4 print:hidden">
                                <button type="button" onClick={() => setVisibleLessees(2)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                                    + เพิ่มผู้เช่าคนที่ 2
                                </button>
                            </div>
                        )}
                        {section.id === 'sec_lessee2' && visibleLessees === 2 && (
                            <div className="mt-4 border-t pt-4 print:hidden">
                                <button type="button" onClick={() => setVisibleLessees(3)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                                    + เพิ่มผู้เช่าคนที่ 3
                                </button>
                            </div>
                        )}
                        {section.id === 'sec_lessee3' && visibleLessees === 3 && (
                            <div className="mt-4 border-t pt-4 print:hidden">
                                <button type="button" onClick={() => setVisibleLessees(4)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                                    + เพิ่มผู้เช่าคนที่ 4
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="flex flex-col md:flex-row justify-end gap-4 print:hidden">
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors w-full md:w-auto text-center"
                >
                    พิมพ์แบบฟอร์มเปล่า
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors w-full md:w-auto text-center"
                >
                    ยกเลิก
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 w-full md:w-auto text-center"
                >
                    {loading ? 'กำลังบันทึก...' : 'บันทึกสัญญา'}
                </button>
            </div>
        </form >
    );
}
