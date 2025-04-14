'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getAllExams, Exam, getExamsByType } from '@/app/lib/exams';
import { formatTimestamp } from '@/app/lib/firestore';
import { useAuth } from '@/app/hooks/useAuth';
import { hasActiveSubscription } from '@/app/lib/subscriptions';
import { checkExamPurchase } from '@/app/lib/purchases';
import PurchaseButton from '@/app/components/PurchaseButton';

// 試験タイプのリスト
const EXAM_TYPES = ['TOEIC', 'TOEFL', 'EIKEN'];

// 試験タイプに応じたアイコンの設定（色は統一）
const TYPE_STYLES = {
  'TOEIC': {
    color: 'gray',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
      </svg>
    ),
    bgGradient: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
    header: 'bg-gray-700'
  },
  'TOEFL': {
    color: 'gray',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
      </svg>
    ),
    bgGradient: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
    header: 'bg-gray-700'
  },
  'EIKEN': {
    color: 'gray',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    bgGradient: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
    header: 'bg-gray-700'
  }
};

export default function ExamsPage() {
  const { user, loading: authLoading } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [purchasedExams, setPurchasedExams] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('all');
  const [examsByType, setExamsByType] = useState<Record<string, Exam[]>>({});

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
          
          // 試験タイプごとに分類
          const typeMap: Record<string, Exam[]> = { 'all': examData };
          EXAM_TYPES.forEach(type => {
            typeMap[type] = examData.filter(exam => exam.type === type);
          });
          setExamsByType(typeMap);
          
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

  const renderExamCard = (exam: Exam) => {
    const typeStyle = TYPE_STYLES[exam.type as keyof typeof TYPE_STYLES] || TYPE_STYLES['TOEIC'];
    
    return (
      <motion.div
        key={exam.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
      >
        <div className="p-2 bg-gray-700 text-white flex items-center">
          <div className="mr-2">
            {typeStyle.icon}
          </div>
          <span className="font-medium">{exam.type}</span>
          {exam.isFree && (
            <span className="ml-auto bg-white text-green-600 text-xs px-2 py-1 rounded-full font-medium">無料</span>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3">{exam.title}</h2>
          <p className="text-gray-600 mb-4 text-sm">{exam.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{exam.duration}分</span>
            </div>
            {!exam.isFree && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>¥{exam.price.toLocaleString()}</span>
              </div>
            )}
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
      </motion.div>
    );
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
      <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            模試一覧
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 max-w-3xl"
          >
            TOEIC®、TOEFL®、英検®など、様々な試験の模擬試験を提供しています。
            模試を通じて自分の弱点を把握し、効率的に学習を進めましょう。
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-4 mb-8 flex overflow-x-auto"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md whitespace-nowrap mr-2 transition-colors ${
              activeTab === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              すべての模試
              <span className="ml-2 bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                {exams.length}
              </span>
            </span>
          </button>
          {EXAM_TYPES.map(type => {
            const style = TYPE_STYLES[type as keyof typeof TYPE_STYLES];
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-4 py-2 rounded-md flex items-center whitespace-nowrap mr-2 transition-colors ${
                  activeTab === type 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{style.icon}</span>
                <span>{type}</span>
                <span className="ml-2 bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                  {examsByType[type]?.length || 0}
                </span>
              </button>
            );
          })}
        </motion.div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {activeTab === 'all' ? (
                <motion.div
                  key="all-exams"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">すべての模試</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {exams.map(renderExamCard)}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeTab}-exams`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold">{activeTab}模試</h2>
                    <span className="ml-3 text-sm text-gray-500">
                      {examsByType[activeTab]?.length || 0}件の模試が見つかりました
                    </span>
                  </div>
                  
                  {examsByType[activeTab]?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {examsByType[activeTab].map(renderExamCard)}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">現在、{activeTab}の模試はありません。</p>
                      <button
                        onClick={() => setActiveTab('all')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        すべての模試を見る
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Premium Plan CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 mb-12 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl shadow-xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white bg-opacity-10 rounded-full filter blur-xl"></div>

          <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-4">
                  <span className="block">全ての模試にアクセスしませんか？</span>
                  <span className="block text-blue-200">Premiumに登録しましょう</span>
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                  プレミアムプランなら、全てのTOEIC®・TOEFL®・英検®模試が受け放題。AIによる詳細分析で弱点を克服し、効率的にスコアアップを目指せます。
              </p>
              <Link
                  href="/subscription"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                  プレミアムプランの詳細を見る
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
} 