'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  questions: any[];
}

export default function PurchasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`/api/exams/${params.id}`);
        if (!response.ok) throw new Error('模試情報の取得に失敗しました');
        const data = await response.json();
        setExam(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/exams')}
            className="text-blue-600 hover:text-blue-800"
          >
            模試一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">情報が見つかりません</h2>
          <button
            onClick={() => router.push('/exams')}
            className="text-blue-600 hover:text-blue-800"
          >
            模試一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {exam.title} の購入
            </h1>
            <p className="text-gray-600">{exam.description}</p>
            <p className="mt-4 text-xl font-semibold text-gray-900">
              ¥{exam.price.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              現在、決済システムは開発中です。<br />
              決済機能は後日実装予定です。
            </p>
            <Link
              href="/exams"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              模試一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 