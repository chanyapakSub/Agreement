'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteContractButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('คุณต้องการลบสัญญานี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/contracts/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete');
            router.refresh();
        } catch (e) {
            alert('Error deleting contract');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="ลบสัญญา"
        >
            <Trash2 size={18} />
        </button>
    );
}
