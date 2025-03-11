'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  type: string;
  completed: boolean;
  isFree: boolean;
  score?: number;
  completedAt?: string;
}

const dummyExams: Exam[] = [
  {
    id: '1',
    title: 'TOEIC® L&R 模試 Vol.1',
    description: 'TOEIC® L&Rテストの模擬試験です。本番さながらの環境で受験できます。',
    duration: 120,
    difficulty: '中級',
    type: 'TOEIC® L&R',
    completed: false,
    isFree: true
  },
  {
    id: '2',
    title: 'TOEIC® L&R 模試 Vol.2',
    description: 'TOEIC® L&Rテストの模擬試験です。最新の出題傾向に対応しています。',
    duration: 120,
    difficulty: '中級',
    type: 'TOEIC® L&R',
    completed: true,
    isFree: false
  },
  {
    id: '3',
    title: 'TOEIC® L&R 模試 Vol.3',
    description: 'TOEIC® L&Rテストの模擬試験です。ビジネス場面に特化した問題が多く含まれています。',
    duration: 120,
    difficulty: '上級',
    type: 'TOEIC® L&R',
    completed: false,
    isFree: false
  }
];

const purchasedExams: Exam[] = [
  {
    id: '2',
    title: 'TOEIC® L&R 模試 Vol.2',
    description: 'TOEIC® L&Rテストの模擬試験です。より実践的な問題に挑戦できます。',
    duration: 120,
    difficulty: '上級',
    type: 'TOEIC® L&R',
    completed: false,
    isFree: false
  }
];

const examHistory: Exam[] = [
  {
    id: '1',
    title: 'TOEIC® L&R 模試 Vol.1',
    description: 'TOEIC® L&Rテストの模擬試験です。本番さながらの環境で受験できます。',
    duration: 120,
    difficulty: '中級',
    type: 'TOEIC® L&R',
    completed: true,
    score: 750,
    isFree: true,
    completedAt: '2024-03-15'
  }
];

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userExams, setUserExams] = useState<Exam[]>([]);
  const [userPurchasedExams, setUserPurchasedExams] = useState<Exam[]>([]);
  const [userExamHistory, setUserExamHistory] = useState<Exam[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      // 実際のアプリでは、ここでAPIからユーザーの模試データを取得します
      setUserExams(dummyExams);
      setUserPurchasedExams(purchasedExams);
      setUserExamHistory(examHistory);
      setLoading(false);
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-900">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-center mb-8">
                  マイページ
                </h1>

                <div className="bg-white shadow rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">プロフィール</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">お名前</dt>
                      <dd className="mt-1 text-sm text-gray-900">{session?.user?.name || '未設定'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                      <dd className="mt-1 text-sm text-gray-900">{session?.user?.email}</dd>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/auth/profile"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      プロフィールを編集
                    </Link>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">無料で利用可能な模試</h2>
                    <span className="text-sm text-blue-600">※ Vol.1は無料で受験できます</span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userExams.map((exam) => (
                      <motion.div
                        key={exam.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                            {exam.isFree && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                無料
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-900">{exam.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500 mb-1">
                              {exam.type}
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {exam.difficulty}
                            </span>
                          </div>
                          <div className="mt-4 text-sm text-gray-900">
                            所要時間: {exam.duration}分
                          </div>
                          <div className="mt-6">
                            {exam.completed ? (
                              <div className="text-center">
                                <p className="text-sm text-gray-900">スコア: {exam.score}点</p>
                                <Link
                                  href={`/exams/${exam.id}/result?score=${exam.score}`}
                                  className="mt-2 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  結果を見る
                                </Link>
                              </div>
                            ) : (
                              <Link
                                href={`/exams/${exam.id}/take`}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                模試を受験
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {userPurchasedExams.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">購入済みの模試</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {userPurchasedExams.map((exam) => (
                        <motion.div
                          key={exam.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white overflow-hidden shadow rounded-lg"
                        >
                          <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                            <p className="mt-2 text-sm text-gray-900">{exam.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="text-sm text-gray-500 mb-1">
                                {exam.type}
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {exam.difficulty}
                              </span>
                            </div>
                            <div className="mt-4 text-sm text-gray-900">
                              所要時間: {exam.duration}分
                            </div>
                            <div className="mt-6">
                              {exam.completed ? (
                                <div className="text-center">
                                  <p className="text-sm text-gray-900">スコア: {exam.score}点</p>
                                  <Link
                                    href={`/exams/${exam.id}/result?score=${exam.score}`}
                                    className="mt-2 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    結果を見る
                                  </Link>
                                </div>
                              ) : (
                                <Link
                                  href={`/exams/${exam.id}/take`}
                                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  模試を受験
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {userExamHistory.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6 mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">過去の模試結果</h2>
                    <div className="space-y-4">
                      {userExamHistory.map((exam) => (
                        <motion.div
                          key={exam.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                              <p className="text-sm text-gray-900 mt-1">受験日: {exam.completedAt}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{exam.score}</div>
                              <div className="text-sm text-gray-900">点</div>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center space-x-2">
                            <div className="text-sm text-gray-500 mb-1">
                              {exam.type}
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {exam.difficulty}
                            </span>
                          </div>
                          <div className="mt-4">
                            <Link
                              href={`/exams/${exam.id}/result?score=${exam.score}`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              詳細を見る
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
} 