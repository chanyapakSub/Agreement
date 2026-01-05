import Link from 'next/link';
import { Home, PlusCircle, Settings } from 'lucide-react';

export function MobileNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-3 md:hidden print:hidden z-50 shadow-lg pb-safe">
            <Link href="/" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600">
                <Home size={24} />
                <span className="text-[10px] font-medium">หน้าแรก</span>
            </Link>
            <Link href="/contracts/new" className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700">
                <div className="bg-blue-100 p-2 rounded-full -mt-6 border-4 border-white shadow-sm">
                    <PlusCircle size={32} />
                </div>
                <span className="text-[10px] font-medium">สร้างสัญญา</span>
            </Link>
            <Link href="/templates" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600">
                <Settings size={24} />
                <span className="text-[10px] font-medium">ตั้งค่า</span>
            </Link>
        </div>
    );
}
