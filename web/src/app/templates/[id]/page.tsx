import { Sidebar } from '@/components/Sidebar';
import { prisma } from '@/lib/prisma';
import { TemplateEditor } from './TemplateEditor';
import { notFound } from 'next/navigation';

export default async function TemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const template = await prisma.contractTemplate.findUnique({ where: { id } });

    if (!template) notFound();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 md:ml-64 ml-0 p-4 md:p-8 pb-24 md:pb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">แก้ไขเทมเพลต: {template.name}</h1>
                <TemplateEditor template={template} />
            </main>
        </div>
    );
}
