import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Generate tokens
        const token = randomBytes(16).toString('hex'); // Keep for backward compat
        const lessorToken = randomBytes(16).toString('hex');
        const lesseeToken = randomBytes(16).toString('hex');

        const contract = await prisma.contract.update({
            where: { id },
            data: {
                token,
                lessorToken,
                lesseeToken,
                status: 'SENT'
            },
        });

        return NextResponse.json(contract);
    } catch (error: any) {
        console.error('Error generating token:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
