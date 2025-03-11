'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">マイページ</h1>
          <p className="mt-2 text-gray-600">
            ようこそ、{session?.user?.name || 'ゲスト'}さん
          </p>
        </div>

        {/* 最近の学習状況 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">受験した模試</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500 mt-1">全期間</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">平均スコア</h3>
            <p className="text-3xl font-bold text-blue-600">-</p>
            <p className="text-sm text-gray-500 mt-1">全模試の平均</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">学習時間</h3>
            <p className="text-3xl font-bold text-blue-600">0時間</p>
            <p className="text-sm text-gray-500 mt-1">今月の合計</p>
          </div>
        </div>

        {/* 購入済み模試 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">購入済みの模試</h2>
          <div className="border rounded-lg divide-y">
            {/* 模試がない場合のメッセージ */}
            <div className="p-4 text-center text-gray-500">
              購入済みの模試はありません。
              <a href="/exams" className="text-blue-600 hover:text-blue-700 ml-2">
                模試を探す
              </a>
            </div>
          </div>
        </div>

        {/* 受験履歴 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">受験履歴</h2>
          <div className="border rounded-lg divide-y">
            {/* 履歴がない場合のメッセージ */}
            <div className="p-4 text-center text-gray-500">
              受験履歴はありません。
              <a href="/exams" className="text-blue-600 hover:text-blue-700 ml-2">
                模試に挑戦する
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 