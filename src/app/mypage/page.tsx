'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import PurchaseHistory from '@/app/components/PurchaseHistory';
import SubscriptionStatus from '@/app/components/SubscriptionStatus';
import SubscriptionManagement from '@/app/components/SubscriptionManagement';
import SubscriptionDebugTools from '@/app/components/SubscriptionDebugTools';

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.displayName || user.email?.split('@')[0] || 'ユーザー';

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">マイページ</h1>
        <p className="text-lg text-gray-600">ようこそ、{userName}さん！</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">アカウント情報</h2>
          <div className="space-y-3">
            <p>
              <span className="font-medium text-gray-600">メールアドレス:</span>
              <br />
              <span className="text-gray-800 break-all">{user.email}</span>
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">サブスクリプション</h2>
          <div className="space-y-6">
            <SubscriptionStatus />
            <SubscriptionManagement />
            {process.env.NODE_ENV === 'development' && <SubscriptionDebugTools />}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3 bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">購入履歴</h2>
          <PurchaseHistory />
        </motion.section>
      </div>
    </div>
  );
} 