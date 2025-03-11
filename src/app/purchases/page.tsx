'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Purchase {
  id: string;
  examId: string;
  examTitle: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired';
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 模擬的なデータ取得
    // 実際のアプリケーションではAPIからデータを取得します
    setTimeout(() => {
      try {
        setPurchases([
          {
            id: '1',
            examId: '1',
            examTitle: 'TOEIC® L&R 模試 Vol.1',
            purchaseDate: '2023-05-15',
            expiryDate: '2024-05-15',
            status: 'active',
          },
          {
            id: '2',
            examId: '2',
            examTitle: 'TOEIC® L&R 模試 Vol.2',
            purchaseDate: '2023-04-10',
            expiryDate: '2024-04-10',
            status: 'active',
          },
        ]);
      } catch {
        setErrorMessage('購入履歴の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">購入履歴</h1>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">購入した模試はありません。</p>
          <Link
            href="/exams"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            模試を探す
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">購入履歴</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  模試名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  購入日
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  有効期限
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{purchase.examTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{purchase.purchaseDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{purchase.expiryDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      purchase.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {purchase.status === 'active' ? '有効' : '期限切れ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {purchase.status === 'active' && (
                      <Link
                        href={`/exams/${purchase.examId}/take`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        受験する
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 