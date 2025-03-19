'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getAllExams, Exam } from '@/app/lib/exams';
import { formatTimestamp } from '@/app/lib/firestore';
import { useAuth } from '@/app/hooks/useAuth';
import { hasActiveSubscription } from '@/app/lib/subscriptions';
import { checkExamPurchase } from '@/app/lib/purchases';
import PurchaseButton from '@/app/components/PurchaseButton';

export default function ExamsPage() {
  const { user, loading: authLoading } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [purchasedExams, setPurchasedExams] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const examData = await getAllExams();
        if (!examData || examData.length === 0) {
          setError('現在利用可能な模試はありません。');
          setExams([]);
        } else {
          setExams(examData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('模試データの取得中にエラーが発生しました。しばらく待ってから再度お試しください。');
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        try {
          const hasSubscription = await hasActiveSubscription(user.uid);
          setHasSubscription(hasSubscription);
        } catch (err) {
          console.error('サブスクリプション確認エラー:', err);
          setHasSubscription(false);
        }
      } else {
        setHasSubscription(false);
      }
    };

    const checkPurchases = async () => {
      if (user) {
        try {
          const purchased = new Set<string>();
          for (const exam of exams) {
            if (!exam.isFree) {
              const isPurchased = await checkExamPurchase(user.uid, exam.id);
              if (isPurchased) {
                purchased.add(exam.id);
              }
            }
          }
          setPurchasedExams(purchased);
        } catch (err) {
          console.error('購入状態確認エラー:', err);
        }
      }
    };

    if (!authLoading) {
      checkSubscription();
      checkPurchases();
    }
  }, [user, authLoading, exams]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">模試一覧</h1>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{exam.title}</h2>
                    <div className="flex space-x-2">
                      {exam.isFree && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">無料</span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        exam.difficulty === '中級'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.difficulty}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{exam.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <span>所要時間: {exam.duration}分</span>
                    <span>タイプ: {exam.type}</span>
                  </div>

                  {exam.isFree ? (
                    <Link
                      href={`/exams/${exam.id}/take`}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      無料で受験する
                    </Link>
                  ) : purchasedExams.has(exam.id) ? (
                    <Link
                      href={`/exams/${exam.id}/take`}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      受験する（購入済み）
                    </Link>
                  ) : hasSubscription ? (
                    <Link
                      href={`/exams/${exam.id}/take`}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      受験する
                    </Link>
                  ) : (
                    <PurchaseButton
                      examId={exam.id}
                      price={exam.price}
                      isDisabled={!user || purchasedExams.has(exam.id)}
                    />
                  )}

                  {hasSubscription && !exam.isFree && !purchasedExams.has(exam.id) && (
                    <p className="mt-2 text-xs text-green-600 text-center">
                      プレミアム会員特典：無料でアクセス可能
                    </p>
                  )}

                  {!user && !exam.isFree && (
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      購入するには
                      <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 ml-1">
                        ログイン
                      </Link>
                      が必要です
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
} 