import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

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

        return {
            'เลขห้อง': findValue('roomNumber'),
            'คอนโด': findValue('condoName'),
            'วันเข้า': findValue('startDate'),
            'วันหมดสัญญา': findValue('endDate'),
            'วันที่ทำสัญญา': findValue('contractDate'),
            'ผู้ให้เช่า': findValue('lessor'),
            'ผู้เช่า': findValue('lessee'),
            'ค่าเช่า': findValue('rentAmount'),
            'เงินประกัน': findValue('deposit'),
            'ระยะเวลา (เดือน)': findValue('duration'),
            'สถานะ': c.status,
            'วันที่สร้าง': c.createdAt.toISOString().split('T')[0],
            'วันที่เซ็น': c.signedAt ? c.signedAt.toISOString().split('T')[0] : '',
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");

    const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="contracts.xlsx"',
        },
    });
}
