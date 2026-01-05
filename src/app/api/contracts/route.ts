import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { templateId, identifier, data, type } = body;

        const contract = await prisma.contract.create({
            data: {
                templateId,
                identifier,
                data,
                type: type || 'LEASE',
                status: 'DRAFT',
            },
        });

        return NextResponse.json(contract);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating contract' }, { status: 500 });
    }
}
