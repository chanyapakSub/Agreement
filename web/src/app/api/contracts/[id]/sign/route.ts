import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const { signature, token } = body;

    const contract = await prisma.contract.findUnique({ where: { id } });

    if (!contract) {
        return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const updates: any = {};
    const now = new Date();

    // Determine role based on token
    if (contract.lessorToken === token) {
        updates.lessorSignature = signature;
        updates.lessorSignedAt = now;
    } else if (contract.lesseeToken === token) {
        updates.lesseeSignature = signature;
        updates.lesseeSignedAt = now;
    } else if (contract.token === token) {
        // Legacy support
        updates.signature = signature;
        updates.signedAt = now;
        updates.status = 'SIGNED';
    } else {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Check if both signed (including the one just updated)
    const isLessorSigned = updates.lessorSignature || contract.lessorSignature;
    const isLesseeSigned = updates.lesseeSignature || contract.lesseeSignature;

    if (isLessorSigned && isLesseeSigned) {
        updates.status = 'SIGNED';
    }

    const updated = await prisma.contract.update({
        where: { id },
        data: updates,
    });

    return NextResponse.json(updated);
}
