import { Sidebar } from '@/components/Sidebar';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { FileText, Eye, Download, Link as LinkIcon } from 'lucide-react';
import { ContractListControls } from '@/components/ContractListControls';
import { DeleteContractButton } from '@/components/DeleteContractButton';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const type = typeof params.type === 'string' ? params.type : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'desc';

  const where: any = {};
  if (type && type !== 'ALL') {
    where.type = type;
  }

  const contracts = await prisma.contract.findMany({
    where,
    orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
    include: { template: true }
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">รายการสัญญา</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">จัดการสัญญาเช่าทั้งหมดของคุณ</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a href="/api/export" target="_blank" className="justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm text-sm">
              <Download size={18} />
              Export Excel
            </a>
            <Link href="/contracts/new" className="justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm text-sm">
              <FileText size={18} />
              สร้างสัญญาใหม่
            </Link>
          </div>
        </div>

        <ContractListControls />

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">รหัสห้อง - คอนโด</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">ประเภท</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">ผู้เช่า</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">สถานะ</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">วันที่สร้าง</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      ไม่พบสัญญาในระบบ
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract) => {
                    let tenantName = '-';
                    try {
                      const data = JSON.parse(contract.data);
                      if (data.sections) {
                        data.sections.forEach((s: any) => {
                          s.fields.forEach((f: any) => {
                            if (f.id === 'lessee') tenantName = f.value || '-';
                          });
                        });
                      }
                    } catch (e) {
                      console.error('Error parsing contract data', e);
                    }

                    return (
                      <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {contract.identifier}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${contract.type === 'BUY' ? 'bg-orange-100 text-orange-800' : 'bg-blue-50 text-blue-700'
                            }`}>
                            {contract.type === 'BUY' ? 'ซื้อขาย' : 'เช่า'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {tenantName}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${contract.status === 'SIGNED' ? 'bg-green-100 text-green-700' :
                            contract.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                            {contract.status === 'SIGNED' ? 'ลงนามแล้ว' :
                              contract.status === 'SENT' ? 'ส่งแล้ว' : 'ร่างสัญญา'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {format(contract.createdAt, 'dd MMM yyyy HH:mm', { locale: th })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/contracts/${contract.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="ดูรายละเอียด">
                              <Eye size={18} />
                            </Link>
                            <DeleteContractButton id={contract.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 mt-4">
          {contracts.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border">
              ไม่พบสัญญาในระบบ
            </div>
          ) : (
            contracts.map((contract) => {
              let tenantName = '-';
              try {
                const data = JSON.parse(contract.data);
                if (data.sections) {
                  data.sections.forEach((s: any) => {
                    s.fields.forEach((f: any) => {
                      if (f.id === 'lessee') tenantName = f.value || '-';
                    });
                  });
                }
              } catch (e) {
                console.error('Error parsing contract data', e);
              }

              return (
                <div key={contract.id} className="bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{contract.identifier}</h3>
                      <p className="text-sm text-gray-500">{format(contract.createdAt, 'dd MMM yyyy HH:mm', { locale: th })}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${contract.type === 'BUY' ? 'bg-orange-100 text-orange-800' : 'bg-blue-50 text-blue-700'
                      }`}>
                      {contract.type === 'BUY' ? 'ซื้อขาย' : 'เช่า'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ผู้เช่า:</span>
                      <span className="font-medium text-gray-900">{tenantName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">สถานะ:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${contract.status === 'SIGNED' ? 'bg-green-100 text-green-700' :
                        contract.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {contract.status === 'SIGNED' ? 'ลงนามแล้ว' :
                          contract.status === 'SENT' ? 'ส่งแล้ว' : 'ร่างสัญญา'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Link href={`/contracts/${contract.id}`} className="flex-1 justify-center bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium">
                      <Eye size={16} />
                      ดูรายละเอียด
                    </Link>
                    <div className="flex-none">
                      <DeleteContractButton id={contract.id} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
