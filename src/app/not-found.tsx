import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
            <h1 className="text-6xl font-bold mb-4 text-blue-600">404</h1>
            <h2 className="text-2xl font-semibold mb-2">ไม่พบหน้านี้</h2>
            <p className="text-gray-500 mb-8">ขออภัย เราไม่พบหน้าที่คุณกำลังมองหา</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                กลับสู่หน้าหลัก
            </Link>
        </div>
    );
}
