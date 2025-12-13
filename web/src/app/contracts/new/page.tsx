import { Sidebar } from '@/components/Sidebar';
import { prisma } from '@/lib/prisma';
import { ContractForm } from './ContractForm';

export const dynamic = 'force-dynamic';

export default async function NewContractPage() {
    const templates = await prisma.contractTemplate.findMany();

    return (
        <div className="flex min-h-screen bg-gray-50 print:bg-white">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <main className="flex-1 md:ml-64 ml-0 p-4 md:p-8 pb-24 md:pb-8 print:ml-0 print:p-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 print:hidden">สร้างสัญญาใหม่</h1>
                <ContractForm templates={templates} />
            </main>
        </div>
    );
}
