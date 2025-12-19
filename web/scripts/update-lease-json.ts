
const fs = require('fs');

const raw = fs.readFileSync('temp_lease.json', 'utf8');
const data = JSON.parse(raw);

const translations: Record<string, string> = {
    // Info
    "contractDate": "วันที่ทำสัญญา (Date)",
    "location": "สถานที่ทำสัญญา (Written at)",
    "roomNumber": "เลขที่ห้อง (Room No.)",
    "condoName": "ชื่อโครงการ/คอนโด (Project/Condo Name)",

    // Lessor
    "lessor": "ชื่อ-นามสกุล ผู้ให้เช่า (Lessor Name)",
    "lessorPhone": "เบอร์โทรศัพท์ (Tel)",
    "lessorId": "เลขบัตรประชาชน (ID Card No.)",
    "lessorAddress": "ที่อยู่ (Address)",
    "lessorIdImage": "รูปถ่ายบัตรประชาชน (ID Card Photo)",

    // Lessee (Generic for 1-4)
    "lessee": "ชื่อ-นามสกุล ผู้เช่า (Lessee Name)",
    "lesseePhone": "เบอร์โทรศัพท์ (Tel)",
    "lesseeId": "เลขบัตรประชาชน/Passport (ID Card/Passport No.)",
    "lesseeAddress": "ที่อยู่ (Address)",
    "lesseeIdImage": "รูปถ่ายบัตรประชาชน/Passport (ID Card/Passport Photo)",

    "lessee2": "ชื่อ-นามสกุล ผู้เช่าคนที่ 2 (Lessee 2 Name)",
    "lesseePhone2": "เบอร์โทรศัพท์ (Tel)",
    "lesseeId2": "เลขบัตรประชาชน/Passport (ID Card/Passport No.)",
    "lesseeAddress2": "ที่อยู่ (Address)",
    "lesseeIdImage2": "รูปถ่ายบัตรประชาชน/Passport (ID Card/Passport Photo)",

    "lessee3": "ชื่อ-นามสกุล ผู้เช่าคนที่ 3 (Lessee 3 Name)",
    "lesseePhone3": "เบอร์โทรศัพท์ (Tel)",
    "lesseeId3": "เลขบัตรประชาชน/Passport (ID Card/Passport No.)",
    "lesseeAddress3": "ที่อยู่ (Address)",
    "lesseeIdImage3": "รูปถ่ายบัตรประชาชน/Passport (ID Card/Passport Photo)",

    "lessee4": "ชื่อ-นามสกุล ผู้เช่าคนที่ 4 (Lessee 4 Name)",
    "lesseePhone4": "เบอร์โทรศัพท์ (Tel)",
    "lesseeId4": "เลขบัตรประชาชน/Passport (ID Card/Passport No.)",
    "lesseeAddress4": "ที่อยู่ (Address)",
    "lesseeIdImage4": "รูปถ่ายบัตรประชาชน/Passport (ID Card/Passport Photo)",

    // Details
    "duration": "ระยะเวลาเช่า (เช่น 1 ปี) (Lease Term)",
    "startDate": "วันเริ่มสัญญา (Start Date)",
    "endDate": "วันสิ้นสุดสัญญา (End Date)",
    "rentAmount": "ค่าเช่า (บาท/เดือน) (Rent (Baht/Month))",
    "dueDay": "กำหนดชำระทุกวันที่ (Payment Due Date)",

    // Payment
    "bankName": "ธนาคาร (Bank Name)",
    "accountName": "ชื่อบัญชี (Account Name)",
    "accountNumber": "เลขที่บัญชี (Account No.)",
    "bankAccountImage": "รูปหน้าสมุดบัญชี (Bank Book Photo)",

    // Deposit
    "deposit": "เงินประกัน (บาท) (Security Deposit (Baht))",
    "fineAmount": "ค่าปรับล่าช้า (บาท/วัน) (Late Fine (Baht/Day))",
    "cleaningFee": "ค่าทำความสะอาด (บาท) (Cleaning Fee (Baht))",
    "acCleaningFee": "ค่าล้างแอร์ (บาท) (AC Cleaning Fee (Baht))",

    // Docs
    "houseRegImage": "รูปสำเนาทะเบียนบ้าน (House Registration Copy)"
};

data.sections.forEach((sec: any) => {
    sec.fields.forEach((field: any) => {
        if (translations[field.id]) {
            field.label = translations[field.id];
        }
    });
});

fs.writeFileSync('scripts/lease_template_data.json', JSON.stringify(data, null, 4));
console.log('Created scripts/lease_template_data.json with updated labels.');
