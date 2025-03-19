import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { getUserPurchases, Purchase } from '@/app/lib/purchases';
import { getExam } from '@/app/lib/exams';
import { Timestamp } from 'firebase/firestore';

// 購入ステータスの日本語表示
const purchaseStatusMap = {
  'pending': '処理中',
  'completed': '購入完了',
  'failed': '購入失敗',
  'refunded': '返金済み',
  'cancelled': 'キャンセル済み'
} as const;

// 日付をフォーマットする関数
function formatDate(date: Date | Timestamp | undefined): string {
  if (!date) return '不明';
  
  // Timestampの場合はDateに変換
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(dateObj);
}

// Timestampをソート可能な値に変換する関数
function getTimestamp(date: Date | Timestamp | undefined): number {
  if (!date) return 0;
  if (date instanceof Timestamp) {
    return date.toMillis();
  }
  return date.getTime();
}

export default function PurchaseHistory() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<(Purchase & { examTitle: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const purchaseData = await getUserPurchases(user.uid);
        
        // 各購入履歴に対応する模試のタイトルを取得
        const purchasesWithExamTitle = await Promise.all(
          purchaseData.map(async (purchase) => {
            const exam = await getExam(purchase.examId);
            return {
              ...purchase,
              examTitle: exam?.title || '不明な模試'
            };
          })
        );

        // 購入日時で降順ソート
        const sortedPurchases = purchasesWithExamTitle.sort((a, b) => {
          return getTimestamp(b.purchaseDate) - getTimestamp(a.purchaseDate);
        });

        setPurchases(sortedPurchases);
        setError(null);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError('購入履歴の取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-500">購入履歴を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <div className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">購入履歴なし</h3>
        <p className="mt-1 text-sm text-gray-500">
          まだ模試を購入していません
        </p>
        <div className="mt-6">
          <Link
            href="/exams"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            模試を購入する
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">購入済み模試</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className={`bg-white shadow-md rounded-lg overflow-hidden border ${
              purchase.status === 'completed' ? 'border-green-200' : 'border-gray-200'
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">
                  {purchase.examTitle}
                </h3>
                {purchase.status === 'completed' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    購入済み
                  </span>
                )}
              </div>
              <div className="text-sm space-y-2 text-gray-500 mb-4">
                <p className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(purchase.purchaseDate)}
                </p>
                <p className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className={purchase.status === 'completed' ? 'text-green-600 font-medium' : ''}>
                    {purchaseStatusMap[purchase.status as keyof typeof purchaseStatusMap] || '不明'}
                  </span>
                </p>
                <p className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ¥{purchase.amount.toLocaleString()}
                </p>
              </div>
              {purchase.status === 'completed' && (
                <Link
                  href={`/exams/${purchase.examId}/take`}
                  className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  受験する
                </Link>
              )}
              {purchase.status === 'pending' && (
                <div className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-50 cursor-not-allowed">
                  決済処理中...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 