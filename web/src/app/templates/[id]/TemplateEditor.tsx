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

const DEFAULT_LEASE_SECTIONS: Section[] = [
    {
        id: 'sec_contract',
        title: 'ข้อมูลสัญญา',
        fields: [
            { id: 'contractDate', label: 'วันที่ทำสัญญา', type: 'date' },
            { id: 'location', label: 'สถานที่ทำสัญญา', type: 'text' },
            { id: 'roomNumber', label: 'เลขที่ห้อง', type: 'text' },
            { id: 'condoName', label: 'ชื่อโครงการ/คอนโด', type: 'text' },
        ]
    },
    {
        id: 'sec_lessor',
        title: 'ข้อมูลผู้ให้เช่า',
        fields: [
            { id: 'lessor', label: 'ชื่อ-นามสกุล ผู้ให้เช่า', type: 'text' },
            { id: 'lessorPhone', label: 'เบอร์โทรศัพท์', type: 'text' },
            { id: 'lessorId', label: 'เลขบัตรประชาชน', type: 'text' },
            { id: 'lessorAddress', label: 'ที่อยู่', type: 'textarea' },
            { id: 'lessorIdImage', label: 'รูปถ่ายบัตรประชาชน', type: 'image' },
        ]
    },
    {
        id: 'sec_lessee',
        title: 'ข้อมูลผู้เช่า (1)',
        fields: [
            { id: 'lessee', label: 'ชื่อ-นามสกุล ผู้เช่า', type: 'text' },
            { id: 'lesseePhone', label: 'เบอร์โทรศัพท์', type: 'text' },
            { id: 'lesseeId', label: 'เลขบัตรประชาชน/Passport', type: 'text' },
            { id: 'lesseeAddress', label: 'ที่อยู่', type: 'textarea' },
            { id: 'lesseeIdImage', label: 'รูปถ่ายบัตรประชาชน/Passport', type: 'image' },
        ]
    },
    {
        id: 'sec_lessee2',
        title: 'ข้อมูลผู้เช่า (2)',
        fields: [
            { id: 'lessee2', label: 'ชื่อ-นามสกุล ผู้เช่าคนที่ 2', type: 'text' },
            { id: 'lesseePhone2', label: 'เบอร์โทรศัพท์', type: 'text' },
            { id: 'lesseeId2', label: 'เลขบัตรประชาชน/Passport', type: 'text' },
            { id: 'lesseeAddress2', label: 'ที่อยู่', type: 'textarea' },
            { id: 'lesseeIdImage2', label: 'รูปถ่ายบัตรประชาชน/Passport', type: 'image' },
        ]
    },
    {
        id: 'sec_lessee3',
        title: 'ข้อมูลผู้เช่า (3)',
        fields: [
            { id: 'lessee3', label: 'ชื่อ-นามสกุล ผู้เช่าคนที่ 3', type: 'text' },
            { id: 'lesseePhone3', label: 'เบอร์โทรศัพท์', type: 'text' },
            { id: 'lesseeId3', label: 'เลขบัตรประชาชน/Passport', type: 'text' },
            { id: 'lesseeAddress3', label: 'ที่อยู่', type: 'textarea' },
            { id: 'lesseeIdImage3', label: 'รูปถ่ายบัตรประชาชน/Passport', type: 'image' },
        ]
    },
    {
        id: 'sec_lessee4',
        title: 'ข้อมูลผู้เช่า (4)',
        fields: [
            { id: 'lessee4', label: 'ชื่อ-นามสกุล ผู้เช่าคนที่ 4', type: 'text' },
            { id: 'lesseePhone4', label: 'เบอร์โทรศัพท์', type: 'text' },
            { id: 'lesseeId4', label: 'เลขบัตรประชาชน/Passport', type: 'text' },
            { id: 'lesseeAddress4', label: 'ที่อยู่', type: 'textarea' },
            { id: 'lesseeIdImage4', label: 'รูปถ่ายบัตรประชาชน/Passport', type: 'image' },
        ]
    },
    {
        id: 'sec_details',
        title: 'รายละเอียดการเช่า',
        fields: [
            { id: 'duration', label: 'ระยะเวลาเช่า (เช่น 1 ปี)', type: 'text' },
            { id: 'startDate', label: 'วันเริ่มสัญญา', type: 'date' },
            { id: 'endDate', label: 'วันสิ้นสุดสัญญา', type: 'date' },
            { id: 'rentAmount', label: 'ค่าเช่า (บาท/เดือน)', type: 'number' },
            { id: 'dueDay', label: 'กำหนดชำระทุกวันที่', type: 'number' },
        ]
    },
    {
        id: 'sec_payment',
        title: 'ข้อมูลบัญชีธนาคาร',
        fields: [
            { id: 'bankName', label: 'ธนาคาร', type: 'text' },
            { id: 'accountName', label: 'ชื่อบัญชี', type: 'text' },
            { id: 'accountNumber', label: 'เลขที่บัญชี', type: 'text' },
            { id: 'bankAccountImage', label: 'รูปหน้าสมุดบัญชี', type: 'image' },
        ]
    },
    {
        id: 'sec_deposit',
        title: 'เงินประกันและค่าปรับ',
        fields: [
            { id: 'deposit', label: 'เงินประกัน (บาท)', type: 'number' },
            { id: 'fineAmount', label: 'ค่าปรับล่าช้า (บาท/วัน)', type: 'number' },
            { id: 'cleaningFee', label: 'ค่าทำความสะอาด (บาท)', type: 'number' },
            { id: 'acCleaningFee', label: 'ค่าล้างแอร์ (บาท)', type: 'number' },
        ]
    },
    {
        id: 'sec_docs',
        title: 'เอกสารเพิ่มเติม',
        fields: [
            { id: 'houseRegImage', label: 'รูปสำเนาทะเบียนบ้าน', type: 'image' },
        ]
    },
    {
        id: 'sec_appliances',
        title: 'รายการกุญแจและเครื่องใช้ไฟฟ้า',
        fields: [
            { id: 'app_aircon_qty', label: 'Air conditioner with remote control/เครื่องปรับอากาศ + รีโมท (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_aircon_note', label: 'Air conditioner with remote control/เครื่องปรับอากาศ + รีโมท (หมายเหตุ)', type: 'text' },
            { id: 'app_waterheater_qty', label: 'Water heater/เครื่องทำน้ำอุ่น (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_waterheater_note', label: 'Water heater/เครื่องทำน้ำอุ่น (หมายเหตุ)', type: 'text' },
            { id: 'app_washingmachine_qty', label: 'Washing machine/เครื่องซักผ้า (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_washingmachine_note', label: 'Washing machine/เครื่องซักผ้า (หมายเหตุ)', type: 'text' },
            { id: 'app_dryer_qty', label: 'Dryer/เครื่องอบผ้า (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_dryer_note', label: 'Dryer/เครื่องอบผ้า (หมายเหตุ)', type: 'text' },
            { id: 'app_airpurifier_qty', label: 'Air Purifier/เครื่องกรองอากาศ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_airpurifier_note', label: 'Air Purifier/เครื่องกรองอากาศ (หมายเหตุ)', type: 'text' },
            { id: 'app_stove_qty', label: 'Cooker Hood + Electric Stove/เครื่องดูดควัน+เตาไฟฟ้า (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_stove_note', label: 'Cooker Hood + Electric Stove/เครื่องดูดควัน+เตาไฟฟ้า (หมายเหตุ)', type: 'text' },
            { id: 'app_lightbulb_qty', label: 'Light Bulb/หลอดไฟ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_lightbulb_note', label: 'Light Bulb/หลอดไฟ (หมายเหตุ)', type: 'text' },
            { id: 'app_tv_qty', label: 'TV with remote/โทรทัศน์+รีโมท (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_tv_note', label: 'TV with remote/โทรทัศน์+รีโมท (หมายเหตุ)', type: 'text' },
            { id: 'app_fridge_qty', label: 'Refrigerator/ตู้เย็น (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_fridge_note', label: 'Refrigerator/ตู้เย็น (หมายเหตุ)', type: 'text' },
            { id: 'app_microwave_qty', label: 'Microwave/ไมโครเวฟ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_microwave_note', label: 'Microwave/ไมโครเวฟ (หมายเหตุ)', type: 'text' },
            { id: 'app_oven_qty', label: 'Electric oven/เตาไฟฟ้า (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_oven_note', label: 'Electric oven/เตาไฟฟ้า (หมายเหตุ)', type: 'text' },
            { id: 'app_kettle_qty', label: 'Kettle/กาต้มน้ำ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_kettle_note', label: 'Kettle/กาต้มน้ำ (หมายเหตุ)', type: 'text' },
            { id: 'app_iron_qty', label: 'Iron/เตารีด + Ironing board/โต๊ะรีดผ้า (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_iron_note', label: 'Iron/เตารีด + Ironing board/โต๊ะรีดผ้า (หมายเหตุ)', type: 'text' },
            { id: 'app_fan_qty', label: 'Fan/พัดลม (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_fan_note', label: 'Fan/พัดลม (หมายเหตุ)', type: 'text' },
            { id: 'app_lamp_qty', label: 'Lamp/โคมไฟ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_lamp_note', label: 'Lamp/โคมไฟ (หมายเหตุ)', type: 'text' },
            { id: 'app_chandelier_qty', label: 'Chandelier /โคมไฟเพดาน โคมไฟโมเดิร์น แชนเดอเลียร์ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'app_chandelier_note', label: 'Chandelier /โคมไฟเพดาน โคมไฟโมเดิร์น แชนเดอเลียร์ (หมายเหตุ)', type: 'text' },
            { id: 'key_room_qty', label: 'กุญแจสถานที่เช่า (Room Key) (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'key_room_note', label: 'กุญแจสถานที่เช่า (Room Key) (หมายเหตุ)', type: 'text' },
            { id: 'key_card_qty', label: 'คีย์การ์ด (Key Card) (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'key_card_note', label: 'คีย์การ์ด (Key Card) (หมายเหตุ)', type: 'text' },
            { id: 'key_bedroom_qty', label: 'กุญแจห้องนอน (Bed room Key) (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'key_bedroom_note', label: 'กุญแจห้องนอน (Bed room Key) (หมายเหตุ)', type: 'text' },
            { id: 'key_kitchen_qty', label: 'กุญแจห้องครัว (Kitchen Room Key) (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'key_kitchen_note', label: 'กุญแจห้องครัว (Kitchen Room Key) (หมายเหตุ)', type: 'text' },
            { id: 'key_mailbox_qty', label: 'กุญแจตู้จดหมาย (Mailbox Key) (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'key_mailbox_note', label: 'กุญแจตู้จดหมาย (Mailbox Key) (หมายเหตุ)', type: 'text' },
            { id: 'key_sticker_qty', label: 'สติ๊กเกอร์รถ (Sticker for Car) (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'key_sticker_note', label: 'สติ๊กเกอร์รถ (Sticker for Car) (หมายเหตุ)', type: 'text' },
            { id: 'key_epass_qty', label: 'เครื่องผ่านเข้าออกที่จอดรถ (E pass for Car) (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'key_epass_note', label: 'เครื่องผ่านเข้าออกที่จอดรถ (E pass for Car) (หมายเหตุ)', type: 'text' },
        ]
    },
    {
        id: 'sec_furniture',
        title: 'รายการเฟอร์นิเจอร์',
        fields: [
            { id: 'furn_tvcabinet_qty', label: 'TV cabinet/ชั้นวางทีวี (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_tvcabinet_note', label: 'TV cabinet/ชั้นวางทีวี (หมายเหตุ)', type: 'text' },
            { id: 'furn_bed_qty', label: 'Bed with mattress/เตียงพร้อมฟูก (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_bed_note', label: 'Bed with mattress/เตียงพร้อมฟูก (หมายเหตุ)', type: 'text' },
            { id: 'furn_builtin_qty', label: 'Built-in cabinet/ตู้ชั้นวางสำเร็จ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_builtin_note', label: 'Built-in cabinet/ตู้ชั้นวางสำเร็จ (หมายเหตุ)', type: 'text' },
            { id: 'furn_wardrobe_qty', label: 'Wardrobe/ตู้เสื้อผ้า (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_wardrobe_note', label: 'Wardrobe/ตู้เสื้อผ้า (หมายเหตุ)', type: 'text' },
            { id: 'furn_bedside_qty', label: 'Bedside table /โต๊ะข้างเตียง (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_bedside_note', label: 'Bedside table /โต๊ะข้างเตียง (หมายเหตุ)', type: 'text' },
            { id: 'furn_shower_qty', label: 'Shower room divider /ฉากกั้นห้องอาบน้ำ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_shower_note', label: 'Shower room divider /ฉากกั้นห้องอาบน้ำ (หมายเหตุ)', type: 'text' },
            { id: 'furn_toilet_qty', label: 'Toilet + Toilet sprayer/ชักโครก+สายฉีดชำระ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_toilet_note', label: 'Toilet + Toilet sprayer/ชักโครก+สายฉีดชำระ (หมายเหตุ)', type: 'text' },
            { id: 'furn_bathtub_qty', label: 'Bathtub/อ่างอาบน้ำ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_bathtub_note', label: 'Bathtub/อ่างอาบน้ำ (หมายเหตุ)', type: 'text' },
            { id: 'furn_kitchen_qty', label: 'Kitchen set with sink /ชุดครัว พร้อมซิงค์ล้างมือ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_kitchen_note', label: 'Kitchen set with sink /ชุดครัว พร้อมซิงค์ล้างมือ (หมายเหตุ)', type: 'text' },
            { id: 'furn_sink_qty', label: 'Sinks and faucets /อ่างล้างมือและก๊อกน้ำ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_sink_note', label: 'Sinks and faucets /อ่างล้างมือและก๊อกน้ำ (หมายเหตุ)', type: 'text' },
            { id: 'furn_carpet_qty', label: 'Carpet/พรม (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_carpet_note', label: 'Carpet/พรม (หมายเหตุ)', type: 'text' },
            { id: 'furn_centertable_qty', label: 'Center table/โต๊ะกลางรับแขก (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_centertable_note', label: 'Center table/โต๊ะกลางรับแขก (หมายเหตุ)', type: 'text' },
            { id: 'furn_shoescabinet_qty', label: 'Shoes cabinet/ตู้ชั้นวางรองเท้า (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_shoescabinet_note', label: 'Shoes cabinet/ตู้ชั้นวางรองเท้า (หมายเหตุ)', type: 'text' },
            { id: 'furn_sofa_qty', label: 'Sofa/โซฟา (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_sofa_note', label: 'Sofa/โซฟา (หมายเหตุ)', type: 'text' },
            { id: 'furn_bedding_qty', label: 'Bedding set /ชุดที่นอน (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_bedding_note', label: 'Bedding set /ชุดที่นอน (หมายเหตุ)', type: 'text' },
            { id: 'furn_dressing_qty', label: 'Dressing table set/ชุดโต๊ะเครื่องแป้ง (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_dressing_note', label: 'Dressing table set/ชุดโต๊ะเครื่องแป้ง (หมายเหตุ)', type: 'text' },
            { id: 'furn_dining_qty', label: 'Dining table set with chair/ชุดโต๊ะทานอาหาร พร้อมเก้าอี้ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_dining_note', label: 'Dining table set with chair/ชุดโต๊ะทานอาหาร พร้อมเก้าอี้ (หมายเหตุ)', type: 'text' },
            { id: 'furn_desk_qty', label: 'Desk table with chair/โต๊ะทำงานพร้อมเก้าอี้ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_desk_note', label: 'Desk table with chair/โต๊ะทำงานพร้อมเก้าอี้ (หมายเหตุ)', type: 'text' },
            { id: 'furn_curtain_qty', label: 'Curtain/ผ้าม่าน (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_curtain_note', label: 'Curtain/ผ้าม่าน (หมายเหตุ)', type: 'text' },
            { id: 'furn_flooring_qty', label: 'Room laminate flooring /พื้นลามิเนต (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_flooring_note', label: 'Room laminate flooring /พื้นลามิเนต (หมายเหตุ)', type: 'text' },
            { id: 'furn_blind_qty', label: 'Bamboo blind /มู่ลี่ (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_blind_note', label: 'Bamboo blind /มู่ลี่ (หมายเหตุ)', type: 'text' },
            { id: 'furn_frame_qty', label: 'Picture frame /กรอบรูป (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_frame_note', label: 'Picture frame /กรอบรูป (หมายเหตุ)', type: 'text' },
            { id: 'furn_crockery_qty', label: 'Crockery Set ( photos)/ชุดถ้วยจาน ช้อนส้อม (ภาพถ่าย) (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_crockery_note', label: 'Crockery Set ( photos)/ชุดถ้วยจาน ช้อนส้อม (ภาพถ่าย) (หมายเหตุ)', type: 'text' },
            { id: 'furn_rack_qty', label: 'Clothes drying rack outside the balcony /ราวตากผ้านอกระเบียง (จำนวน)', type: 'text', placeholder: '1' },
            { id: 'furn_rack_note', label: 'Clothes drying rack outside the balcony /ราวตากผ้านอกระเบียง (หมายเหตุ)', type: 'text' },
        ]
    }
];

const DEFAULT_LEASE_LAYOUT = `<div class="max-w-[210mm] mx-auto p-8 leading-relaxed text-black" style="font-family: 'Cordia New', sans-serif; font-size: 14pt;">
  <div class="flex justify-between items-start mb-6">
      <div class="w-1/3">
          <img src="/logo_PL_property.png" alt="PL Property" class="h-20 object-contain" />
      </div>
      <div class="w-1/3 text-center">
          <h1 class="font-bold" style="font-size: 16pt;">LEASE AGREEMENT<br>สัญญาเช่า</h1>
      </div>
      <div class="w-1/3 text-right">
          Date/วันที่ <span class="font-bold border-b border-dotted border-black px-2">{{contractDate}}</span>
      </div>
  </div>
  
  <p class="mb-4">
    Written at/เขียนที่ <span class="font-bold border-b border-dotted border-black px-2">{{location}}</span>
  </p>

  <p class="mb-4 text-justify indent-8">
    This Lease Agreement (This “Agreement”) made for the lease of “Premises of rental” number <span class="font-bold border-b border-dotted border-black px-2">{{roomNumber}}</span> 
    Of the project name/address <span class="font-bold border-b border-dotted border-black px-2">{{condoName}}</span> 
    Called the “Premises of rental” for the benefit of living only with equipment and facilities which is installed in the “Premises of rental" with details in the form of Furniture and Appliance List for the “Premises of rental" condition and items of furniture and appliances in the "Premises of rental " annex to this contract and to be regarded as part of this contract as well.
  </p>
  <p class="mb-6 text-justify indent-8">
    สัญญาเช่าสถานที่เช่า ฉบับนี้ (ต่อไปจะเรียกว่า “สัญญา” ) เพื่อการเช่า”สถานที่เช่า”เลขที่ <span class="font-bold border-b border-dotted border-black px-2">{{roomNumber}}</span> 
    ของโครงการชื่อ/ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{condoName}}</span> 
    ต่อไปนี้ในสัญญาเรียกว่า “สถานที่เช่า” เพื่อประโยชน์ในการอยู่อาศัยเท่านั้น พร้อมอุปกรณ์และสิ่งอำนวยความสะดวก ซึ่งติดตั้งอยู่ภายใน “สถานที่เช่า” โดยมีรายละเอียดตามแบบบันทึกการตรวจรับสภาพ “สถานที่เช่า” และรายการเฟอร์นิเจอร์และเครื่องใช้ภายใน “สถานที่เช่า” แนบท้ายสัญญานี้ และให้ถือเป็นส่วนหนึ่งของสัญญานี้ด้วย
  </p>

  <div class="mb-4">
    ผู้ให้เช่า / The Lessor : <span class="font-bold border-b border-dotted border-black px-2">{{lessor}}</span> (Tel <span class="font-bold border-b border-dotted border-black px-2">{{lessorPhone}}</span>)<br/>
    เลขประจําตัวประชาชน/ID Card No <span class="font-bold border-b border-dotted border-black px-2">{{lessorId}}</span> ที่อยู่ / Address <span class="font-bold border-b border-dotted border-black px-2">{{lessorAddress}}</span><br/>
    called the “Lessor” / ต่อไปในสัญญานี้เรียกว่า “ผู้ให้เช่า” ฝ่ายหนึ่ง
  </div>

  <div class="mb-6">
    ผู้เช่าที่ (1) / The Lessee (1) : <span class="font-bold border-b border-dotted border-black px-2">{{lessee}}</span> (Tel <span class="font-bold border-b border-dotted border-black px-2">{{lesseePhone}}</span>)<br/>
    เลขประจําตัว/Passport No. <span class="font-bold border-b border-dotted border-black px-2">{{lesseeId}}</span> ที่อยู่ / Address <span class="font-bold border-b border-dotted border-black px-2">{{lesseeAddress}}</span><br/>
    called the “Lessee” / ต่อไปในสัญญานี้เรียกว่า “ผู้เช่า”
  </div>

  <div class="mb-6" style="display: {{lessee2 ? 'block' : 'none'}}">
    ผู้เช่าที่ (2) / The Lessee (2) : <span class="font-bold border-b border-dotted border-black px-2">{{lessee2}}</span> (Tel <span class="font-bold border-b border-dotted border-black px-2">{{lesseePhone2}}</span>)<br/>
    เลขประจําตัว/Passport No. <span class="font-bold border-b border-dotted border-black px-2">{{lesseeId2}}</span> ที่อยู่ / Address <span class="font-bold border-b border-dotted border-black px-2">{{lesseeAddress2}}</span><br/>
    called the “Lessee” / ต่อไปในสัญญานี้เรียกว่า “ผู้เช่า”
  </div>

  <div class="mb-6" style="display: {{lessee3 ? 'block' : 'none'}}">
    ผู้เช่าที่ (3) / The Lessee (3) : <span class="font-bold border-b border-dotted border-black px-2">{{lessee3}}</span> (Tel <span class="font-bold border-b border-dotted border-black px-2">{{lesseePhone3}}</span>)<br/>
    เลขประจําตัว/Passport No. <span class="font-bold border-b border-dotted border-black px-2">{{lesseeId3}}</span> ที่อยู่ / Address <span class="font-bold border-b border-dotted border-black px-2">{{lesseeAddress3}}</span><br/>
    called the “Lessee” / ต่อไปในสัญญานี้เรียกว่า “ผู้เช่า”
  </div>

  <div class="mb-6" style="display: {{lessee4 ? 'block' : 'none'}}">
    ผู้เช่าที่ (4) / The Lessee (4) : <span class="font-bold border-b border-dotted border-black px-2">{{lessee4}}</span> (Tel <span class="font-bold border-b border-dotted border-black px-2">{{lesseePhone4}}</span>)<br/>
    เลขประจําตัว/Passport No. <span class="font-bold border-b border-dotted border-black px-2">{{lesseeId4}}</span> ที่อยู่ / Address <span class="font-bold border-b border-dotted border-black px-2">{{lesseeAddress4}}</span><br/>
    called the “Lessee” / ต่อไปในสัญญานี้เรียกว่า “ผู้เช่า”
  </div>

  <p class="mb-4 ">WHERE BY both parties agree as follows / โดยที่ คู่สัญญาทั้งสองฝ่าย ตกลงกันดังนี้</p>

  <div class="mb-4">
    <strong>1. Lease Period :</strong><br/>
    The lease term is for a period of <span class="font-bold border-b border-dotted border-black px-2">{{duration}}</span> commencing on <span class="font-bold border-b border-dotted border-black px-2">{{startDate}}</span> and expiring on <span class="font-bold border-b border-dotted border-black px-2">{{endDate}}</span> In the event that the Lessee wishes to renew the lease, the Lessee must submit a written notice to the Landlord for consideration at least 30 days prior to the expiration date of the lease. If the Lessee fails to provide such notice within the specified period, the lease under this agreement shall automatically terminate on the expiration date.
    <br/>
    ระยะเวลาการเช่า <span class="font-bold border-b border-dotted border-black px-2">{{duration}}</span> เริ่มตั้งแต่วันที่ <span class="font-bold border-b border-dotted border-black px-2">{{startDate}}</span> และ สิ้นสุดลงใน <span class="font-bold border-b border-dotted border-black px-2">{{endDate}}</span>
    กรณีผู้เช่าประสงค์จะต่อสัญญาเช่า ผู้เช่าจะต้องส่งหนังสือแจ้งผู้ให้เช่า เพื่อให้ผู้ให้เช่าพิจารณา เป็นระยะเวลาอย่างน้อย 30 วัน ก่อนวันหมดอายุสัญญา และถ้าผู้เช่าไม่ส่งหนังสือแจ้งดังกล่าวมายังผู้ให้เช่าภายในระยะเวลาที่กำหนดนั้น ให้การเช่าภายใต้สัญญานี้สิ้นสุดลงทันทีในวันหมดอายุสัญญาเช่านั้น
  </div>

  <div class="mb-4">
    <strong>2. Rental Amount :</strong><br/>
    The amount of rent payable by the Lessee in respect of the Premises of rental and the FF & E is Thai Baht <span class="font-bold border-b border-dotted border-black px-2">{{rentAmount}}</span> ({{rentAmount:english}}) per month (the "Rental Amount"). The Lessee agrees to pay each Rental Amount on a monthly basis on the <span class="font-bold border-b border-dotted border-black px-2">{{dueDay}}</span> day of each and every month by way of bank transfer pay into a bank account below :
    <br/>
    ค่าเช่าสำหรับการเช่าสถานที่เช่า และอุปกรณ์เครื่องเรือนจะเป็นจํานวนเท่ากับ <span class="font-bold border-b border-dotted border-black px-2">{{rentAmount}}</span> บาท ({{rentAmount:thai}}) ต่อเดือน (“ค่าเช่า”) โดยผู้เช่าจะต้องชำระค่าเช่าเป็นรายเดือนในวันที่ <span class="font-bold border-b border-dotted border-black px-2">{{dueDay}}</span> ของทุกเดือน โดยการโอนเงินเข้าบัญชีธนาคารด้านล่าง
    <div class="mt-2 p-4 border border-gray-300 rounded bg-gray-50">
        Bank / ธนาคาร <span class="font-bold border-b border-dotted border-black px-2">{{bankName}}</span><br/>
        Account Name / ชื่อบัญชี <span class="font-bold border-b border-dotted border-black px-2">{{accountName}}</span><br/>
        Account Number / เลขที่บัญชี <span class="font-bold border-b border-dotted border-black px-2">{{accountNumber}}</span>
    </div>
  </div>

  <div class="mb-4">
    <strong>3. Security Deposit :</strong><br/>
    The Lessee agrees to pay a security deposit in the amount of Baht <span class="font-bold border-b border-dotted border-black px-2">{{deposit}}</span> ({{deposit:english}}) On <span class="font-bold border-b border-dotted border-black px-2">{{contractDate}}</span> to the Lessor, The security deposit shall be maintained with the Lessor throughout the Lease Term or The Renewal Term (if any) and if the Lessee :<br/>
    ( a ) Fails to comply with, or breaches , any term of this Agreement for whatever reason (including any delay to pay any Rental Amount or failure to comply with any Premises of rental rules or regulations imposed by the juristic person)<br/>
    ( b ) Fails to rent the Premises of rental, or abandons the Premises of rental, prior to the end of Lease Term or the Renewed Term (except where this Agreement is earlier terminated)<br/>
    ( c ) Causes any damage or loss to the Premises of rental of any FF & E<br/>
    then the Lessor may forfeit this security deposit whether in whole or in part as the Lessor considers appropriate compensation for such failure or breach or for making good such damage or loss.<br/>
    Upon the end of the Lease Term or the Renewal Term (if any), when the Lessee returns the Premises of rental as well as all FF & E into the possession of the Lessor in good condition and the Lessee owes no further outstanding debt under this Agreement towards the Lessor, the Lessor shall return the security deposit (or the remaining amount of it) to the Lessee.<br/>
    <br/>
    เงินประกัน – ผู้เช่าตกลงชำระเงินประกัน เป็นจํานวน <span class="font-bold border-b border-dotted border-black px-2">{{deposit}}</span> บาท ({{deposit:thai}}) ให้ผู้ให้เช่าในวันที่ <span class="font-bold border-b border-dotted border-black px-2">{{contractDate}}</span> ทั้งนี้ผู้ให้เช่าจะถือเงินประกันนี้ไว้ตลอดอายุสัญญาเช่า หรือระยะเวลาเช่าที่ต่อออกไป (ถ้ามี) และถ้าผู้เช่า<br/>
    (ก) ไม่ปฏิบัติตามสัญญานี้ หรือผิดสัญญานี้ไม่ว่าข้อหนึ่งใด ไม่ว่าด้วยเหตุผลใด (รวมถึงแต่ไม่จํากัดเฉพาะการ ชําระค่าเช่าล่าช้าและการไม่ยอมปฏิบัติตามกฎเกณฑ์หรือข้อบังคับสถานที่เช่าที่นิติบุคคลสถานที่เช่ากำหนด)<br/>
    (ข) ไม่เช่าสถานที่เช่าจนครบอายุสัญญา หรือระยะเวลาเช่าที่ต่อออกไป หรือละทิ้งสถานที่เช่าก่อนครบอายุสัญญา หรือระยะเวลาเช่าที่ต่อออกไป<br/>
    (ค) ถ้าผู้เช่าทําให้สถานที่เช่า หรืออุปกรณ์เครื่องเรือนเสียหายหรือสูญหาย<br/>
    ผู้ให้เช่ามีสิทธิ์ที่จะยึดเงินประกันนี้ได้ ไม่ว่าทั้งหมดหรือบางส่วน ตามจํานวนที่ผู้ให้เช่าเห็นสมควร เพื่อเป็น ค่าเสียหาย สําหรับการที่ผู้เช่า ไม่ปฏิบัติตาม หรือผิดสัญญา หรือ ไม่เช่าจนครบนั้น หรือเพื่อเป็นการแก้ไขเยียวยาความ เสียหาย หรือสูญหายนั้นเมื่ออายุสัญญาเช่า หรือระยะเวลาเช่าที่ออกไป (ถ้ามี) สิ้นสุดลง และเมื่อผู้เช่าได้ส่งมอบสถานที่เช่ารวมทั้ง อุปกรณ์เครื่องเรือน ทั้งหมดคืนให้แก่ผู้ให้เช่าในสภาพที่ดี และผู้เช่า ไม่มีหนี้ค้างชําระภายใต้สัญญานี้กับผู้ให้เช่า แล้วผู้ให้เช่าจะคืนเงินประกันนี้ (หรือเงินประกันที่เหลืออยู่) ให้แก่ผู้เช่าต่อไป<br/>
    The security deposit shall be returned to the Lessee within 7 days upon termination of this agreement, if not applied towards payment of rent or other indebtedness in arrears or towards damage incurred to the lessor, at its own option of the Lessor.<br/>
    เงินประกันจะคืนให้แก่ผู้เช่าภายในระยะเวลา 7 วัน นับแต่วันที่สัญญานี้สิ้นสุดลง หากไม่มีการนำไปชำระค่าเช่าหรือหนี้ค้างชำระอื่นใด หรือค่าชดเชยความเสียหายที่เกิดขึ้นแก่ผู้ให้เช่าตามที่ผู้ให้เช่าเห็นสมควร
  </div>
  
  <div class="mb-4">
    <strong>4. No Renovation of Premises of rental and Furniture, Fixtures and Electric Appliance (FF & E) :</strong><br/>
    The Lessee shall not renovate the Premises of rental (including not to remove or relocate any bed or wardrobe fixed to floor or wall) or make any hole on the wall or door of the Premises of rental or paste any sticker or wallpaper on the wall of the Premises of rental for any reason, without any prior written consent of the Lessor. If the Lessee fails to comply with these requirements, the Lessee shall be liable to the Lessor or to any other person for any damage caused to the Lessor or such other person.<br/>
    ห้ามผู้เช่าตกแต่งสถานที่เช่าและอุปกรณ์เครื่องเรือน หากผู้เช่า ไม่ได้รับความยินยอมล่วงหน้าเป็นหนังสือจากผู้ให้ เช่าก่อน ผู้เช่าจะต้องไม่ปรับปรุงแก้ไขสถานที่เช่า ใหม่ รวมถึงจะต้อง ไม่ขนย้ายออกหรือเปลี่ยนตําแหน่งของเตียง หรือ เสื้อผ้าซึ่งยึดติดอยู่กับพื้นหรือกําแพง หรือเจาะรูฝาผนัง หรือประตูของสถานที่เช่า หรือติดสติ๊กเกอร์ หรือวอลเปเปอร์ ไม่ว่าด้วยเหตุผลใดก็ตาม หากผู้เช่าไม่ได้รับความยินยอมล่วงหน้าเป็นหนังสือจากผู้ให้เช่าก่อน หากผู้เช่ากระทําการฝ่าฝืน เงื่อนไขนี้ ผู้เช่าจะต้องรับผิดชอบต่อความเสียหายที่เกิดขึ้นจากการกระทําดังกล่าวทั้งต่อผู้ให้เช่า และบุคคลผู้เกี่ยวข้อง
  </div>
  
  <div class="mb-4">
    <strong>5. Related Expenses :</strong><br/>
    The Lessee shall bear all costs and charges of all electricity, water, telephone, internet, cable TV bills, Pet registration fee (if applicable) by itself as per invoices issued by the relevant government entities or by the relevant private entities. The Lessor shall bear all costs and charges related to common / management fees of the Premises of rental each year. If the Lessee fails to pay all the costs and charges mentioned above. The Lessor has the right to terminate contract and the Lessor shall forfeit the security deposit in whole. And if the Lessor fails to pay the common area fees, resulting in the inability to use the Premises of rental, the Lessee shall have the right to terminate the lease agreement and receive a full refund of the security deposit.<br/>
    ค่าใช้จ่ายที่เกี่ยวข้อง - ผู้เช่าตกลงชําระค่าใช้จ่ายอันเกี่ยวกับค่าไฟฟ้า ค่าน้ำประปา ค่าโทรศัพท์ ค่าอินเตอร์เน็ต ค่าเคเบิล ทีวี ค่าลงทะเบียนสัตว์เลี้ยง (ถ้ามี)  ตามใบแจ้งหนี้ของหน่วยงานราชการ หรือองค์กรธุรกิจที่เกี่ยวข้องกับบริษัทแต่ละประเภทนั้นๆ เอง ในขณะที่ผู้ให้เช่าจะเป็นผู้รับผิดชอบค่าส่วนกลางของสถานที่เช่านี้เองในแต่ละปี หากผู้เช่าไม่ชำระค่าใช้จ่ายและค่าธรรมเนียมทั้งหมดตามที่ระบุไว้ข้างต้น ผู้ให้เช่ามีสิทธิ์บอกเลิกสัญญาและยึดเงินประกันทั้งหมด และหากผู้ให้เช่าไม่ชำระค่าส่วนกลางจนส่งผลต่อการใช้งานสถานที่เช่า ผู้เช่ามีสิทธิยกเลิกสัญญาเช่าโดยได้รับเงินประกันคืน
  </div>

  <div class="mb-4">
    <strong>6. Late Payment :</strong><br/>
    If the Lessee fails to pay any Rental Amount to the Lessor on their respective due date for any reason, The Lessee shall pay a fine at the rate of Baht <span class="font-bold border-b border-dotted border-black px-2">{{fineAmount}}</span> Per day, with a maximum allowable grace period of 7 days. After that, the lessor shall have the right to terminate the lease agreement and forfeit the security deposit immediately.<br/>
    การชําระเงินล่าช้า - ในกรณีที่ผู้เช่า ไม่ชําระค่าเช่าให้แก่ผู้ให้เช่าในวันถึงกําหนดชําระค่าเช่าแต่ละรอบกําหนด ชําระ ไม่ว่าด้วยเหตุผลใดก็ตาม ผู้เช่าจะต้องจ่ายค่าปรับในอัตรา <span class="font-bold border-b border-dotted border-black px-2">{{fineAmount}}</span> บาท/วัน โดยจะอนุญาตมีการปรับล่าช้าได้ ไม่เกิน 7 วัน หลังจากนั้นผู้ให้เช่ามีสิทธิ์บอกยกเลิกสัญญาและยึดเงินประกันได้ทันที
  </div>

  <div class="mb-4">
    <strong>7. No Sub-lease :</strong><br/>
    The Lessee shall not sub - lease the Premises of rental or any part of FF&E, whether whole or in part, to any third party without obtaining the Lessor's prior written permission.<br/>
    ห้ามเช่าช่วง - ผู้เช่าจะต้องไม่ให้บุคคลที่สามอื่นใดมาเช่าช่วงสถานที่เช่า หรือส่วนหนึ่งส่วนใดของอุปกรณ์เครื่อง เรือน (ไม่ว่าทั้งหมดหรือบางส่วน) เว้นแต่ผู้ให้เช่าจะได้ให้ความยินยอมเป็นหนังสือล่วงหน้าก่อน
  </div>

  <div class="mb-4">
    <strong>8. Premises of rental Inspection :</strong><br/>
    The lessee agrees to allow the lessor and / or the lessor representative to inspect the Premises of rental as appropriate which must notify the lessee at least 5 days in advance.<br/>
    การเข้าตรวจสถานที่เช่า - ผู้เช่ายินยอมให้ผู้ให้เช่า และ/หรือตัวแทนของผู้ให้เช่าเข้าตรวจดูสถานที่เช่าได้ตามความเหมาะสม โดยต้องแจ้งให้ผู้เช่าทราบล่วงหน้าอย่างน้อย 5 วัน
  </div>

  <div class="mb-4">
    <strong>9. Care, Maintenance and Premises of rental Rules :</strong><br/>
    Throughout the Lease Term and each Rental Term, The Lessee shall :<br/>
    ( a ) take proper care of Premises of rental and all FF & E and maintain the same in reasonable good condition as well as use the Premises of rental solely for residential purposes, as well an ask or consult the Lessor if the Lessee does not know how to operate any FF & E :<br/>
    ( b ) respect and comply with Thai law and all Premises of rental rules and regulations applicable to the Premises of rental as specified by the  juristic person and use the common property of the building only as permitted and strictly in accordance with such rules and regulations force from time to time ;<br/>
    ( c ) not cause any noise, nuisance disturbance to any neighboring resident and not do anything or take any illegal drug in the Premises of rental :<br/>
    ( d ) make good or repair any defect malfunctioning or damage occurring to the Premises of rental or any part of the FF & E if friends, his/her relatives or his/her share lessee (for the avoidance of doubt, if such defect, malfunctioning or damage is caused by wear and tear or by normal deterioration condition of the Premises of rental of FF & E, the Lessor shall be responsible for it) :<br/>
    ( e ) not to use nor permit to use the Premises of rental or any part thereof for any illegal or immortal purpose.<br/>
    ( f ) not smoke or any cigar in the Premises of rental ( given that this Premises of rental project is a non - smoking project and smoke detectors have been inspect throughout the project and in each Premises of rental ) including all drugs are prohibited.<br/>
    ( g ) allow the Lessor to enter, inspect or lock up the Premises of rental at any time if the Lessor is of the opinion that the Lessee fails to comply with any term of this Agreement. If the Lessee does not fail to comply with any term of this Agreement, the Lessor is still allowed to enter and inspect the Premises of rental by giving 5 days of advanced notice.<br/>
    ( h ) not bring, raise or feed any pet or animal in the Premises of rental.<br/>
    <br/>
    การดูแลรักษาและปฏิบัติตามข้อบังคับของสถานที่เช่า - ตลอดช่วงอายุสัญญา และระยะเวลาเช่าที่ต่อออกไปแต่ละช่วง ผู้เช่าจะต้อง<br/>
    (ก) ดูแลสถานที่เช่า และอุปกรณ์เครื่องเรือนทั้งหมดและรักษาสิ่งเหล่านี้ให้อยู่ในสภาพที่ดีตามสมควร รวมทั้งใช้ สถานที่เช่าเพื่อวัตถุประสงค์ในการพักอาศัยเท่านั้น รวมทั้งสอบถาม หรือปรึกษาผู้ให้เช่าหากผู้เช่า ไม่ทราบวิธีการใช้ อุปกรณ์เครื่องเรือนชิ้นใดๆ<br/>
    (ข) เคารพและปฏิบัติตามกฎหมายไทยและกฎข้อบังคับที่เกี่ยวกับสถานที่เช่า ตามนิติบุคคล และใช้ทรัพย์สินส่วนกลางของตึกตามที่กฎข้อบังคับเหล่านั้นอนุญาตให้ใช้เท่านั้น และใช้อย่างเคร่งครัดตรงตามที่กฎหมายข้อบังคับเหล่านั้นระบุเป็นครั้งคราวด้วย<br/>
    (ค) ไม่ก่อให้เกิดเสียงที่ก่อความรําคาญ หรือก่อกวนผู้พักอาศัยข้างเคียง และไม่กระทําการใดที่เป็นการผิดกฎหมาย และใช้หรือเสพยาเสพติด ไม่ว่าประเภทใดในสถานที่เช่า<br/>
    (ง) การแก้ไข หรือซ่อมแซมสิ่งชํารุด บกพร่อง ความเสียหาย หรือสิ่งที่ไม่สามารถใช้งานได้นั้น เกิดจาก ความผิด หรือการใช้ที่ไม่ถูกต้องของผู้เช่าเอง ไม่ว่าจะเป็นเพื่อน, ญาติของผู้เช่า หรือผู้เช่าร่วม (ทั้งนี้หากความชํารุด บกพร่องความเสียหาย หรือสิ่งที่ไม่สามารถใช้งานได้นั้นเกิดจากความสึกหรอตามปกติ หรือตามสภาพของ ของที่เก่า หรือเสื่อมสภาพลงเองกรณีเช่นนี้ ผู้ให้เช่าจะเป็นผู้รับผิดชอบ)<br/>
    (จ) ห้ามใช้สถานที่เช่านี้ หรือส่วนหนึ่งส่วนใดของสถานที่เช่าในทางผิดกฎหมาย หรือผิดศีลธรรม<br/>
    (ฉ) ไม่สูบบุหรี่ หรือซิการ์ ในสถานที่เช่า ทั้งนี้เนื่องจากสถานที่เช่า โครงการนี้ เป็นโครงการห้ามสูบบุหรี่ และ ได้มีการติดตั้งเครื่องดักควันไว้ในโครงการ และสถานที่เช่าแต่ละห้องหมดแล้ว รวมทั้งไม่เสพสิ่งเสพติดทุกชนิด และนําสิ่งเสพติดทุกชนิดเข้ามาในสถานที่เช่าแห่งนี้<br/>
    (ช) ยินยอมให้ผู้ให้เช่ามาในสถานที่เช่า ตรวจสอบสถานที่เช่า หรือล็อคกุญแจสถานที่เช่าเมื่อใดก็ได้ หากผู้ให้เช่าเห็น ว่าผู้เช่า ไม่ปฏิบัติตามข้อสัญญาข้อหนึ่งข้อใดในสัญญานี้ กรณีที่จะเข้ามาเช็คโดยไม่ได้มีเกณฑ์ผิดกฏใดๆ ผู้ให้เช่า จะต้องแจ้งผู้เช่าก่อนล่วงหน้าอย่างน้อย 5 วัน<br/>
    (ซ) ไม่นำสัตว์ หรือสัตว์เลี้ยงเข้ามาในห้องชุด รวมถึงจะต้องไม่เลี้ยงสัตว์ หรือให้อาหารสัตว์ หรือสัตว์เลี้ยง ดังกล่าว ในห้องชุด
  </div>

  <div class="mb-4">
    <strong>10. Termination :</strong><br/>
    This Agreement may be earlier terminated in any of the following circumstances :<br/>
    ( a ) by both parties, if both parties mutually agree to terminate this Agreement in writing, or<br/>
    ( b ) by the Lessor or the Lessee if the other party commits any breach of any terms or condition of this Agreement ( including any failure by the Lessee to pay any Rental Amount on any particular month ) and fails remedy the same within 7 ( seven ) days after a written notice is served by the non - defaulting Party.<br/>
    ( c ) if the Lessee commits any breach of any terms or condition of this Agreement, the Lessor has the right to terminate the contract, lock up the Premises of rental, change a key-lock of the Premises of rental and promptly enter the Premises of rental to remove any belonging of the Lessee without notice to the Lessee and the Lessee agrees that this will not constitute a trespassing offence.<br/>
    ( d ) if the Premises of rental are found by any court or other official order or are agreed by The Landlord to have become uninhabitable because of dilapidation, condemnation, fire or disaster or other force majeure, So the security deposit shall be refunded.<br/>
    ( e ) if the Lessee cancels the contract before the end date in this contract, the Lessee is willing to pay the fee in the amount of 1 month of rent along with a security deposit refund.<br/>
    (f) Termination in Case of Criminal Involvement - The Lessee hereby represents and warrants that they are not a wanted person and are not subject to any arrest warrant, criminal charges, or ongoing criminal proceedings in Thailand or any other country. The Lessee further confirms that they are not evading or avoiding any judicial process, and are not listed on any national or international watch list.<br/>
    In the event that it is discovered, at any time during the lease term, that the Lessee is or has become a wanted person or is involved in any criminal proceedings, the Lessor shall have the right to terminate this Lease Agreement immediately without prior notice. The Lessee shall vacate the premises within 24 hours from notice and shall be responsible for all damages.<br/>
    <br/>
    การเลิกสัญญา-สัญญา อาจเลิกกันก่อนกำหนดได้ ถ้าเกิดกรณีใดกรณีหนึ่งดังต่อไปนี้<br/>
    (ก) ถ้าคู่สัญญาทั้งสองฝ่ายตกลงร่วมกันเป็นลายลักษณ์อักษรที่จะเลิก หรือ<br/>
    (ข) เลิก โดยผู้ให้เช่า หรือผู้เช่าฝ่ายใดฝ่ายหนึ่ง ถ้าคู่สัญญาอีกฝ่ายหนึ่งฝ่าฝืน หรือผิดสัญญาข้อหนึ่งข้อใดใน สัญญานี้ (รวมถึงกรณีที่ผู้เช่า ไม่สามารถชําระค่าเช่าได้ ไม่ว่าเดือนหนึ่งเดือนใดด้วย) และไม่สามารถแก้ไขให้เป็นไปตาม เงื่อนไขภายในเวลา 7 (เจ็ด) วัน นับจากวันที่คู่สัญญาฝ่ายที่ไม่ผิด ส่งหนังสือแจ้งการผิดสัญญาให้แก่คู่สัญญาฝ่ายที่ฝ่าฝืนหรือผิดสัญญา<br/>
    (ค) หากผู้เช่าทําผิดสัญญาข้อหนึ่งข้อใด ผู้ให้เช่ามีสิทธิ์ยกเลิกสัญญาและถ้าผู้เช่ายังไม่ยอมส่งมอบ หรือส่งคืน การครอบครองสถานที่เช่าให้แก่ผู้ให้เช่า ผู้ให้เช่ามีสิทธิ์ที่จะล็อค หรือเปลี่ยนกุญแจสถานที่เช่าได้ และเข้าไปในสถานที่เช่าได้ ทันที เพื่อขนย้ายสัมภาระของผู้เช่าออกไป ทั้งนี้โดยไม่ต้องแจ้งให้ผู้เช่าทราบแต่อย่างใด และผู้เช่าตกลงรับทราบว่าการ กระท่าเช่นนี้ จะไม่ถือว่าเป็นความผิดฐานบุกรุกแต่อย่างใด<br/>
    (ง)  หากสถานที่เช่าถูกพิจารณาโดยคำสั่งศาล หน่วยงานที่เกี่ยวข้อง หรือโดยข้อตกลงของผู้ให้เช่าว่าไม่สามารถอยู่อาศัยได้ เนื่องจากการชำรุดทรุดโทรม คำสั่งรื้อถอน อัคคีภัย ภัยพิบัติ หรือเหตุสุดวิสัยอื่น ๆ, ส่วนนี้จะคืนเงินประกัน<br/>
    (จ) หากผู้ให้เช่ายกเลิกสัญญาเช่าก่อนวันสิ้นสุดสัญญา ผู้ให้เช่ายินดีชดใช้ค่าเสียหายเป็นจำนวน 1 เดือนของค่าเช่า พร้อมทั้งคืนเงินประกัน<br/>
    (ฉ) การยกเลิกสัญญาในกรณีที่มีส่วนเกี่ยวข้องกับคดีอาญา-ผู้เช่าตกลงและรับรองว่า ตนมิได้เป็นบุคคลที่มีหมายจับ หรืออยู่ระหว่างถูกดำเนินคดีอาญา ในประเทศไทยหรือในต่างประเทศ รวมถึงมิได้อยู่ในระหว่างการหลบหนี หรือหลีกเลี่ยงกระบวนการยุติธรรมในรูปแบบใด ๆ และต้องไม่เป็นบุคคลที่อยู่ในบัญชีเฝ้าระวังของหน่วยงานรัฐทั้งภายในประเทศและระหว่างประเทศ<br/>
    หากภายหลังพบว่า ผู้เช่าเป็นบุคคลที่มีหมายจับ หรือเกี่ยวข้องกับคดีอาญาใด ๆ ไม่ว่าก่อนหรือระหว่างระยะเวลาการเช่า ผู้ให้เช่ามีสิทธิ์ยกเลิกสัญญาเช่าได้ทันทีโดยไม่ต้องบอกกล่าวล่วงหน้า และผู้เช่าต้องย้ายออกจากสถานที่เช่า ภายใน 24 ชั่วโมง นับจากเวลาที่ได้รับแจ้ง
  </div>

  <div class="mb-4">
    <strong>11. Expiry of Term :</strong><br/>
    Upon expiry of the Lease Term or the Renewal Term (if any), the Lessee shall return the Premises of rental and all FF & E to the Lessor in good condition as at the date of this agreement and the Lessee agrees that the Lessor will deduct for room cleaning fee <span class="font-bold border-b border-dotted border-black px-2">{{cleaningFee}}</span> Baht and air conditioners cleaning fee <span class="font-bold border-b border-dotted border-black px-2">{{acCleaningFee}}</span> Baht from the  security deposit when the Lessee moves out of the Premises of rental.<br/>
    In surrender possession of the Premises of rental to the Lessor, the Lessor has the right to lock up the Premises of rental, change a key - lock of the Premises of rental and promptly enter the Premises of rental to remove any belonging of the Lessee without notice to the Lessee and the Lessee agrees that this will not constitute a trespassing offence.<br/>
    การหมดอายุสัญญา - เมื่ออายุสัญญา หรือระยะเวลาเช่าที่ออกไป (ถ้ามี) หมดลง ผู้เช่าจะต้องส่งคืนสถานที่เช่า และ อุปกรณ์เครื่องเรือน ให้แก่ผู้ให้เช่าในสภาพดั้งเดิม ที่เป็นอยู่ ณ วันที่ของสัญญานี้ โดยผู้เช่ายินยอมให้ผู้ให้เช่าหักค่าทำความสะอาดห้องเป็นจำนวนเงิน <span class="font-bold border-b border-dotted border-black px-2">{{cleaningFee}}</span> บาท และค่าล้างเครื่องปรับอากาศเป็นเงิน <span class="font-bold border-b border-dotted border-black px-2">{{acCleaningFee}}</span> บาท จากเงินประกันเมื่อผู้เช่าย้ายออกจากสถานที่เช่า<br/>
    ในกรณีที่อายุสัญญา หรือระยะเวลาเช่าที่ต่อออกไปนั้น (ถ้ามี) หมดลงแล้ว ผู้เช่ายังไม่ยอมส่งมอบ หรือส่งคืน การครอบครองสถานที่เช่าให้แก่ผู้ให้เช่า ผู้ให้เช่ามีสิทธิ์ที่จะล็อค หรือเปลี่ยนกุญแจสถานที่เช่าได้ และเข้าไปในสถานที่เช่าได้ ทันที เพื่อขนย้ายสัมภาระของผู้เช่าออกไป ทั้งนี้โดยไม่ต้องแจ้งให้ผู้เช่าทราบแต่อย่างใด และผู้เช่าตกลงรับทราบว่าการ กระทําเช่นนี้ จะไม่ถือว่าเป็นความผิดฐานบุกรุกแต่อย่างใด
  </div>

  <div class="mb-4">
    <strong>12. Description of Furniture, Fixtures and Electric Appliance (FF & E) :</strong><br/>
    The FF & E consists of all furniture, fixtures, keys and electric appliances installed or provided in the Premises of rental as listed in Annex attached hereto, all of which are received by the Lessee into its own possession on the date of this Agreement. If all furniture, fixtures, keys and electric appliances installed or provided in the Premises of rental as listed are damaged caused by improper use or loss, the Lessee shall comply to compensate as in Annex attached.<br/>
    รายละเอียดอุปกรณ์เครื่องเรือนประกอบไปด้วย เฟอร์นิเจอร์ เครื่องเรือน และอุปกรณ์ติดตั้งตายตัว กุญแจ และ เครื่องใช้ ไฟฟ้าทั้งหมด ที่ได้ติดตั้ง หรือทีได้จัดไว้ในสถานที่เช่า ตามรายการที่ระบุไว้ใน เอกสารแนบ หากเกิดความเสียหายจากการใช้งานผิดวิธี หรือสูญหาย ผู้เช่ายินยอมที่จะชำระตามมูลค่าในเอกสารแนบ โดยไม่มีเงื่อนไข
  </div>

  <div class="mb-4">
    <strong>13. Acceptance of the the Premises of rental :</strong><br/>
    On the date of this agreement, the Lessee has examined the Premises of rental and Leased property in the Premises of rental, seeing that there is a normal condition that the Lessee can use or receive for its intended purpose. Every lease details appear in the lease and property inspection record attached to this agreement and the lessor has delivered Premises of rental and Leased property in the Premises of rental to the Lessee already.<br/>
    Upon the expiration or termination of this Agreement, for any reason whatsoever, the Lessee shall return the leased property to the Lessor in good condition. If the Lessor incurs necessary expenses for repairs or restoration to return the leased property to its original condition, the Lessee agrees to reimburse the Lessor for all such costs. However, this shall not include normal wear and tear, pre-existing defects before the Lessee’s possession, defects not caused by the Lessee, or damages resulting from force majeure.<br/>
    การรับมอบทรัพย์ที่เช่า - ในวันที่ทำสัญญานี้ ผู้เช่าได้ตรวจดูสถานที่เช่าตลอดจนทรัพย์สินที่เช่าในสถานที่เช่าเรียบร้อยแล้วเห็นว่ามีสภาพปกติที่ผู้เช่าสามารถจะใช้หรือได้รับประโยชน์ตามวัตถุประสงค์แห่งการเช่าทุกประการ รายละเอียดปรากฏตามแบบบันทึกการตรวจรับสภาพสถานที่เช่าและทรัพย์สินแนบท้ายสัญญาฉบับนี้ และผู้ให้เช่าได้ส่งมอบสถานที่เช่าและทรัพย์สินที่เช่าในสถานที่เช่าให้แก่ผู้เช่าเรียบร้อยแล้ว<br/>
    เมื่อสัญญาฉบับนี้สิ้นสุดลงหรือมีอันเลิกกันไม่ว่าด้วยเหตุประการใดๆ ก็ตาม ผู้เช่าจะส่งมอบทรัพย์ที่เช่าคืน แก่ผู้ให้เช่าในสภาพที่ดี หากผู้ให้เช่าต้องเสียค่าใช้จ่ายที่จําเป็นในการซ่อมแซมหรือปรับปรุงทรัพย์ที่เช่าให้ อยู่ในสภาพเดิม ผู้เช่ายินยอมรับผิดชดใช้ค่าใช้จ่ายนั้นคืนแก่ผู้ให้เช่าทั้งสิ้น ทั้งนี้ ไม่รวมถึงความชํารุด บกพร่องที่เกิดจากการใช้งานหรือการเสื่อมสภาพจากการใช้งานตามปกติ ความชํารุดบกพร่องที่มีอยู่ก่อน การครอบครองทรัพย์ที่เช่าของผู้เช่า ความชํารุดบกพร่องอันมิใช่ความผิดของผู้เช่า และความเสียหายอันเกิดจากเหตุสุดวิสัย
  </div>

  <div class="mb-4">
    <strong>14. Amendments:</strong><br/>
    The Parties may amend any of the terms or conditions of this Agreement only by mutual agreement made in writing between the parties.<br/>
    การแก้ไขสัญญา - สัญญานี้จะมีการแก้ไข หรือเปลี่ยนแปลงได้ ก็โดยการตกลงกันทั้งสองฝ่าย ระหว่างคู่สัญญา เป็นลายลักษณ์อักษรเท่านั้น
  </div>

  <div class="mb-4">
    <strong>15. Governing Law</strong><br/>
    This Agreement shall be governed by and construed in accordance with the laws of Thailand.<br/>
    กฎหมายที่ใช้บังคับ – สัญญาฉบับนี้ให้อยู่ภายใต้บังคับกฎหมายของประเทศไทย
  </div>

  <div class="mb-4">
    <strong>16. Dispute Resolution</strong><br/>
    Any dispute or conflict arising from this Agreement that cannot be resolved by mutual agreement shall be submitted to the courts of Thailand for resolution.<br/>
    การระงับข้อพิพาท-ข้อโต้เถียง ข้อขัดแย้งใดๆ ที่เกิดขึ้นอันเนื่องมาจากสัญญาฉบับนี้ หากคู่สัญญาไม่สามารถตกลงกันได้ คู่สัญญาตกลงจะนําข้อพิพาทดังกล่าวขึ้นฟ้องต่อศาลในประเทศไทย
  </div>

  <div class="mb-8">
    This agreement is prepared in duplicate identical wording. Both parties have read and fully understand its contents and agree to comply with its terms and conditions. The Lessor and the Lessee are to keep one signed copy each.<br/>
    สัญญานี้ทำขึ้นเป็นสองฉบับ มีข้อความถูกต้องตรงกัน ทั้งสองฝ่ายได้อ่านและเข้าใจข้อความโดยตลอดดีแล้วและ
    ตกลง ที่จะปฎิบัติตามทุกประการ จึงได้ลงลายมือและประทับตรา (ถ้ามี) ไว้เป็นหลักฐานต่อหน้าพยานและถือไว้ฝ่ายละฉบับ
  </div>

  <div class="mt-12 grid grid-cols-2 gap-12">
    <div class="text-center">
        <div class="border-b border-black w-3/4 mx-auto mb-2 h-16 flex items-end justify-center relative">
            <img src="{{lessorSignature}}" class="h-14 absolute bottom-0" style="display: {{lessorSignature ? 'block' : 'none'}}" />
        </div>
        <p>ลงชื่อ ผู้ให้เช่า (Lessor)</p>
        <p class="font-bold mt-1">{{lessor}}</p>
    </div>
    <div class="text-center">
        <div class="border-b border-black w-3/4 mx-auto mb-2 h-16 flex items-end justify-center relative">
             <img src="{{lesseeSignature}}" class="h-14 absolute bottom-0" style="display: {{lesseeSignature ? 'block' : 'none'}}" />
        </div>
        <p>ลงชื่อ ผู้เช่า (Lessee)</p>
        <p class="font-bold mt-1">{{lessee}}</p>
    </div>
  </div>
  
  <div class="mt-8 grid grid-cols-2 gap-12 text-sm text-gray-500">
    <div class="text-center">
        <div class="border-b border-gray-300 w-3/4 mx-auto mb-2 h-12"></div>
        <p>พยาน (Witness)</p>
    </div>
    <div class="text-center">
        <div class="border-b border-gray-300 w-3/4 mx-auto mb-2 h-12"></div>
        <p>พยาน (Witness)</p>
    </div>
  </div>
  <div class="break-before-page">
    <h2 class="font-bold text-center mb-4" style="font-size: 14pt;">กุญแจและเครื่องใช้ไฟฟ้า/Key and Electrical appliances</h2>
    {{sec_appliances_table}}

    <h2 class="font-bold text-center mb-4" style="font-size: 14pt;">เฟอร์นิเจอร์/ Furniture</h2>
    {{sec_furniture_table}}
  </div>

  <div class="mt-8 break-before-page">
    <h2 class="font-bold mb-4" style="font-size: 16pt;">เอกสารแนบท้าย (Attachments)</h2>
    
    <div class="space-y-4">
        <div class="break-inside-avoid">
            <p class="font-bold mb-2">บัตรประชาชน/พาสปอร์ต ผู้ให้เช่า (Lessor ID/Passport)</p>
            <img src="{{lessorIdImage}}" class="w-full object-contain border" style="display: {{lessorIdImage ? 'block' : 'none'}}; max-height: 350px;" />
        </div>

        <div>
            <p class="font-bold mb-2">บัตรประชาชน/พาสปอร์ต ผู้เช่า (Lessee ID/Passport)</p>
            <div class="break-inside-avoid mb-4" style="display: {{lesseeIdImage ? 'block' : 'none'}}">
                <img src="{{lesseeIdImage}}" class="w-full object-contain border" style="max-height: 350px;" />
            </div>
            <div class="break-inside-avoid mb-4" style="display: {{lesseeIdImage2 ? 'block' : 'none'}}">
                <img src="{{lesseeIdImage2}}" class="w-full object-contain border" style="max-height: 350px;" />
            </div>
            <div class="break-inside-avoid mb-4" style="display: {{lesseeIdImage3 ? 'block' : 'none'}}">
                <img src="{{lesseeIdImage3}}" class="w-full object-contain border" style="max-height: 350px;" />
            </div>
            <div class="break-inside-avoid mb-4" style="display: {{lesseeIdImage4 ? 'block' : 'none'}}">
                <img src="{{lesseeIdImage4}}" class="w-full object-contain border" style="max-height: 350px;" />
            </div>
        </div>

        <div class="break-inside-avoid">
            <p class="font-bold mb-2">สำเนาทะเบียนบ้าน (House Registration)</p>
            <img src="{{houseRegImage}}" class="w-full object-contain border" style="display: {{houseRegImage ? 'block' : 'none'}}; max-height: 350px;" />
        </div>

        <div class="break-inside-avoid">
            <p class="font-bold mb-2">หน้าสมุดบัญชีธนาคาร (Bank Account)</p>
            <img src="{{bankAccountImage}}" class="w-full object-contain border" style="display: {{bankAccountImage ? 'block' : 'none'}}; max-height: 350px;" />
        </div>
    </div>
  </div>
</div>`;

const DEFAULT_RECEIPT_SECTIONS: Section[] = [
    {
        id: "sec_info",
        title: "ข้อมูลใบเสร็จ",
        fields: [
            { id: "contractDate", label: "วันที่ (Date)", type: "date" },
            { id: "receivedFrom", label: "ได้รับเงินจาก (Received From)", type: "text", placeholder: "ชื่อ-นามสกุล หรือ บริษัท" },
            { id: "address", label: "ที่อยู่ (Address)", type: "textarea", placeholder: "ที่อยู่ผู้จ่ายเงิน" },
            { id: "paymentFor", label: "เพื่อชำระค่า (In Payment of)", type: "text", placeholder: "ค่าเช่า/ค่ามัดจำ/อื่นๆ" },
            { id: "amount", label: "รวมเป็นเงินทั้งสิ้น (Total Amount)", type: "number" },
            { id: "collectorSignature", label: "ลายเซ็นผู้รับเงิน (Collector)", type: "image" },
            { id: "payerSignature", label: "ลายเซ็นผู้จ่ายเงิน (Payer)", type: "image" },
        ]
    }
];


const DEFAULT_AGENCY_SECTIONS: Section[] = [
    {
        id: "sec_info",
        title: "ข้อมูลสัญญาและทรัพย์สิน",
        fields: [
            { id: "contractDate", label: "วันที่ทำสัญญา", type: "date" },
            { id: "location", label: "สถานที่ทำสัญญา", type: "text" },
            { id: "lessor", label: "ชื่อ-นามสกุล เจ้าของทรัพย์", type: "text" },
            { id: "lessorId", label: "เลขบัตรประชาชน เจ้าของทรัพย์", type: "text" },
            { id: "lessorAddress", label: "ที่อยู่ เจ้าของทรัพย์", type: "textarea" },
            { id: "lessorPhone", label: "เบอร์โทรศัพท์ เจ้าของทรัพย์", type: "text" },
            { id: "propertyType", label: "ประเภททรัพย์", type: "text" },
            { id: "propertyLocation", label: "ที่ตั้งทรัพย์", type: "textarea" },
            { id: "endDate", label: "สิ้นสุดสัญญาในวันที่", type: "date" },
        ]
    },
    {
        id: "sec_sign",
        title: "ลายเซ็นและพยาน",
        fields: [
            { id: "lessorSignature", label: "ลายเซ็นเจ้าของทรัพย์", type: "signature" },
            { id: "lesseeSignature", label: "ลายเซ็นนายหน้า", type: "signature" },
            { id: "witness1Name", label: "ชื่อ-นามสกุล พยาน 1", type: "text" },
            { id: "witness1Signature", label: "ลายเซ็นพยาน 1", type: "signature" },
            { id: "witness2Name", label: "ชื่อ-นามสกุล พยาน 2", type: "text" },
            { id: "witness2Signature", label: "ลายเซ็นพยาน 2", type: "signature" },
        ]
    },
    {
        id: "sec_docs",
        title: "เอกสารแนบ",
        fields: [
            { id: "lessorIdImage", label: "รูปบัตรประชาชน เจ้าของทรัพย์", type: "image" },
            { id: "lesseeIdImage", label: "รูปบัตรประชาชน นายหน้า", type: "image" },
        ]
    }
];


const DEFAULT_BUY_SECTIONS: Section[] = [
    {
        id: "sec_info",
        title: "ข้อมูลสัญญา",
        fields: [
            { id: "contractDate", label: "วันที่ทำสัญญา", type: "date" },
            { id: "location", label: "สถานที่ทำสัญญา", type: "text" },
            { id: "transferDate", label: "กำหนดวันโอนกรรมสิทธิ์", type: "date" },
        ]
    },
    {
        id: "sec_parties",
        title: "คู่สัญญา",
        fields: [
            { id: "lessor", label: "ชื่อผู้จะขาย", type: "text" },
            { id: "lessorId", label: "เลขบัตรประชาชน ผู้จะขาย", type: "text" },
            { id: "lessorAddress", label: "ที่อยู่ ผู้จะขาย", type: "textarea" },
            { id: "lessee", label: "ชื่อผู้จะซื้อ", type: "text" },
            { id: "lesseeId", label: "เลขบัตรประชาชน ผู้จะซื้อ", type: "text" },
            { id: "lesseeAddress", label: "ที่อยู่ ผู้จะซื้อ", type: "textarea" },
        ]
    },
    {
        id: "sec_property",
        title: "ทรัพย์สินและราคา",
        fields: [
            { id: "propertyDetail", label: "รายละเอียดทรัพย์สิน (เช่น บ้านเลขที่, ประเภท)", type: "textarea" },
            { id: "titleDeedId", label: "เลขที่โฉนด", type: "text" },
            { id: "propertyLocation", label: "ที่ตั้งทรัพย์สิน", type: "textarea" },
            { id: "totalPrice", label: "ราคารวม (ตัวเลข)", type: "number" },
            { id: "depositAmount", label: "เงินมัดจำ (ตัวเลข)", type: "number" },
            { id: "remainingAmount", label: "เงินส่วนที่เหลือ (ตัวเลข)", type: "number" },
        ]
    },
    {
        id: "sec_sign",
        title: "ลายเซ็น",
        fields: [
            { id: "lessorSignature", label: "ลายเซ็นผู้จะขาย", type: "signature" },
            { id: "lesseeSignature", label: "ลายเซ็นผู้จะซื้อ", type: "signature" },
            { id: "witness1Name", label: "ชื่อพยาน 1", type: "text" },
            { id: "witness1Signature", label: "ลายเซ็นพยาน 1", type: "signature" },
            { id: "witness2Name", label: "ชื่อพยาน 2", type: "text" },
            { id: "witness2Signature", label: "ลายเซ็นพยาน 2", type: "signature" },
        ]
    }
];

const DEFAULT_BUY_LAYOUT = `<div class="p-[20mm] md:p-[25mm] text-black font-[Cordia New] leading-relaxed relative" style="font-family: 'Cordia New', sans-serif; font-size: 16pt;">
    
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
        <div class="w-1/3">
             <img src="/logo_PL_property.png" alt="PL Property" class="h-20 object-contain" />
        </div> 
        <div class="text-center w-1/3">
             <div class="font-bold text-xl">สัญญาจะซื้อจะขาย</div>
        </div>
        <div class="w-1/3"></div>
    </div>

    <div class="text-right mb-4">
        <div>ทำที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[150px] inline-block text-center">{{location}}</span></div>
        <div>วันที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[150px] inline-block text-center">{{contractDate}}</span></div>
    </div>

    <div class="mb-4 text-justify">
        สัญญาฉบับนี้ทำขึ้นระหว่าง <span class="font-bold border-b border-dotted border-black px-2">{{lessor}}</span>
        บัตรประชาชนเลขที่ <span class="font-bold border-b border-dotted border-black px-2">{{lessorId}}</span><br/>
        ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{lessorAddress}}</span><br/>
        ซึ่งต่อไปในสัญญานี้จะเรียกว่า “ผู้จะขาย” ฝ่ายหนึ่ง
    </div>

    <div class="mb-4 text-justify">
        กับ <span class="font-bold border-b border-dotted border-black px-2">{{lessee}}</span>
        บัตรประชาชนเลขที่ <span class="font-bold border-b border-dotted border-black px-2">{{lesseeId}}</span><br/>
        ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{lesseeAddress}}</span><br/>
        ซึ่งต่อไปในสัญญานี้เรียกว่า “ผู้จะซื้อ” อีกฝ่ายหนึ่ง
    </div>

    <div class="mb-4">คู่สัญญาทั้งสองฝ่ายตกลงทำสัญญาจะซื้อจะขายกัน โดยมีเงื่อนไขรายละเอียดดังต่อไปนี้</div>

    <div class="space-y-4 text-justify">
        <div>
            <strong>ข้อ 1.</strong> ผู้จะขายได้ตกลงที่จะขาย <span class="font-bold border-b border-dotted border-black px-2">{{propertyDetail}}</span>
            โฉนดเลขที่ <span class="font-bold border-b border-dotted border-black px-2">{{titleDeedId}}</span>
            ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{propertyLocation}}</span><br/>
            ในราคารวม <span class="font-bold border-b border-dotted border-black px-2">{{totalPrice}}</span> บาท ( <span class="font-bold border-b border-dotted border-black px-2">{{totalPrice:thai}}</span> )<br/>
            โดยทั้งสองฝ่ายตกลงจะไปทำการโอนกรรมสิทธิ์ทรัพย์สินภายในไม่เกินวันที่ <span class="font-bold border-b border-dotted border-black px-2">{{transferDate}}</span>
        </div>

        <div>
            <strong>ข้อ 2.</strong> ในวันนี้ผู้จะขายได้รับเงินค่าวางมัดจำไว้แล้วเป็นเงิน <span class="font-bold border-b border-dotted border-black px-2">{{depositAmount}}</span> บาท ( <span class="font-bold border-b border-dotted border-black px-2">{{depositAmount:thai}}</span> )<br/>
             ส่วนที่เหลือผู้จะซื้อตกลงจะชำระให้แก่ผู้ขายทั้งหมดในวันที่โอนกรรมสิทธิ์ตามข้อ 1
        </div>

        <div>
            <strong>ข้อ 3.</strong> ค่าธรรมเนียมโอน ค่าอากรสแตมป์ ในรายการจดทะเบียนโอนกรรมสิทธิ์นี้ ทั้งสองฝ่าย ตกลงให้ฝ่ายผู้ซื้อ และฝ่ายผู้ขาย ชำระฝ่ายละครึ่ง และภาษีเงินได้ผู้ขายเป็นฝ่ายชำระ
        </div>

        <div>
            <strong>ข้อ 4.</strong> ผู้จะขายรับรองว่ามีสิทธิ์ในการขายทรัพย์สินโดยสมบูรณ์ เเละรับรองว่าทรัพย์สินปราศจากการรอนสิทธิ ภาระจำยอม หรือสิทธิเรียกร้องใดๆ และหากยังมีหนี้สินได้ติดพันอยู่ ผู้จะขายจะต้องรับผิดชอบชำระให้เสร็จก่อน หรือภายในวันโอนกรรมสิทธิ
        </div>

        <div>
            <strong>ข้อ 5.</strong> ถ้าผู้จะซื้อผิดสัญญาไม่ไปรับโอนตามกำหนดเวลาในข้อ 1. ให้ถือว่า ผู้จะซื้อผิดสัญญาและยินยอมให้ผู้จะขายริบมัดจำที่ชำระแล้วได้ทั้งหมด โดยผู้จะขายไม่จำเป็น ต้องบอกกล่าว และสัญญานี้เป็นอันยกเลิก แต่หากผู้จะขายทำผิดสัญญา ผู้จะขายยินยอมคืนมัดจำทั้งหมดที่ได้รับมาให้แก่ผู้ซื้อ และยอมเสียค่าปรับให้ผู้ซื้อเป็นเงินอีก 1 เท่าของเงินมัดจำ และยินยอมให้ผู้จะซื้อฟ้องศาลบังคับให้ปฏิบัติตามสัญญานี้อีกส่วนหนึ่งด้วย
        </div>

        <div>
            <strong>ข้อ 6.</strong> สัญญาฉบับนี้มีผลผูกพันทายาท และหรือ ผู้สืบสิทธิ์ ของทั้งสองฝ่ายด้วย
        </div>

        <div>
            <strong>ข้อ 7.</strong> ในกรณีที่มีความตกลงอื่นใดที่นอกเหนือจากข้อตกลงในสัญญาฉบับนี้แล้ว และข้อตกลงใหม่ที่จะดำเนินความตกลงกันนั้นไม่เป็นการขัดหรือแย้งกับข้อตกลงเดิม คู่สัญญาทั้งสองฝ่ายให้สัญญาว่าจะทำบันทึกข้อตกลงไว้เป็นลายลักษณ์อักษรลงลายมือชื่อทั้งสองฝ่ายแนบท้ายสัญญาฉบับนี้ และบันทึกข้อตกลงดังกล่าวที่แนบไว้ท้ายสัญญาให้ถือเป็นส่วนหนึ่งของสัญญาฉบับนี้ด้วย
        </div>
        
        <div class="mt-4">
            สัญญาฉบับนี้ถูกทำขึ้นเป็นฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาทั้งสองฝ่ายได้อ่านข้อความและเข้าใจสัญญาดีแล้ว จึงลงลายมือชื่อไว้เป็นหลักฐานต่อหน้าพยานและยึดถือไว้ฝ่ายละฉบับ
        </div>
    </div>

    <!-- Signatures -->
    <div class="mt-16 grid grid-cols-2 gap-12 break-inside-avoid">
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... ผู้จะขาย</div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lessorSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lessorSignature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{lessor}}</span> )</div>
        </div>
        
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... ผู้จะซื้อ</div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lesseeSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lesseeSignature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{lessee}}</span> )</div>
        </div>
    </div>

    <div class="mt-12 grid grid-cols-2 gap-12 break-inside-avoid">
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... พยาน</div>
            <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness1Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness1Signature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness1Name}}</span> )</div>
        </div>
        
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... พยาน</div>
                <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness2Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness2Signature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness2Name}}</span> )</div>
        </div>
    </div>

</div>`;

const DEFAULT_AGENCY_LAYOUT = `<div class="p-[20mm] md:p-[25mm] text-black font-[Cordia New] leading-relaxed relative" style="font-family: 'Cordia New', sans-serif; font-size: 16pt;">
    
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
        <div class="w-1/3">
             <img src="/logo_PL_property.png" alt="PL Property" class="h-20 object-contain" />
        </div> 
        <div class="text-right w-2/3">
            <div class="mb-2">วันที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[100px] inline-block text-center">{{contractDate}}</span></div>
            <div>เขียนที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[200px] inline-block text-center">{{location}}</span></div>
        </div>
    </div>

    <div class="font-bold text-lg mb-6 text-center">สัญญาแต่งตั้งนายหน้าแบบเปิด</div>

    <div class="mb-4 text-justify">
        สัญญาฉบับนี้ทําขึ้นระหว่าง<br/>
        ชื่อ <span class="font-bold border-b border-dotted border-black px-2">{{lessor}}</span>
        เลขประจำตัวประชาชน <span class="font-bold border-b border-dotted border-black px-2">{{lessorId}}</span><br/>
        ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{lessorAddress}}</span> 
        โทร <span class="font-bold border-b border-dotted border-black px-2">{{lessorPhone}}</span><br/>
        ซึ่งต่อไปนี้ในสัญญาเรียกว่า <strong>เจ้าของทรัพย์</strong>
    </div>

    <div class="mb-4 text-justify">
        กับ <strong>นางนัยนา เวียงพล</strong> เลขประจำตัวประชาชน <strong>3700100535206</strong><br/>
        ที่อยู่เลขที่ <strong>99/680 ม.ชลดาสุวรรณภูมิ ต.ศีรษะจรเข้น้อย อ.บางเสาธง จ.สมุทรปราการ</strong><br/>
        โทร <strong>094-5261946</strong> ในสัญญานี้เรียกว่า <strong>นายหน้า</strong>
    </div>

    <div class="mb-4">โดยที่ คู่สัญญาทั้งสองฝ่าย ตกลงกันดังนี้</div>

    <div class="space-y-4 text-justify">
        <div>
            <strong>ข้อ 1 วัตถุประสงค์ของสัญญา</strong><br/>
            เจ้าของทรัพย์ตกลงแต่งตั้งให้นายหน้าเป็นนายหน้าเพื่อเสนอขายและทำการตลาดอสังหาริมทรัพย์ดังต่อไปนี้:<br/>
            <div class="pl-4 mt-2">
                ประเภททรัพย์: <span class="font-bold border-b border-dotted border-black px-2">{{propertyType}}</span><br/>
                ที่ตั้งทรัพย์: <span class="font-bold border-b border-dotted border-black px-2">{{propertyLocation}}</span>
            </div>
            <div class="mt-2">นายหน้าตกลงดำเนินการหาผู้ซื้อ เจรจา ประสานงาน และให้ข้อมูลที่จำเป็นเพื่อให้การซื้อขายสำเร็จลุล่วง</div>
        </div>

        <div>
            <strong>ข้อ 2 ระยะเวลาของสัญญา</strong><br/>
            สัญญานี้มีผลตั้งแต่วันที่ลงนาม และสิ้นสุดในวันที่ <span class="font-bold border-b border-dotted border-black px-2">{{endDate}}</span> หรือจนกว่าการซื้อขายจะแล้วเสร็จ ทั้งนี้สามารถต่ออายุโดยความยินยอมของทั้งสองฝ่ายเป็นลายลักษณ์อักษร
        </div>

        <div>
            <strong>ข้อ 3 ขอบเขตงานของนายหน้า</strong>
            <ul class="list-disc pl-8 mt-1 space-y-1">
                <li>ทำการตลาดทรัพย์สินโดยใช้ช่องทางต่าง ๆ ตามความเหมาะสม</li>
                <li>พาผู้สนใจเข้าชมทรัพย์สิน</li>
                <li>ให้ข้อมูลราคา เงื่อนไข และข้อเท็จจริงเกี่ยวกับตลาด</li>
                <li>ประสานงานการเจรจาระหว่างเจ้าของทรัพย์และผู้ซื้อ</li>
                <li>ดูแลขั้นตอนตั้งแต่ข้อเสนอซื้อจนถึงวันโอนกรรมสิทธิ์</li>
            </ul>
        </div>

        <div>
            <strong>ข้อ 4 หน้าที่ของเจ้าของทรัพย์</strong>
            <ul class="list-disc pl-8 mt-1 space-y-1">
                <li>เปิดเผยข้อมูลเกี่ยวกับทรัพย์สินตามความเป็นจริง</li>
                <li>แจ้งสิทธิ ภาระผูกพัน หรือการจำนองที่เกี่ยวกับทรัพย์</li>
                <li>ไม่ติดต่อหรือทำการตกลงโดยตรงกับผู้ซื้อและผู้ติดตามผู้ซื้อที่นายหน้าเป็นผู้แนะนำหรือพามาดูทรัพย์</li>
                <li>ให้ความร่วมมือในการนัดหมายและจัดเตรียมเอกสารที่เกี่ยวข้อง</li>
            </ul>
        </div>

        <div>
            <strong>ข้อ 5 ค่าตอบแทนและค่าคอมมิชชั่น</strong><br/>
            อัตราค่าคอมมิชชั่น: 3 % ของราคาซื้อขายจริง<br/>
            ผู้ชำระค่าคอมมิชชั่น: เจ้าของทรัพย์<br/>
            ค่าคอมมิชชั่นจะชำระ ณ วันโอนกรรมสิทธิ์หรือวันที่ทั้งสองฝ่ายตกลง
        </div>

        <div>
            <strong>ข้อ 6 กรณีเจ้าของทรัพย์ขายโดยตรงให้ผู้ซื้อที่นายหน้าแนะนำ</strong><br/>
            หากเจ้าของทรัพย์ปิดการขายกับผู้ซื้อ/ผู้ติดตามที่นายหน้าเป็นผู้แนะนำ หรือผู้ซื้อ/ผู้ติดตามผู้ซื้อที่เคยเข้าชมทรัพย์ผ่านนายหน้า เจ้าของทรัพย์ตกลงชำระค่าคอมมิชชั่นตามอัตราที่กำหนดไว้ในสัญญานี้ แม้ว่าสัญญาจะหมดอายุแล้วก็ตาม
        </div>

        <div>
            <strong>ข้อ 7 การสิ้นสุดสัญญา</strong><br/>
            สัญญานี้อาจสิ้นสุดก่อนกำหนดในกรณีใดกรณีหนึ่งดังต่อไปนี้:
            <ul class="list-disc pl-8 mt-1 space-y-1">
                <li>คู่สัญญาตกลงยุติสัญญาเป็นลายลักษณ์อักษร</li>
                <li>คู่สัญญาใดฝ่ายหนึ่งผิดสัญญาอย่างมีนัยสำคัญ</li>
            </ul>
        </div>

        <div>
            <strong>ข้อ 8 ข้อกำหนดทั่วไป</strong>
            <ul class="list-disc pl-8 mt-1 space-y-1">
                <li>สัญญานี้อยู่ภายใต้กฎหมายไทย</li>
                <li>การแก้ไขสัญญาต้องทำเป็นลายลักษณ์อักษรและลงนามโดยทั้งสองฝ่าย</li>
            </ul>
        </div>
    </div>

    <!-- Signatures -->
    <div class="mt-12 grid grid-cols-2 gap-8 break-inside-avoid">
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... เจ้าของทรัพย์</div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lessorSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lessorSignature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{lessor}}</span> )</div>
            <div class="mt-1">ชื่อ-สกุล</div>
        </div>
        
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... นายหน้า</div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lesseeSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lesseeSignature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">นางนัยนา เวียงพล</span> )</div>
            <div class="mt-1">ชื่อ-สกุล</div>
        </div>
    </div>

    <div class="mt-8 grid grid-cols-2 gap-8 break-inside-avoid">
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... พยาน 1</div>
            <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness1Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness1Signature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness1Name}}</span> )</div>
            <div class="mt-1">ชื่อ-สกุล</div>
        </div>
        
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... พยาน 2</div>
                <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness2Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness2Signature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness2Name}}</span> )</div>
            <div class="mt-1">ชื่อ-สกุล</div>
        </div>
    </div>

    <!-- Attachments -->
        <div class="mt-12 break-before-page">
        <div class="mb-8">
            <div class="font-bold mb-4">บัตรประชาชนเจ้าของทรัพย์</div>
            <img src="{{lessorIdImage}}" class="w-full max-w-md object-contain border" style="display: {{lessorIdImage ? 'block' : 'none'}}; max-height: 400px;" />
        </div>
        
        <div>
            <div class="font-bold mb-4">บัตรประชาชนนายหน้า</div>
            <img src="{{lesseeIdImage}}" class="w-full max-w-md object-contain border" style="display: {{lesseeIdImage ? 'block' : 'none'}}; max-height: 400px;" />
        </div>
    </div>

</div>`;


const DEFAULT_RESERVATION_SECTIONS: Section[] = [
    {
        id: "sec_project",
        title: "ข้อมูลโครงการและห้องชุด",
        fields: [
            { id: "projectName", label: "ชื่อโครงการ", type: "text" },
            { id: "projectLocation", label: "ที่ตั้ง", type: "textarea" },
            { id: "roomType", label: "ประเภทห้อง", type: "text" },
            { id: "roomSize", label: "ขนาด (ตร.ม.)", type: "text" },
            { id: "roomFloor", label: "ชั้น", type: "text" },
            { id: "furniture", label: "เฟอร์นิเจอร์", type: "textarea" },
            { id: "appliances", label: "เครื่องใช้ไฟฟ้า", type: "textarea" },
        ]
    },
    {
        id: "sec_payment",
        title: "รายละเอียดค่าใช้จ่ายและสัญญา",
        fields: [
            { id: "monthlyRent", label: "ค่าเช่าต่อเดือน", type: "number" },
            { id: "securityDeposit", label: "ค่าประกัน", type: "number" },
            { id: "totalBeforeMoveIn", label: "รวมชำระก่อนเข้าอยู่", type: "number" },
            { id: "contractTerm", label: "ระยะสัญญา", type: "text" },
            { id: "contractStartDate", label: "วันเริ่มสัญญา", type: "date" },
            { id: "moveInDate", label: "เข้าอยู่ได้ตั้งแต่", type: "date" },
            { id: "notes", label: "เงื่อนไขเพิ่มเติม", type: "textarea" }, // Default: ห้ามเลี้ยงสัตว์, ห้ามสูบบุหรี่
        ]
    },
    {
        id: "sec_reservation",
        title: "การจองและการชำระเงิน",
        fields: [
            { id: "reservationFee", label: "ค่าจองห้อง (THB)", type: "number" },
            { id: "accountName", label: "ชื่อบัญชี", type: "text" },
            { id: "bankName", label: "ธนาคาร", type: "text" },
            { id: "accountNumber", label: "เลขที่บัญชี", type: "text" },
            { id: "contactInfo", label: "ข้อมูลติดต่อ (Contact)", type: "textarea" },
        ]
    }
];

const DEFAULT_RESERVATION_LAYOUT = `<div class="p-[20mm] md:p-[25mm] text-black font-[Cordia New] leading-normal relative text-[14pt]" style="font-family: 'Cordia New', sans-serif;">
    
    <div class="text-center font-bold text-xl text-blue-800 mb-4">รายละเอียดการจองห้องเช่า / Rental Reservation</div>

    <table class="w-full border-collapse border border-black">
        <thead>
            <tr class="bg-gray-200">
                <th class="border border-black p-1 w-1/3 text-left pl-2">รายการ / Item</th>
                <th class="border border-black p-1 w-2/3 text-left pl-2">รายละเอียด / Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="border border-black p-1 pl-2">ชื่อโครงการ / Project Name</td>
                <td class="border border-black p-1 pl-2">{{projectName}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ที่ตั้ง / Location</td>
                <td class="border border-black p-1 pl-2">{{projectLocation}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ประเภทห้อง / Room Type</td>
                <td class="border border-black p-1 pl-2">{{roomType}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ขนาด / Size</td>
                <td class="border border-black p-1 pl-2">{{roomSize}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ชั้น / Floor</td>
                <td class="border border-black p-1 pl-2">{{roomFloor}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2 valign-top">เฟอร์นิเจอร์ / Furniture</td>
                <td class="border border-black p-1 pl-2 min-h-[40px]">{{furniture}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2 valign-top">เครื่องใช้ไฟฟ้า / Appliances</td>
                <td class="border border-black p-1 pl-2 min-h-[40px]">{{appliances}}</td>
            </tr>
            <tr><td class="border border-black p-1 bg-gray-100" colspan="2"></td></tr>
            <tr>
                <td class="border border-black p-1 pl-2">ค่าเช่าต่อเดือน / Monthly Rent</td>
                <td class="border border-black p-1 pl-2">{{monthlyRent}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ค่าประกัน / Security Deposit</td>
                <td class="border border-black p-1 pl-2">{{securityDeposit}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">รวมชำระก่อนเข้าอยู่ / Total Cost Before Move-in</td>
                <td class="border border-black p-1 pl-2">{{totalBeforeMoveIn}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ระยะสัญญา / Contract Term</td>
                <td class="border border-black p-1 pl-2">{{contractTerm}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">วันเริ่มสัญญา / Contract Start Date</td>
                <td class="border border-black p-1 pl-2">{{contractStartDate}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">เข้าอยู่ได้ตั้งแต่ / Move-in Date</td>
                <td class="border border-black p-1 pl-2">{{moveInDate}}</td>
            </tr>
             <tr>
                <td class="border border-black p-1 pl-2 valign-top">เงื่อนไขเพิ่มเติม / Notes</td>
                <td class="border border-black p-1 pl-2">{{notes}}</td>
            </tr>
             <tr>
                <td class="border border-black p-1 pl-2 valign-top">
                    <div>ค่าจองห้อง/Room Reservation fee</div>
                    <div class="text-sm mt-1">*เงินจองจะใช้เป็นค่าเช่าเดือนแรกเมื่อทำสัญญา / The reservation fee will be used as the first month's rent upon signing the contract.</div>
                    <div class="text-sm mt-1">*เงินจองไม่สามารถเรียกคืนได้ / The reservation fee is non-refundable.</div>
                </td>
                <td class="border border-black p-1 pl-2 valign-top relative">
                    <div class="text-right mb-2 font-bold">{{reservationFee}} THB</div>
                    <div class="bg-yellow-200 inline-block px-1 border border-gray-400 text-sm mb-2">✅ จ่ายแล้ว/PAID</div>
                    
                    <div class="w-full h-32 bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-500 text-sm">
                        แนบสลิปโอนได้ (Attach Slip)
                        <!-- If we make this an image field later, we can put img tag here -->
                    </div>
                </td>
            </tr>
             <tr>
                <td class="border border-black p-1 pl-2 valign-top">การชำระเงิน / Payment</td>
                <td class="border border-black p-1 pl-2">
                    <div>Account Name : {{accountName}}</div>
                    <div>Bank Name : {{bankName}}</div>
                    <div>Account number : {{accountNumber}}</div>
                </td>
            </tr>
             <tr>
                <td class="border border-black p-1 pl-2">Contact</td>
                <td class="border border-black p-1 pl-2">{{contactInfo}}</td>
            </tr>
        </tbody>
    </table>

    <div class="mt-8 text-center text-sm text-gray-600">
        <div class="flex justify-end mb-2">
             <img src="/logo_PL_property.png" alt="PL Property" class="h-10 object-contain opacity-70" />
        </div>
        เอกสารฉบับนี้เป็นเพียงข้อเสนอเบื้องต้น ไม่ใช่สัญญาเช่า / This document is a preliminary offer, not a rental agreement.
    </div>

</div>`;

const DEFAULT_RECEIPT_LAYOUT = `<div class="p-8 text-black font-[Cordia New] leading-snug relative" style="font-family: 'Cordia New', sans-serif; font-size: 15pt;">
    
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
        <div class="w-1/3">
            <img src="/logo_PL_property.png" alt="PL Property" class="h-20 object-contain" />
        </div>
        
        <div class="text-center w-1/3">
            <div class="font-bold text-2xl">ใบเสร็จรับเงิน</div>
            <div class="font-bold text-xl">RECEIPT</div>
        </div>

        <div class="w-1/3 text-right">
            <div class="inline-block text-left">
                <span class="font-bold">วันที่</span> <span class="border-b border-dotted border-black min-w-[100px] inline-block text-center">{{contractDate}}</span><br>
                <span class="font-bold">Date</span>
            </div>
        </div>
    </div>

    <!-- Body -->
    <div class="space-y-2 mt-4">
        
        <!-- Received From -->
        <div class="flex items-end">
            <div class="w-32 font-bold">ได้รับเงินจาก</div>
            <div class="flex-1 border-b border-dotted border-black relative">
                <span class="absolute bottom-1 w-full text-center">{{receivedFrom}}</span>
                &nbsp;
            </div>
        </div>
        <div class="font-bold mb-2">Received From</div>

        <!-- Address -->
        <div class="flex items-end">
            <div class="w-32 font-bold">ที่อยู่</div>
            <div class="flex-1 border-b border-dotted border-black relative">
                <span class="absolute bottom-1 w-full text-left">{{address}}</span>
                &nbsp;
            </div>
        </div>
        <div class="font-bold mb-2">Address</div>

        <!-- In Payment of -->
        <div class="flex items-end">
            <div class="w-32 font-bold">เพื่อชำระค่า</div>
            <div class="flex-1 border-b border-dotted border-black relative">
                <span class="absolute bottom-1 w-full text-center">{{paymentFor}}</span>
                &nbsp;
            </div>
        </div>
        <div class="font-bold mb-2">In Payment of</div>

        <!-- Total Payment -->
        <div class="flex items-center mt-2">
            <div class="w-32 font-bold">รวมเป็นเงินทั้งสิ้น</div>
            <div class="flex-1 border-b border-dotted border-black relative text-center">
                {{amount:thai}}
            </div>
            <div class="w-16 text-right font-bold">บาท</div>
        </div>
        <div class="flex items-center mb-2">
            <div class="w-32 font-bold">Total of Payment</div>
            <div class="flex-1 text-center font-bold">
                {{amount:english}}
            </div>
            <div class="w-16 text-right font-bold">THB</div>
        </div>

        <!-- Amount Box Highlight -->
            <div class="flex justify-end mb-4">
            <div class="bg-gray-200 px-4 py-1 text-xl font-bold min-w-[200px] text-center border border-gray-300">
                {{amount}} .-
            </div>
        </div>

        <!-- Payment Method -->
        <div class="mb-2 space-y-0.5">
            <div class="font-bold">โดยเงินสด / เช็คธนาคาร / โอนผ่านธนาคาร</div>
            <div class="">By Cash / Cheque / Bank Transfer</div>
        </div>

    </div>

    <!-- Footer Signatures -->
    <div class="flex justify-between mt-8 pt-4">
        
        <!-- Collector -->
        <div class="text-center w-5/12">
            <div class="border-b border-dotted border-black h-12 flex items-end justify-center relative">
                <img src="{{collectorSignature}}" class="h-12 absolute bottom-0 max-w-full" style="display: {{collectorSignature ? 'block' : 'none'}}" />
            </div>
            <div class="mt-1 font-bold">ผู้รับเงิน / Collector</div>
            <div class="flex justify-center gap-1 mt-1">
                ( <span class="inline-block w-32 border-b border-dotted border-black"></span> )
            </div>
        </div>

        <!-- Payer -->
        <div class="text-center w-5/12">
                <div class="border-b border-dotted border-black h-12 flex items-end justify-center relative">
                <img src="{{payerSignature}}" class="h-12 absolute bottom-0 max-w-full" style="display: {{payerSignature ? 'block' : 'none'}}" />
            </div>
            <div class="mt-1 font-bold">ผู้จ่ายเงิน / Paid by</div>
                <div class="flex justify-center gap-1 mt-1">
                ( <span class="inline-block w-32 border-b border-dotted border-black"></span> )
            </div>
        </div>

    </div>

</div>`;

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
            if (!res.ok) throw new Error('Failed');
            alert('บันทึกเรียบร้อย');
            router.refresh();
        } catch (e) {
            alert('Error saving');
        } finally {
            setLoading(false);
        }
    };

    const addSection = () => {
        const newSection: Section = {
            id: `section_${Date.now()}`,
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
            id: `field_${Date.now()}`,
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
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'fields' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        <List size={16} /> โครงสร้างฟอร์ม
                    </button>
                    <button
                        onClick={() => setActiveTab('layout')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'layout' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
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

                                if (confirm(`ยืนยันการโหลดแบบฟอร์ม${label}มาตรฐาน? ข้อมูลปัจจุบันจะถูกทับ`)) {
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
                        className="w-full h-[600px] font-mono text-sm p-4 border rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="<html>...</html>"
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
