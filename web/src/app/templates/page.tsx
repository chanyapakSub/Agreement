import { Sidebar } from '@/components/Sidebar';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
    const templates = await prisma.contractTemplate.findMany();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 md:ml-64 ml-0 p-4 md:p-8 pb-24 md:pb-8">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">แบบฟอร์ม / เทมเพลต</h1>
                </div>
                <div className="grid gap-4">
                    {templates.map(t => (
                        <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{t.name}</h3>
                                <p className="text-gray-500 text-sm">Created: {t.createdAt.toLocaleDateString()}</p>
                            </div>
                            <Link href={`/templates/${t.id}`} className="text-blue-600 hover:underline">แก้ไขโครงสร้าง</Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
