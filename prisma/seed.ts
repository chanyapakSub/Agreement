require('dotenv').config()
const { PrismaClient } = require('d:/fastwork/Agreement/web/src/generated/client/client')

const prisma = new PrismaClient()

const defaultTemplate = {
    title: "สัญญาเช่าอสังหาริมทรัพย์",
    sections: [
        {
            id: "parties",
            title: "คู่สัญญา",
            fields: [
                { id: "location", label: "ทำที่", type: "text", placeholder: "สถานที่ทำสัญญา" },
                { id: "contractDate", label: "วันที่ทำสัญญา", type: "date" },
                { id: "lessor", label: "ผู้ให้เช่า (ชื่อ-นามสกุล)", type: "text" },
                { id: "lessorId", label: "เลขบัตรประชาชนผู้ให้เช่า", type: "text" },
                { id: "lessee", label: "ผู้เช่า (ชื่อ-นามสกุล)", type: "text" },
                { id: "lesseeId", label: "เลขบัตรประชาชนผู้เช่า", type: "text" },
            ]
        },
        {
            id: "property",
            title: "ทรัพย์สินที่เช่า",
            fields: [
                { id: "condoName", label: "ชื่ออาคารชุด/คอนโด", type: "text" },
                { id: "roomNumber", label: "เลขที่ห้อง", type: "text" },
                { id: "floor", label: "ชั้น", type: "text" },
                { id: "building", label: "อาคาร", type: "text" },
                { id: "size", label: "ขนาด (ตร.ม.)", type: "number" },
            ]
        },
        {
            id: "terms",
            title: "ข้อตกลงการเช่า",
            fields: [
                { id: "duration", label: "ระยะเวลาเช่า (เดือน)", type: "number" },
                { id: "startDate", label: "เริ่มตั้งแต่วันที่", type: "date" },
                { id: "endDate", label: "สิ้นสุดวันที่", type: "date" },
                { id: "rentAmount", label: "ค่าเช่าต่อเดือน (บาท)", type: "number" },
                { id: "deposit", label: "เงินประกัน (บาท)", type: "number" },
                { id: "advanceRent", label: "ค่าเช่าล่วงหน้า (บาท)", type: "number" },
            ]
        }
    ]
}

async function main() {
    // Check if exists
    const count = await prisma.contractTemplate.count();
    if (count === 0) {
        const template = await prisma.contractTemplate.create({
            data: {
                name: "สัญญาเช่ามาตรฐาน",
                content: JSON.stringify(defaultTemplate),
            },
        })
        console.log({ template })
    } else {
        console.log("Templates already exist")
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
