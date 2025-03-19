'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { SUBSCRIPTION_PLANS } from '@/app/lib/subscriptions';
import { hasActiveSubscription } from '@/app/lib/subscriptions';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [checkingSubscription, setCheckingSubscription] = useState<boolean>(true);

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

  if (loading || checkingSubscription) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              サブスクリプションプラン
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
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
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            サブスクリプションプラン
          </h1>
          {hasSubscription ? (
            <p className="mt-4 text-lg text-green-600 dark:text-green-400">
              現在プレミアムプランをご利用中です。すべての模試にアクセスできます。
            </p>
          ) : (
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              プレミアムプランに登録して、すべての模試にアクセスしましょう。
            </p>
          )}
        </div>

        {hasSubscription ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">現在のプラン: {SUBSCRIPTION_PLANS.PREMIUM.name}</h3>
                <p className="mt-2 text-green-700 dark:text-green-300">
                  次回更新日: {new Date().setMonth(new Date().getMonth() + 1) ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('ja-JP') : '不明'}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                アクティブ
              </span>
            </div>
            <div className="mt-4 border-t border-green-200 dark:border-green-700 pt-4">
              <p className="text-green-700 dark:text-green-300">
                プレミアムプランでは以下の特典をお楽しみいただけます：
              </p>
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
                    <span className="ml-2 text-green-700 dark:text-green-300">{feature}</span>
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
            className="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col"
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">通常プラン</h3>
              <p className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-5xl font-extrabold tracking-tight">¥0</span>
                <span className="ml-1 text-xl font-semibold">/月</span>
              </p>
              <p className="mt-6 text-gray-500 dark:text-gray-400">
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
                  <span className="ml-3 text-gray-500 dark:text-gray-400">無料模試へのアクセス</span>
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
                  <span className="ml-3 text-gray-500 dark:text-gray-400">基本的な解説</span>
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
                  <span className="ml-3 text-gray-500 dark:text-gray-400">有料模試は個別購入（￥490～/模試）</span>
                </li>
              </ul>
            </div>

            <Link
              href="/exams"
              className="mt-8 block w-full bg-gray-100 dark:bg-gray-700 border border-transparent rounded-md py-3 px-6 text-center font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
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
                      className="flex-shrink-0 w-6 h-6 text-white"
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

            <div className="mt-8">
              {!user ? (
                <Link
                  href="/auth/signin"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300"
                >
                  ログインして始める
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              ) : hasSubscription ? (
                <div className="w-full text-center px-6 py-3 border border-white text-white rounded-md bg-blue-700">
                  現在ご利用中です
                </div>
              ) : (
                <Link
                  href="/subscription/checkout"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300"
                >
                  プレミアムを始める
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            ご不明な点がございましたら、<a href="/contact" className="text-blue-600 hover:text-blue-500">サポート</a>までお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
} 