import { Sidebar } from '@/components/Sidebar';
import { prisma } from '@/lib/prisma';
import { ContractDetail } from './ContractDetail';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const contract = await prisma.contract.findUnique({
        where: { id },
        include: { template: true },
    });

    if (!contract) notFound();

    return (
        <div className="flex min-h-screen bg-gray-50 print:bg-white">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <main className="flex-1 md:ml-64 ml-0 p-4 md:p-8 pb-24 md:pb-8 print:ml-0 print:p-0">
                <ContractDetail contract={contract} />
            </main>
        </div>
    );
}
