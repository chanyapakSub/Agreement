'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ContractListControls() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentType = searchParams.get('type') || 'ALL';
    const currentSort = searchParams.get('sort') || 'desc';

    const handleTypeChange = (type: string) => {
        const params = new URLSearchParams(searchParams);
        if (type === 'ALL') params.delete('type');
        else params.set('type', type);
        router.push(`/?${params.toString()}`);
    };

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', sort);
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
                value={currentType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="ALL">ทั้งหมด (All Types)</option>
                <option value="LEASE">สัญญาเช่า (Lease)</option>
                <option value="BUY">สัญญาจะซื้อจะขาย (Buy/Sell)</option>
            </select>

            <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="desc">ล่าสุด (Newest)</option>
                <option value="asc">เก่าสุด (Oldest)</option>
            </select>
        </div>
    );
}
