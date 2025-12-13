import Link from 'next/link';
import Image from 'next/image';
import { Home, PlusCircle, Settings } from 'lucide-react';

export function Sidebar() {
    return (
        <div className="w-64 bg-white border-r h-screen hidden md:flex print:hidden flex-col fixed left-0 top-0 overflow-y-auto z-50">

            <div className="p-6 border-b flex flex-col items-center">
                {/* โลโก้ */}
                <Image
                    src="/logo_PL_property.png"
                    alt="PL Property Logo"
                    width={80}
                    height={80}
                    className="mb-3"
                />

                <h1 className="text-2xl font-bold text-blue-600">ContractApp</h1>
                <p className="text-xs text-gray-500 mt-1">ระบบจัดการสัญญาเช่า</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
                    <Home size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">รายการสัญญา</span>
                </Link>
                <Link href="/contracts/new" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
                    <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">สร้างสัญญาใหม่</span>
                </Link>
                <Link href="/templates" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
                    <Settings size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">แบบฟอร์ม / เทมเพลต</span>
                </Link>
            </nav>

            <div className="p-4 border-t text-xs text-gray-400 text-center">
                v1.0.0
            </div>
        </div>
    );
}
