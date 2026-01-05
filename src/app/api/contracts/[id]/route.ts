import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const { data, lessorSignature, lesseeSignature } = body;

    const updateData: any = { data };
    if (lessorSignature !== undefined) updateData.lessorSignature = lessorSignature;
    if (lesseeSignature !== undefined) updateData.lesseeSignature = lesseeSignature;

    // If both signed, update status? Optional but good practice.
    // For now just update fields.

    const contract = await prisma.contract.update({
        where: { id },
        data: updateData,
    });

    return NextResponse.json(contract);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.contract.delete({
        where: { id },
    });
    return NextResponse.json({ success: true });
}
