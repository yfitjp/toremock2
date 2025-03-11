'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
import { useParams } from 'next/navigation';

// Stripeの公開キー（実際の値に置き換える必要があります）
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function PurchasePage() {
  const params = useParams();
  const examId = params.id as string;
  const [exam, setExam] = useState<{ title: string; price: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬的なデータ取得
    // 実際のアプリケーションではAPIからデータを取得します
    setTimeout(() => {
      setExam({
        title: 'TOEIC® L&R 模試 Vol.1',
        price: 2500,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          試験情報の取得に失敗しました。
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">購入手続き</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{exam.title}</h2>
        <p className="text-gray-600 mb-2">価格: {exam.price}円</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">お支払い情報</h2>
        <Elements stripe={stripePromise}>
          <PaymentForm examId={examId} price={exam.price} />
        </Elements>
      </div>
    </div>
  );
} 