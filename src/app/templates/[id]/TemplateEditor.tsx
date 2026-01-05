'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, Save, FileText, Type, Calendar, Hash, LayoutTemplate, List, Image as ImageIcon } from 'lucide-react';

interface Field {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
}

interface Section {
    id: string;
    title: string;
    fields: Field[];
}

interface TemplateData {
    title: string;
    sections: Section[];
    layout?: string;
}

import {
    DEFAULT_LEASE_SECTIONS, DEFAULT_LEASE_LAYOUT,
    DEFAULT_RECEIPT_SECTIONS, DEFAULT_RECEIPT_LAYOUT,
    DEFAULT_AGENCY_SECTIONS, DEFAULT_AGENCY_LAYOUT,
    DEFAULT_BUY_SECTIONS, DEFAULT_BUY_LAYOUT,
    DEFAULT_RESERVATION_SECTIONS, DEFAULT_RESERVATION_LAYOUT
} from '../../../lib/contract-defaults';





export function TemplateEditor({ template }: { template: any }) {
    const [data, setData] = useState<TemplateData>({ title: '', sections: [] });
    const [activeTab, setActiveTab] = useState<'fields' | 'layout'>('fields');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        try {
            const parsed = JSON.parse(template.content);
            setData(parsed);
        } catch (e) {
            console.error('Failed to parse template content', e);
            setData({ title: template.name, sections: [] });
        }
    }, [template.content, template.name]);

    const isReceipt = data.title.toLowerCase().includes('receipt') || data.title.includes('ใบเสร็จ');
    const isAgency = data.title.includes('นายหน้า') || data.title.toLowerCase().includes('agency');
    const isBuy = data.title.toLowerCase().includes('buy') || data.title.includes('ซื้อ');
    const isReservation = data.title.toLowerCase().includes('reser') || data.title.includes('จอง');

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/templates/${template.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: JSON.stringify(data) }),
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || 'Failed to save');
            }

            alert('บันทึกเรียบร้อย');
            router.refresh();
        } catch (e: any) {
            console.error(e);
            alert('Error saving: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const addSection = () => {
        const newSection: Section = {
            id: `section_${Date.now()} `,
            title: 'หัวข้อใหม่',
            fields: []
        };
        setData({ ...data, sections: [...data.sections, newSection] });
    };

    const removeSection = (index: number) => {
        if (!confirm('ต้องการลบหัวข้อนี้ใช่หรือไม่?')) return;
        const newSections = [...data.sections];
        newSections.splice(index, 1);
        setData({ ...data, sections: newSections });
    };

    const updateSection = (index: number, field: keyof Section, value: any) => {
        const newSections = [...data.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setData({ ...data, sections: newSections });
    };

    const addField = (sectionIndex: number) => {
        const newField: Field = {
            id: `field_${Date.now()} `,
            label: 'ฟิลด์ใหม่',
            type: 'text'
        };
        const newSections = [...data.sections];
        newSections[sectionIndex].fields.push(newField);
        setData({ ...data, sections: newSections });
    };

    const removeField = (sectionIndex: number, fieldIndex: number) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].fields.splice(fieldIndex, 1);
        setData({ ...data, sections: newSections });
    };

    const updateField = (sectionIndex: number, fieldIndex: number, key: keyof Field, value: any) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].fields[fieldIndex] = {
            ...newSections[sectionIndex].fields[fieldIndex],
            [key]: value
        };
        setData({ ...data, sections: newSections });
    };

    return (
        <div className="space-y-6">
            {/* Header / Title */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                <div className="flex-1 mr-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อเอกสารสัญญา</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="w-full text-xl font-semibold px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="เช่น สัญญาเช่าคอนโด"
                    />
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('fields')}
                        className={`px - 4 py - 2 rounded - md text - sm font - medium transition - all flex items - center gap - 2 ${activeTab === 'fields' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'} `}
                    >
                        <List size={16} /> โครงสร้างฟอร์ม
                    </button>
                    <button
                        onClick={() => setActiveTab('layout')}
                        className={`px - 4 py - 2 rounded - md text - sm font - medium transition - all flex items - center gap - 2 ${activeTab === 'layout' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'} `}
                    >
                        <LayoutTemplate size={16} /> จัดหน้าเอกสาร
                    </button>
                </div>
            </div>

            {activeTab === 'fields' ? (
                /* Fields Editor */
                <div className="space-y-6">
                    {data.sections.map((section, sIndex) => (
                        <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Section Header */}
                            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-4">
                                <div className="p-2 bg-white rounded shadow-sm">
                                    <GripVertical size={16} className="text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 font-medium">ชื่อหัวข้อ</label>
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => updateSection(sIndex, 'title', e.target.value)}
                                        className="block w-full bg-transparent font-medium text-gray-900 focus:outline-none focus:border-b-2 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={() => removeSection(sIndex)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="ลบหัวข้อ"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Fields */}
                            <div className="p-4 space-y-3">
                                {section.fields.map((field, fIndex) => (
                                    <div key={field.id} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-200 transition-colors group">
                                        <div className="mt-3 text-gray-300">
                                            <GripVertical size={14} />
                                        </div>

                                        <div className="flex-1 grid grid-cols-12 gap-3">
                                            <div className="col-span-5">
                                                <label className="text-xs text-gray-500">ชื่อฟิลด์ (Label)</label>
                                                <input
                                                    type="text"
                                                    value={field.label}
                                                    onChange={(e) => updateField(sIndex, fIndex, 'label', e.target.value)}
                                                    className="w-full text-sm px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <label className="text-xs text-gray-500">ประเภทข้อมูล</label>
                                                <div className="relative">
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => updateField(sIndex, fIndex, 'type', e.target.value)}
                                                        className="w-full text-sm px-3 py-1.5 border rounded appearance-none focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                                    >
                                                        <option value="text">ข้อความ</option>
                                                        <option value="number">ตัวเลข</option>
                                                        <option value="date">วันที่</option>
                                                        <option value="textarea">ข้อความยาว</option>
                                                        <option value="image">รูปภาพ</option>
                                                    </select>
                                                    <div className="absolute right-2 top-2 pointer-events-none text-gray-400">
                                                        {field.type === 'text' && <Type size={14} />}
                                                        {field.type === 'number' && <Hash size={14} />}
                                                        {field.type === 'date' && <Calendar size={14} />}
                                                        {field.type === 'textarea' && <FileText size={14} />}
                                                        {field.type === 'image' && <ImageIcon size={14} />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4">
                                                <label className="text-xs text-gray-500">ID (สำหรับอ้างอิงใน Layout)</label>
                                                <input
                                                    type="text"
                                                    value={field.id}
                                                    onChange={(e) => updateField(sIndex, fIndex, 'id', e.target.value)}
                                                    className="w-full text-sm px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500 outline-none font-mono text-gray-600 bg-gray-50"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeField(sIndex, fIndex)}
                                            className="mt-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                            title="ลบฟิลด์"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={() => addField(sIndex)}
                                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <Plus size={16} />
                                    เพิ่มฟิลด์ข้อมูล
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addSection}
                        className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus size={20} />
                        เพิ่มหัวข้อใหม่
                    </button>
                </div>
            ) : (
                /* Layout Editor */
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">HTML Layout Editor</h3>
                            <p className="text-sm text-gray-500">ใช้ {'{{fieldId}}'} เพื่อดึงข้อมูลจากฟอร์มมาแสดง</p>
                        </div>
                        <button
                            onClick={() => {
                                let label = 'สัญญาเช่า';
                                if (isReceipt) label = 'ใบเสร็จ';
                                else if (isAgency) label = 'นายหน้า';
                                else if (isBuy) label = 'จะซื้อจะขาย';
                                else if (isReservation) label = 'ใบจอง';

                                if (confirm(`ยืนยันการโหลดแบบฟอร์ม${label} มาตรฐาน ? ข้อมูลปัจจุบันจะถูกทับ`)) {
                                    if (isReceipt) {
                                        setData({
                                            ...data,
                                            layout: DEFAULT_RECEIPT_LAYOUT,
                                            sections: DEFAULT_RECEIPT_SECTIONS
                                        });
                                    } else if (isAgency) {
                                        setData({
                                            ...data,
                                            layout: DEFAULT_AGENCY_LAYOUT,
                                            sections: DEFAULT_AGENCY_SECTIONS
                                        });
                                    } else if (isBuy) {
                                        setData({
                                            ...data,
                                            layout: DEFAULT_BUY_LAYOUT,
                                            sections: DEFAULT_BUY_SECTIONS
                                        });
                                    } else if (isReservation) {
                                        setData({
                                            ...data,
                                            layout: DEFAULT_RESERVATION_LAYOUT,
                                            sections: DEFAULT_RESERVATION_SECTIONS
                                        });
                                    } else {
                                        setData({
                                            ...data,
                                            layout: DEFAULT_LEASE_LAYOUT,
                                            sections: DEFAULT_LEASE_SECTIONS
                                        });
                                    }
                                }
                            }}
                            className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 transition-colors"
                        >
                            {isReceipt ? 'โหลดแบบฟอร์มใบเสร็จรับเงินมาตรฐาน' :
                                isAgency ? 'โหลดแบบฟอร์มสัญญาแต่งตั้งนายหน้า' :
                                    isBuy ? 'โหลดแบบฟอร์มสัญญาจะซื้อจะขาย' :
                                        isReservation ? 'โหลดแบบฟอร์มใบจอง' :
                                            'โหลดแบบฟอร์มสัญญาเช่ามาตรฐาน'}
                        </button>
                    </div>
                    <textarea
                        value={data.layout || ''}
                        onChange={(e) => setData({ ...data, layout: e.target.value })}
                        className="w-full h-[600px] font-mono text-sm p-4 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="<div>...</div>"
                        spellCheck={false}
                    />
                </div>
            )}

            {/* Sticky Footer */}
            <div className="sticky bottom-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gray-900 text-white px-8 py-3 rounded-full shadow-lg hover:bg-black hover:scale-105 transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:hover:scale-100"
                >
                    <Save size={20} />
                    {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไขทั้งหมด'}
                </button>
            </div>
        </div>
    );
}
