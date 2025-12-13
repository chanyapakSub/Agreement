import { prisma } from '@/lib/prisma';
import { SignContract } from './SignContract';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SignPage({ params }: { params: Promise<{ id: string; token: string }> }) {
    const { id, token } = await params;

    const contract = await prisma.contract.findUnique({
        where: { id },
    });

    if (!contract) {
        notFound();
    }

    const isValidToken =
        contract.token === token ||
        contract.lessorToken === token ||
        contract.lesseeToken === token;

    if (!isValidToken) {
        notFound();
    }

    return <SignContract contract={contract} currentToken={token} />;
}
