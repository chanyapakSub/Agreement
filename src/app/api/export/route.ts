import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

export async function GET() {
    const contracts = await prisma.contract.findMany({
        include: { template: true },
        orderBy: { createdAt: 'desc' },
    });

    const rows = contracts.map((c: any) => {
        let data: any = {};
        try {
            data = JSON.parse(c.data);
        } catch (e) {
            console.error('Error parsing contract data', e);
        }

        // Helper to find value
        const findValue = (id: string) => {
            if (!data || !data.sections) return '';
            for (const s of data.sections) {
                if (!s.fields) continue;
                const f = s.fields.find((field: any) => field.id === id);
                if (f) return f.value;
            }
            return '';
        };

        // Note: The key used here must match the 'key' property in worksheet.columns below
        return {
            'roomNumber': findValue('roomNumber'),
            'condoName': findValue('condoName'),
            'startDate': findValue('startDate'),
            'endDate': findValue('endDate'),
            'contractDate': findValue('contractDate'),
            'lessor': findValue('lessor'),
            'lessee': findValue('lessee'),
            'rentAmount': findValue('rentAmount'),
            'deposit': findValue('deposit'),
            'duration': findValue('duration'),
            'status': c.status,
            'createdAt': c.createdAt.toISOString().split('T')[0],
            'signedAt': c.signedAt ? c.signedAt.toISOString().split('T')[0] : '',
        };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Contracts');

    // Define columns
    worksheet.columns = [
        { header: 'เลขห้อง', key: 'roomNumber', width: 15 },
        { header: 'คอนโด', key: 'condoName', width: 25 },
        { header: 'วันเข้า', key: 'startDate', width: 15 },
        { header: 'วันหมดสัญญา', key: 'endDate', width: 15 },
        { header: 'วันที่ทำสัญญา', key: 'contractDate', width: 15 },
        { header: 'ผู้ให้เช่า', key: 'lessor', width: 20 },
        { header: 'ผู้เช่า', key: 'lessee', width: 20 },
        { header: 'ค่าเช่า', key: 'rentAmount', width: 15 },
        { header: 'เงินประกัน', key: 'deposit', width: 15 },
        { header: 'ระยะเวลา (เดือน)', key: 'duration', width: 15 },
        { header: 'สถานะ', key: 'status', width: 15 },
        { header: 'วันที่สร้าง', key: 'createdAt', width: 15 },
        { header: 'วันที่เซ็น', key: 'signedAt', width: 15 },
    ];

    // Add rows
    worksheet.addRows(rows);

    // Style Header Row (Optional but nice)
    worksheet.getRow(1).font = { bold: true };

    const buf = await workbook.xlsx.writeBuffer();

    return new NextResponse(buf, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="contracts.xlsx"',
        },
    });
}
