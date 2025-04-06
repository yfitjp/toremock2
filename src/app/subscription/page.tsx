'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { SUBSCRIPTION_PLANS } from '@/app/lib/subscriptions';
import { hasActiveSubscription } from '@/app/lib/subscriptions';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { auth } from '@/app/lib/firebase';

// Stripeの公開キーを設定
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// 決済フォームコンポーネント
function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setPaymentMessage('お支払いが完了しました。');
          onSuccess();
          break;
        case 'processing':
          setPaymentMessage('お支払いを処理中です。');
          break;
        case 'requires_payment_method':
          setPaymentMessage('お支払いに失敗しました。再度お試しください。');
          break;
        default:
          setPaymentMessage('エラーが発生しました。');
          break;
      }
    });
  }, [stripe, onSuccess]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js がまだ読み込まれていない場合
      setError('決済処理の準備ができていません。しばらくしてから再度お試しください。');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('決済エラー:', error);
        setError(error.message || '決済処理中にエラーが発生しました。');
      } else {
        // 決済が完了した場合
        console.log('決済が完了しました');
        onSuccess();
      }
    } catch (err) {
      console.error('決済エラー:', err);
      setError('決済処理中にエラーが発生しました。再度お試しください。');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">支払い情報</h3>
        <div className="space-y-4">
          <div>
            <PaymentElement />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {paymentMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
          {paymentMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          (!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {processing ? '処理中...' : '支払いを完了する'}
      </button>
    </form>
  );
}

export default function SubscriptionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [checkingSubscription, setCheckingSubscription] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

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
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
      if (!priceId) {
        throw new Error('Stripeの価格IDが設定されていません');
      }

      console.log('サブスクリプション開始 - ユーザーID:', user.uid);
      console.log('使用する価格ID:', priceId);
      
      // 認証トークンを取得
      const token = await user.getIdToken();
      
      // 支払いインテントを作成
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.uid,
          priceId,
          email: user.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '支払いインテントの作成に失敗しました');
      }

      if (!data.clientSecret) {
        throw new Error('クライアントシークレットが取得できませんでした');
      }

      console.log('クライアントシークレット取得成功');
      setClientSecret(data.clientSecret);
      setPaymentAmount(data.amount || SUBSCRIPTION_PLANS.PREMIUM.price);
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error instanceof Error ? error.message : 'サブスクリプションの処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccess = async () => {
    try {
      if (!auth.currentUser?.uid) {
        console.error('認証されていないユーザー');
        router.push('/subscription/success');
        return;
      }

      // ユーザーのサブスクリプション状態を確認
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // サブスクリプション状態を更新
        await updateDoc(userRef, {
          subscriptions: {
            premium: {
              status: 'active',
              updatedAt: new Date().toISOString(),
            }
          },
          subscriptionStatus: 'active',
          updatedAt: new Date().toISOString(),
        });
        console.log('クライアント側: サブスクリプション状態を更新しました');
      }
    } catch (error) {
      console.error('サブスクリプション状態更新エラー:', error);
    }
    router.push('/subscription/success');
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

        <div className={`mt-12 ${hasSubscription ? 'opacity-60' : ''} space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8`}>
          {/* 通常プラン */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col"
          >
            <div className="flex-1">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                  <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                  <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">無料プラン</h3>
            </div>
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
            className="relative p-8 bg-gradient-to-b from-blue-100 to-blue-200 border border-blue-200 rounded-2xl shadow-md flex flex-col transform"
          >
            <div className="absolute top-0 right-[20px] -translate-y-1/2 translate-x-1/2 bg-yellow-400 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-gray-900 shadow-md z-30">
              人気No.1
            </div>
            <div className="absolute -top-1 -left-1 w-full h-full bg-blue-500 rounded-2xl -z-10 blur-sm opacity-30"></div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900">{SUBSCRIPTION_PLANS.PREMIUM.name}</h3>
              </div>
              <p className="mt-4 flex items-baseline text-blue-900">
                <span className="text-5xl font-extrabold tracking-tight">¥{SUBSCRIPTION_PLANS.PREMIUM.price.toLocaleString()}</span>
                <span className="ml-1 text-xl font-semibold">/月</span>
              </p>
              <div className="mt-1">
                <span className="inline-block bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">エリートプランより67%お得！</span>
              </div>
              <p className="mt-6 text-blue-900">
                {SUBSCRIPTION_PLANS.PREMIUM.description} エリートプランと同様の高品質な学習体験を、よりリーズナブルな価格でご提供します。
              </p>

              <ul role="list" className="mt-6 space-y-4">
                {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-blue-900"
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
                    <span className="ml-3 text-blue-900">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {clientSecret ? (
              <div className="mt-8">
                <Elements stripe={stripePromise} options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#0070f3',
                    },
                  },
                }}>
                  <CheckoutForm onSuccess={handleSuccess} />
                </Elements>
              </div>
            ) : (
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
            )}
          </motion.div>

          {/* エリートプラン */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative p-8 bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 rounded-2xl shadow-md flex flex-col transform"
          >
            <div className="flex-1 relative">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-800">{SUBSCRIPTION_PLANS.ELITE.name}</h3>
                <span className="ml-2 px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-semibold rounded">限定プラン</span>
              </div>
              <p className="mt-4 flex items-baseline text-amber-900">
                <span className="text-5xl font-extrabold tracking-tight">¥{SUBSCRIPTION_PLANS.ELITE.price.toLocaleString()}</span>
                <span className="ml-1 text-xl font-semibold">/月</span>
              </p>
              <p className="mt-6 text-amber-800">
                {SUBSCRIPTION_PLANS.ELITE.description}
              </p>

              <ul role="list" className="mt-6 space-y-4">
                {SUBSCRIPTION_PLANS.ELITE.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-amber-500"
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
                    <span className="ml-3 text-amber-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={true}
              className="mt-8 block w-full px-6 py-3 border border-amber-300 rounded-md shadow-sm text-base font-medium text-center bg-white text-amber-700 opacity-60 cursor-not-allowed"
            >
              ご応募多数につき受付停止中
            </button>
            <p className="mt-2 text-xs text-amber-600 text-center">※エリートプランは定員に達したため現在新規受付を停止しております。再開をお待ちの方は、まずはプレミアムプランをお試しください。</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 