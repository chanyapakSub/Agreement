'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, Link as LinkIcon, Edit, Save, Check, ArrowLeft } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { toThaiBaht, toEnglishBaht } from '../../../lib/text-utils';

function SignatureInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    const sigRef = useRef<any>(null);
    const [isEditing, setIsEditing] = useState(!value);

    const clear = () => {
        sigRef.current?.clear();
        onChange('');
    };

    const save = () => {
        if (!sigRef.current?.isEmpty()) {
            onChange(sigRef.current.getTrimmedCanvas().toDataURL('image/png'));
            setIsEditing(false);
        } else {
            onChange('');
            setIsEditing(false);
        }
    };

    if (!isEditing && value) {
        return (
            <div className="border p-4 rounded text-center bg-gray-50">
                <p className="mb-2 font-bold text-gray-700">{label}</p>
                <div className="h-24 flex items-center justify-center mb-2">
                    <img src={value} className="max-h-full max-w-full" alt="Signature" />
                </div>
                <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:underline">แก้ไขลายเซ็น</button>
            </div>
        );
    }

    return (
        <div className="border p-4 rounded bg-white">
            <p className="mb-2 font-bold text-gray-700">{label}</p>
            <div className="border border-dashed border-gray-300 rounded mb-2 bg-white">
                <SignatureCanvas
                    ref={sigRef}
                    canvasProps={{ className: 'sigCanvas w-full h-32 cursor-crosshair' }}
                />
            </div>
            <div className="flex gap-2">
                <button onClick={save} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">ยืนยัน</button>
                <button onClick={() => sigRef.current?.clear()} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">ล้าง</button>
                {value && <button onClick={() => setIsEditing(false)} className="text-gray-500 text-sm ml-auto hover:text-gray-700">ยกเลิก</button>}
            </div>
        </div>
    );
}

export function ContractDetail({ contract }: { contract: any }) {
    const router = useRouter();
    const [data, setData] = useState(JSON.parse(contract.data));
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Signature States
    const [lessorSig, setLessorSig] = useState(contract.lessorSignature || '');
    const [lesseeSig, setLesseeSig] = useState(contract.lesseeSignature || '');
    const [witness1Sig, setWitness1Sig] = useState(data.witness1Signature || '');
    const [witness2Sig, setWitness2Sig] = useState(data.witness2Signature || '');

    const handlePrint = () => {
        window.print();
    };

    const handleCopyLink = async (role: 'lessor' | 'lessee') => {
        // Generate tokens if not exists
        if (!contract.lessorToken || !contract.lesseeToken) {
            // Call API to generate token
            const res = await fetch(`/api/contracts/${contract.id}/token`, { method: 'POST' });

            if (!res.ok) {
                try {
                    const err = await res.json();
                    alert(`เกิดข้อผิดพลาด: ${err.error || 'ไม่สามารถสร้างลิงก์ได้'}`);
                } catch (e) {
                    alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง');
                }
                return;
            }

            const updated = await res.json();
            contract.lessorToken = updated.lessorToken;
            contract.lesseeToken = updated.lesseeToken;
            contract.token = updated.token;
        }

        const token = role === 'lessor' ? contract.lessorToken : contract.lesseeToken;
        const url = `${window.location.origin}/sign/${contract.id}/${token}`;
        navigator.clipboard.writeText(url);
        alert(`คัดลอกลิงก์สำหรับ${role === 'lessor' ? 'ผู้ให้เช่า' : 'ผู้เช่า'}แล้ว`);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Update data with witness signatures
            const updatedData = {
                ...data,
                witness1Signature: witness1Sig,
                witness2Signature: witness2Sig
            };

            await fetch(`/api/contracts/${contract.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: JSON.stringify(updatedData),
                    lessorSignature: lessorSig,
                    lesseeSignature: lesseeSig
                }),
            });

            // Update local state to reflect changes immediately if needed
            setData(updatedData);
            contract.lessorSignature = lessorSig;
            contract.lesseeSignature = lesseeSig;

            setIsEditing(false);
            router.refresh();
        } catch (e) {
            alert('Error saving');
        } finally {
            setLoading(false);
        }
    };

    // Flatten data for template replacement
    const flattenedData = useMemo(() => {
        const flat: Record<string, string> = {};
        data.sections?.forEach((section: any) => {
            section.fields?.forEach((field: any) => {
                flat[field.id] = field.value || '';
            });
        });
        // Add meta fields
        flat['signature'] = contract.signature || '';
        flat['lessorSignature'] = lessorSig || contract.lessorSignature || '';
        flat['lesseeSignature'] = lesseeSig || contract.lesseeSignature || '';
        flat['witness1Signature'] = witness1Sig || data.witness1Signature || '';
        flat['witness2Signature'] = witness2Sig || data.witness2Signature || '';
        return flat;
    }, [data, contract.signature, contract.lessorSignature, contract.lesseeSignature, lessorSig, lesseeSig, witness1Sig, witness2Sig]);

    // Render custom layout if available
    const renderLayout = () => {
        if (!data.layout) return null;

        let html = data.layout;

        // --- PATCH LOGIC FOR DUAL SIGNING ---
        // 1. Add Lessor Signature if missing (Standard Template)
        if (!html.includes('{{lessorSignature}}') && html.includes('ลงชื่อ ผู้ให้เช่า')) {
            html = html.replace(
                '<div class="border-b border-black w-3/4 mx-auto mb-2 h-16 flex items-end justify-center"></div>',
                '<div class="border-b border-black w-3/4 mx-auto mb-2 h-16 flex items-end justify-center relative"><img src="{{lessorSignature}}" class="h-14 absolute bottom-0" style="display: {{lessorSignature ? \'block\' : \'none\'}}" /></div>'
            );
        }

        // 2. Update Lessee Signature (legacy {{signature}} to {{lesseeSignature}})
        if (html.includes('{{signature}}')) {
            html = html.replace(/{{signature}}/g, '{{lesseeSignature}}');
        }

        // 3. Patch Witness Signatures
        // Replace first witness placeholder
        if (flattenedData['witness1Signature']) {
            html = html.replace(
                '<div class="border-b border-gray-300 w-3/4 mx-auto mb-2 h-12"></div>',
                `<div class="border-b border-gray-300 w-3/4 mx-auto mb-2 h-12 flex items-end justify-center relative"><img src="{{witness1Signature}}" class="h-12 absolute bottom-0" /></div>`
            );
        }
        // Replace second witness placeholder (if first was replaced, this matches the next one)
        if (flattenedData['witness2Signature']) {
            html = html.replace(
                '<div class="border-b border-gray-300 w-3/4 mx-auto mb-2 h-12"></div>',
                `<div class="border-b border-gray-300 w-3/4 mx-auto mb-2 h-12 flex items-end justify-center relative"><img src="{{witness2Signature}}" class="h-12 absolute bottom-0" /></div>`
            );
        }
        // ------------------------------------

        // Helper to generate inventory table HTML
        const generateInventoryTable = (sectionId: string) => {
            const section = data.sections?.find((s: any) => s.id === sectionId);
            if (!section) return '';

            const rows = section.fields
                .filter((f: any) => f.id.endsWith('_qty'))
                .map((qtyField: any) => {
                    const noteField = section.fields.find((f: any) => f.id === qtyField.id.replace('_qty', '_note'));
                    const label = qtyField.label.replace(' (จำนวน)', '');
                    const qty = qtyField.value || '';
                    const note = noteField?.value || '';

                    return `
                        <tr>
                            <td class="border border-black p-1">${label}</td>
                            <td class="border border-black p-1 text-center">${qty}</td>
                            <td class="border border-black p-1">${note}</td>
                        </tr>
                    `;
                }).join('');

            return `
                <table class="w-full border-collapse border border-black mb-8">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="border border-black p-2 w-1/2">List</th>
                            <th class="border border-black p-2 w-1/6">Quantity</th>
                            <th class="border border-black p-2">Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            `;
        };

        // Replace table placeholders
        html = html.replace('{{sec_appliances_table}}', generateInventoryTable('sec_appliances'));
        html = html.replace('{{sec_furniture_table}}', generateInventoryTable('sec_furniture'));

        // Replace {{expression}} with value
        html = html.replace(/{{(.*?)}}/g, (match: string, expression: string) => {
            const content = expression.trim();

            // Check for modifiers (key:modifier)
            const [key, modifier] = content.split(':').map(s => s.trim());

            // 1. Direct key lookup with modifier
            if (flattenedData[key] !== undefined) {
                const val = flattenedData[key];
                if (modifier === 'thai') return toThaiBaht(val);
                if (modifier === 'english') return toEnglishBaht(val);
                return val;
            }

            // 2. Simple Ternary: key ? 'val1' : 'val2'
            // Supports: variable ? 'block' : 'none'
            const ternaryMatch = content.match(/^(\w+)\s*\?\s*'([^']*)'\s*:\s*'([^']*)'$/);
            if (ternaryMatch) {
                const [_, varName, trueVal, falseVal] = ternaryMatch;
                const val = flattenedData[varName];
                return val ? trueVal : falseVal;
            }

            return '';
        });

        return <div dangerouslySetInnerHTML={{ __html: html }} className="print:p-0" />;
    };

    return (
        <div className="space-y-6 pb-24 md:pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={20} /> กลับ
                </button>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {isEditing ? (
                        <button onClick={handleSave} disabled={loading} className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <Save size={18} /> บันทึก
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Edit size={18} /> แก้ไขข้อมูล
                        </button>
                    )}
                    <button onClick={handlePrint} className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
                        <Printer size={18} /> พิมพ์ / PDF
                    </button>
                    <div className="flex flex-col md:flex-row gap-2">
                        <button onClick={() => handleCopyLink('lessee')} className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                            <LinkIcon size={16} /> ลิงก์ผู้เช่า
                        </button>
                        <button onClick={() => handleCopyLink('lessor')} className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                            <LinkIcon size={16} /> ลิงก์ผู้ให้เช่า
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 md:p-8 shadow-sm border print:shadow-none print:border-none print:p-0 min-h-[297mm] overflow-x-auto">
                {/* If not editing and layout exists, show the custom layout */}
                {!isEditing && data.layout ? (
                    renderLayout()
                ) : (
                    /* Default Form View / Edit Mode */
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
                            <p className="text-sm text-gray-500 print:hidden mb-4">ID: {contract.identifier}</p>

                            <div className="flex justify-center gap-4 print:hidden">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${contract.lesseeSignature ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                    ผู้เช่า: {contract.lesseeSignature ? 'ลงนามแล้ว' : 'รอลงนาม'}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${contract.lessorSignature ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                    ผู้ให้เช่า: {contract.lessorSignature ? 'ลงนามแล้ว' : 'รอลงนาม'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 text-sm leading-relaxed">
                            {data.sections.map((section: any) => (
                                <div key={section.id} className="mb-6">
                                    <h3 className="font-bold text-lg mb-3 bg-gray-50 p-2 rounded">{section.title}</h3>
                                    <div className="grid grid-cols-12 gap-4">
                                        {section.fields.map((field: any) => (
                                            <div key={field.id} className={`${field.type === 'textarea' ? 'col-span-12' : 'col-span-6'} mb-2`}>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                                    {field.label} <span className="text-gray-300 font-normal">({field.id})</span>
                                                </label>
                                                {isEditing ? (
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
                                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                            rows={4}
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
                                                                            const newData = { ...data };
                                                                            const s = newData.sections.find((sec: any) => sec.id === section.id);
                                                                            const f = s.fields.find((fi: any) => fi.id === field.id);
                                                                            f.value = reader.result as string;
                                                                            setData(newData);
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                                className="w-full p-2 border rounded text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                                                                        onClick={() => {
                                                                            const newData = { ...data };
                                                                            const s = newData.sections.find((sec: any) => sec.id === section.id);
                                                                            const f = s.fields.find((fi: any) => fi.id === field.id);
                                                                            f.value = '';
                                                                            setData(newData);
                                                                        }}
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
                                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                    )
                                                ) : (
                                                    <div className="p-2 bg-gray-50 rounded border border-gray-100 min-h-[38px]">
                                                        {field.type === 'image' && field.value ? (
                                                            <img src={field.value} alt={field.label} className="h-32 object-contain" />
                                                        ) : (
                                                            field.value || '-'
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Signatures Section in Edit Mode */}
                            {isEditing && (
                                <div className="mb-6 border-t pt-6">
                                    <h3 className="font-bold text-lg mb-4 bg-blue-50 p-2 rounded text-blue-800">ลงนามสัญญา (Signatures)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <SignatureInput
                                            label="ผู้ให้เช่า (Lessor)"
                                            value={lessorSig}
                                            onChange={setLessorSig}
                                        />
                                        <SignatureInput
                                            label="ผู้เช่า (Lessee)"
                                            value={lesseeSig}
                                            onChange={setLesseeSig}
                                        />
                                        <SignatureInput
                                            label="พยาน 1 (Witness 1)"
                                            value={witness1Sig}
                                            onChange={setWitness1Sig}
                                        />
                                        <SignatureInput
                                            label="พยาน 2 (Witness 2)"
                                            value={witness2Sig}
                                            onChange={setWitness2Sig}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Default Signature Area (only show if not using custom layout AND not editing) */}
                        {!isEditing && (
                            <div className="mt-12 grid grid-cols-2 gap-8 print:mt-24 border-t pt-8">
                                <div className="text-center">
                                    <div className="border-b border-black w-3/4 mx-auto mb-2 h-16 flex items-end justify-center relative">
                                        {contract.lessorSignature && <img src={contract.lessorSignature} className="h-14 absolute bottom-0" />}
                                    </div>
                                    <p>ลงชื่อ ผู้ให้เช่า</p>
                                </div>
                                <div className="text-center">
                                    <div className="border-b border-black w-3/4 mx-auto mb-2 h-16 flex items-end justify-center relative">
                                        {contract.lesseeSignature && <img src={contract.lesseeSignature} className="h-14 absolute bottom-0" />}
                                    </div>
                                    <p>ลงชื่อ ผู้เช่า</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
