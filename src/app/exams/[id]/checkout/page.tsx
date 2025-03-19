'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import ExamPaymentForm from '@/app/components/ExamPaymentForm';

// Stripeの初期化
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ExamCheckoutPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [examData, setExamData] = useState<{title: string, amount: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ユーザーがログインしていない場合はログインページにリダイレクト
    if (!authLoading && !user) {
      router.push(`/auth/signin?callbackUrl=/exams/${params.id}/checkout`);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        if (!user) {
          throw new Error('ユーザーがログインしていません');
        }

        const idToken = await user.getIdToken();
        if (!idToken) {
          throw new Error('認証トークンの取得に失敗しました');
        }

        console.log('支払い意図の作成を開始します');
        const response = await fetch(`/api/exams/${params.id}/create-payment`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || '支払い情報の作成に失敗しました');
        }

        const data = await response.json();
        console.log('支払い意図が作成されました:', data.paymentIntentId);
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        setExamData({
          title: data.title,
          amount: data.amount
        });
      } catch (error: any) {
        console.error('支払い意図作成エラー:', error);
        setError(error.message || '支払い情報の作成中にエラーが発生しました');
      }
    };

    if (user) {
      createPaymentIntent();
    }
  }, [user, authLoading, router, params.id]);

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
              模試を購入
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 text-center">
              あなたの実力を測定するための模試を購入します。
            </p>

            <div className="mt-8">
              {error ? (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              ) : clientSecret && paymentIntentId && examData ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <ExamPaymentForm 
                    examId={params.id} 
                    paymentIntentId={paymentIntentId} 
                    title={examData.title}
                    amount={examData.amount}
                  />
                </Elements>
              ) : (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              購入すると、<a href="/terms" className="text-blue-600 hover:text-blue-500">利用規約</a>と
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">プライバシーポリシー</a>に同意したことになります。
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 