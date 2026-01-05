import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    const template = await prisma.contractTemplate.update({
        where: { id },
        data: { content },
    });

    return NextResponse.json(template);
}
