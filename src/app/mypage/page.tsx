'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import PurchaseHistory from '@/app/components/PurchaseHistory';
import SubscriptionStatus from '@/app/components/SubscriptionStatus';
import SubscriptionManagement from '@/app/components/SubscriptionManagement';
import SubscriptionDebugTools from '@/app/components/SubscriptionDebugTools';
import { User, Bell, Lock, CreditCard, HelpCircle, LogOut, Settings, Heart, ClipboardList, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function MyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?callbackUrl=/mypage');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.displayName || user.email?.split('@')[0] || 'ユーザー';

  // ダミーデータ
  const dummyExamHistory = [
    { id: 1, name: "TOEIC® L&R TEST 模試 Vol.3", date: "2024年5月15日", score: "850 / 990", link: "/results/1" },
    { id: 2, name: "英検®準1級 模試パック 第2回", date: "2024年4月28日", score: "合格", link: "/results/2" },
    { id: 3, name: "TOEFL iBT® 実践模試 B", date: "2024年4月10日", score: "95 / 120", link: "/results/3" },
  ];

  const dummyFavoriteExams = [
    { id: 1, name: "TOEIC® L&R TEST 模試 Vol.4", link: "/exams/toeic/vol4" },
    { id: 2, name: "英検®1級 模試パック 第1回", link: "/exams/eiken/1-1" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-12">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-2"
          >
            マイページ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 text-lg"
          >
            ようこそ、{userName}さん！ アカウント情報や設定、学習履歴をご確認いただけます。
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              アカウント情報
            </h2>
            <div className="space-y-3 mb-6">
              <p>
                <span className="font-medium text-gray-500 text-sm">お名前:</span>
                <br />
                <span className="text-gray-800">{userName}</span>
              </p>
              <p>
                <span className="font-medium text-gray-500 text-sm">メールアドレス:</span>
                <br />
                <span className="text-gray-800 break-all">{user.email}</span>
              </p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100">
              <h3 className="text-base font-medium text-gray-700 mb-2">サブスクリプション状態</h3>
              <SubscriptionStatus />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-500" />
              設定
            </h2>
            <div className="space-y-4">
              <Link href="#" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out">
                <User className="flex-shrink-0 h-6 w-6 text-blue-600" />
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">プロフィール編集</p>
                  <p className="mt-1 text-sm text-gray-500">表示名やアバターを変更します。</p>
                </div>
              </Link>
              <Link href="#" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out">
                <Bell className="flex-shrink-0 h-6 w-6 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">通知設定</p>
                  <p className="mt-1 text-sm text-gray-500">メール通知のオン/オフを設定します。</p>
                </div>
              </Link>
              <Link href="#" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out">
                <Lock className="flex-shrink-0 h-6 w-6 text-red-500" />
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">パスワード変更</p>
                  <p className="mt-1 text-sm text-gray-500">セキュリティのため定期的に変更してください。</p>
                </div>
              </Link>
              <div className="pt-4 border-t border-gray-100">
                 <h3 className="text-base font-medium text-gray-900 mb-2 flex items-center">
                   <CreditCard className="flex-shrink-0 h-5 w-5 text-green-500 mr-2" />
                   サブスクリプション管理
                 </h3>
                 <SubscriptionManagement />
                 {process.env.NODE_ENV === 'development' && (
                   <div className="mt-4">
                     <SubscriptionDebugTools />
                   </div>
                 )}
              </div>
              <Link href="#" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out">
                <HelpCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">ヘルプ & サポート</p>
                </div>
              </Link>
              <Link href="/auth/signout" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out">
                <LogOut className="flex-shrink-0 h-6 w-6 text-gray-400" />
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">ログアウト</p>
                </div>
              </Link>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pink-500" />
              お気に入り模試
            </h2>
            <div className="space-y-3">
              {dummyFavoriteExams.length > 0 ? (
                dummyFavoriteExams.map(exam => (
                  <div key={exam.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <span className="text-sm text-gray-700 truncate pr-2">{exam.name}</span>
                    <Link href={exam.link} className="text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap">
                      模試を見る
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">お気に入りの模試はありません。</p>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-indigo-500" />
              受験履歴
            </h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {dummyExamHistory.length > 0 ? (
                dummyExamHistory.map(exam => (
                  <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out border-b last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                      <p className="text-xs text-gray-500">{exam.date} - スコア: {exam.score}</p>
                    </div>
                    <Link href={exam.link} className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap">
                      詳細を見る
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">受験履歴はありません。</p>
              )}
            </div>
            {dummyExamHistory.length > 3 && (
              <div className="mt-4 text-center">
                <Link href="/history/exams" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  全ての受験履歴を見る →
                </Link>
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-purple-500" />
              購入履歴
            </h2>
            <PurchaseHistory />
          </motion.section>

        </div>
      </div>
    </div>
  );
} 