'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getAllExams, Exam } from '@/app/lib/exams';
import { formatTimestamp } from '@/app/lib/firestore';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const examData = await getAllExams();
        setExams(examData);
        setError(null);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('模試データの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

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
                  模試一覧
                </h1>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                ) : exams.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">模試が見つかりませんでした。</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam) => (
                      <motion.div
                        key={exam.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                          <p className="mt-2 text-sm text-gray-500">{exam.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {exam.type}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {exam.difficulty}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              所要時間: {exam.duration}分
                            </div>
                            <div className="text-lg font-medium text-gray-900">
                              {exam.isFree ? (
                                <span className="text-green-600">無料</span>
                              ) : (
                                <span>¥{exam.price.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                          {exam.createdAt && (
                            <div className="mt-2 text-xs text-gray-400">
                              公開日: {formatTimestamp(exam.createdAt)}
                            </div>
                          )}
                          <div className="mt-6">
                            {exam.isFree ? (
                              <Link
                                href={`/exams/${exam.id}/take`}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                無料で受験する
                              </Link>
                            ) : (
                              <Link
                                href={`/exams/${exam.id}/purchase`}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                模試を購入
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
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