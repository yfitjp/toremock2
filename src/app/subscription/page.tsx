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
      
      // 環境変数からpriceIdを取得
      const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
      if (!priceId) {
        throw new Error('Stripeの価格IDが設定されていません');
      }

      console.log('サブスクリプション開始 - ユーザーID:', user.uid);
      console.log('使用する価格ID:', priceId);
      
      // チェックアウトセッションを作成
      const sessionId = await createCheckoutSession(
        user.uid,
        priceId
      );

      console.log('セッションID取得成功:', sessionId);

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
      alert(error instanceof Error ? error.message : 'サブスクリプションの処理中にエラーが発生しました。');
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
                <h3 className="text-xl font-semibold text-green-800">現在のプラン: {SUBSCRIPTION_PLANS.PREMIUM.name}</h3>
                <p className="mt-2 text-green-700">
                  次回更新日: {new Date().setMonth(new Date().getMonth() + 1) ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('ja-JP') : '不明'}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                アクティブ
              </span>
            </div>
            <div className="mt-4 border-t border-green-200 pt-4">
              <p className="text-green-700">
                プレミアムプランでは以下の特典をお楽しみいただけます：
              </p>
              <ul className="mt-2 space-y-2">
                {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-green-500"
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
                    <span className="ml-2 text-green-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/exams"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                模試一覧を見る
              </Link>
            </div>
          </motion.div>
        ) : null}

        <div className={`mt-12 ${hasSubscription ? 'opacity-60' : ''} space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8`}>
          {/* 通常プラン */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col"
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">通常プラン</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">¥0</span>
                <span className="ml-1 text-xl font-semibold">/月</span>
              </p>
              <p className="mt-6 text-gray-500">
                無料で基本的な模試にアクセスできます。有料模試は個別に購入が必要です。
              </p>

              <ul role="list" className="mt-6 space-y-6">
                <li className="flex">
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-3 text-gray-500">無料模試へのアクセス</span>
                </li>
                <li className="flex">
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-3 text-gray-500">基本的な解説</span>
                </li>
                <li className="flex">
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-3 text-gray-500">有料模試は個別購入（￥490～/模試）</span>
                </li>
              </ul>
            </div>

            <Link
              href="/exams"
              className="mt-8 block w-full bg-gray-100 border border-transparent rounded-md py-3 px-6 text-center font-medium text-gray-900 hover:bg-gray-200"
            >
              模試一覧を見る
            </Link>
          </motion.div>

          {/* プレミアムプラン */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-8 bg-blue-600 rounded-2xl shadow-sm flex flex-col"
          >
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-yellow-400 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gray-900">
              おすすめ
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">{SUBSCRIPTION_PLANS.PREMIUM.name}</h3>
              <p className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">¥{SUBSCRIPTION_PLANS.PREMIUM.price.toLocaleString()}</span>
                <span className="ml-1 text-xl font-semibold">/月</span>
              </p>
              <p className="mt-6 text-blue-100">{SUBSCRIPTION_PLANS.PREMIUM.description}</p>

              <ul role="list" className="mt-6 space-y-6">
                {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-blue-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-blue-100">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isProcessing || hasSubscription}
              className={`mt-8 block w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-center transition-all duration-300 ${
                hasSubscription
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? '処理中...' : hasSubscription ? "すでに登録済み" : "プランに登録する"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 