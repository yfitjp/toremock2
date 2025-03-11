'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PurchasesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">購入履歴</h1>
          <p className="mt-2 text-gray-600">
            これまでに購入した模試の一覧です。
          </p>
        </div>

        {/* 購入履歴一覧 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {/* 履歴がない場合のメッセージ */}
            <div className="p-6 text-center text-gray-500">
              購入履歴はありません。
              <a href="/exams" className="text-blue-600 hover:text-blue-700 ml-2">
                模試を探す
              </a>
            </div>

            {/* 履歴の例（データがある場合に表示） */}
            {/*
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    TOEIC模擬試験 Vol.1
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    購入日: 2024年3月10日
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    ステータス: <span className="text-green-600">完了</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ¥2,800
                  </p>
                  <a
                    href="/exams/1"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700"
                  >
                    受験する →
                  </a>
                </div>
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </main>
  );
} 