'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { getExam } from '@/app/lib/exams';

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [examTitle, setExamTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!user || !params?.id) return;

      try {
        const examId = Array.isArray(params.id) ? params.id[0] : params.id;
        const exam = await getExam(examId);
        if (exam) {
          setExamTitle(exam.title);
        }
      } catch (err) {
        console.error('Error fetching exam details:', err);
        setError('模試情報の取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        router.push('/auth/signin');
      } else {
        fetchExamDetails();
      }
    }
  }, [user, authLoading, params, router]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
          <Link
            href="/exams"
            className="mt-4 inline-block text-blue-600 hover:text-blue-500"
          >
            模試一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const examId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            購入完了
          </h2>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
            {examTitle}の購入が完了しました。
          </p>

          <div className="mt-6 space-y-4">
            {examId && (
              <Link
                href={`/exams/${examId}/take`}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                模試を受験する
              </Link>
            )}
            <Link
              href="/exams"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              模試一覧に戻る
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 