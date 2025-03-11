'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [examTitle, setExamTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const examId = searchParams.get('examId');
    if (!examId) {
      router.push('/exams');
      return;
    }

    // 模試情報を取得
    const fetchExamDetails = async () => {
      try {
        const response = await fetch(`/api/exams/${examId}`);
        if (!response.ok) throw new Error('模試情報の取得に失敗しました');
        const data = await response.json();
        setExamTitle(data.title);
      } catch (error) {
        console.error('Error fetching exam details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              開発中の機能です
            </h2>
            <p className="mt-2 text-gray-600">
              決済機能は現在開発中です。<br />
              後日実装予定です。
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900">現在利用可能な機能</h3>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>• 模試一覧の閲覧</li>
                <li>• 模試の詳細表示</li>
                <li>• ユーザー登録・ログイン</li>
                <li>• マイページの閲覧</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                マイページへ
              </Link>
              <Link
                href="/exams"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                模試一覧へ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 