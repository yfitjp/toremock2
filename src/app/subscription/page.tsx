'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { SUBSCRIPTION_PLANS, createCheckoutSession } from '@/app/lib/subscriptions';
import { hasActiveSubscription } from '@/app/lib/subscriptions';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

// Stripeの公開キーを設定
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [checkingSubscription, setCheckingSubscription] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        try {
          console.log('SubscriptionPage: サブスクリプションチェック開始 - ユーザーID:', user.uid);
          const hasSubscription = await hasActiveSubscription(user.uid);
          console.log('SubscriptionPage: サブスクリプション状態:', hasSubscription);
          setHasSubscription(hasSubscription);
          setCheckingSubscription(false);
        } catch (error) {
          console.error('サブスクリプション確認エラー:', error);
          setHasSubscription(false);
          setCheckingSubscription(false);
        }
      } else if (!loading) {
        console.log('SubscriptionPage: ユーザーがログインしていません');
        setHasSubscription(false);
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [user, loading]);

  const handleSubscribe = async () => {
    if (!user) return;
    
    try {
      setIsProcessing(true);
      
      // チェックアウトセッションを作成
      const sessionId = await createCheckoutSession(
        user.uid,
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!
      );

      // Stripeのチェックアウトページにリダイレクト
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });
        if (error) {
          console.error('Stripe redirect error:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('サブスクリプションの処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || checkingSubscription) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              サブスクリプションプラン
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              サブスクリプションを購入するにはログインが必要です。
            </p>
            <div className="mt-8">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            サブスクリプションプラン
          </h1>
          {hasSubscription ? (
            <p className="mt-4 text-lg text-green-600">
              現在プレミアムプランをご利用中です。すべての模試にアクセスできます。
            </p>
          ) : (
            <p className="mt-4 text-lg text-gray-500">
              プレミアムプランに登録して、すべての模試にアクセスしましょう。
            </p>
          )}
        </div>

        {hasSubscription ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-green-800">
                  {SUBSCRIPTION_PLANS.PREMIUM.name}
                </h2>
                <p className="mt-1 text-green-600">
                  現在アクティブなサブスクリプション
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white border border-gray-200 rounded-lg p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {SUBSCRIPTION_PLANS.PREMIUM.name}
                </h2>
                <p className="mt-1 text-gray-500">
                  月額 {SUBSCRIPTION_PLANS.PREMIUM.price}円
                </p>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? '処理中...' : 'プランに登録する'}
              </button>
            </div>
            <ul className="mt-6 space-y-4">
              {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
} 