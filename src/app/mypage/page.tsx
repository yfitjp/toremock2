'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import PurchaseHistory from '@/app/components/PurchaseHistory';
import SubscriptionStatus from '@/app/components/SubscriptionStatus';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">マイページ</h1>
        
        <div className="grid gap-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">アカウント情報</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">メールアドレス: </span>
                {user.email}
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <SubscriptionStatus />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <PurchaseHistory />
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
} 