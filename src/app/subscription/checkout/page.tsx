'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { SUBSCRIPTION_PLANS } from '@/app/lib/subscriptions';
import StripePaymentForm from '@/app/components/StripePaymentForm';

// Stripeの初期化
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionCheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ユーザーがログインしていない場合はログインページにリダイレクト
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    const createSubscription = async () => {
      try {
        if (!user) {
          throw new Error('ユーザーがログインしていません');
        }

        const idToken = await user.getIdToken();
        if (!idToken) {
          throw new Error('認証トークンの取得に失敗しました');
        }

        console.log('サブスクリプション作成を開始します');
        const response = await fetch('/api/subscription/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || 'サブスクリプションの作成に失敗しました');
        }

        const data = await response.json();
        console.log('サブスクリプションが作成されました:', data.subscriptionId);
        setClientSecret(data.clientSecret);
        setSubscriptionId(data.subscriptionId);
      } catch (error: any) {
        console.error('サブスクリプション作成エラー:', error);
        setError(error.message || 'サブスクリプションの作成中にエラーが発生しました');
      }
    };

    if (user) {
      createSubscription();
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
              プレミアムプランに登録
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 text-center">
              すべての模試にアクセスして、学習効果を最大化しましょう。
            </p>
            
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {SUBSCRIPTION_PLANS.PREMIUM.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {SUBSCRIPTION_PLANS.PREMIUM.description}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ¥{SUBSCRIPTION_PLANS.PREMIUM.price.toLocaleString()}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/月</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">含まれる機能</h4>
                  <ul className="mt-2 space-y-2">
                    {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {error ? (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm subscriptionId={subscriptionId!} />
                </Elements>
              ) : (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              登録すると、<a href="/terms" className="text-blue-600 hover:text-blue-500">利用規約</a>と
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">プライバシーポリシー</a>に同意したことになります。
              いつでもキャンセル可能です。
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 