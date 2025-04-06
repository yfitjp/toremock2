'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { hasActiveSubscription } from '@/app/lib/subscriptions';

export default function CancelSubscriptionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [checkingSubscription, setCheckingSubscription] = useState<boolean>(true);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    // ユーザーがログインしていない場合はログインページにリダイレクト
    if (!loading && !user) {
      router.push('/auth/signin?callbackUrl=/subscription/cancel');
    }

    // サブスクリプション状態のチェック
    const checkSubscription = async () => {
      if (user) {
        try {
          const hasActiveSubsc = await hasActiveSubscription(user.uid);
          setHasSubscription(hasActiveSubsc);
          setCheckingSubscription(false);
        } catch (error) {
          console.error('サブスクリプション確認エラー:', error);
          setHasSubscription(false);
          setCheckingSubscription(false);
        }
      } else if (!loading) {
        setHasSubscription(false);
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [user, loading, router]);

  // サブスクリプションの解約処理
  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setCancelling(true);
    setMessage(null);
    
    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'サブスクリプションの解約に失敗しました');
      }
      
      setMessage({
        text: data.message || 'サブスクリプションの解約が完了しました。次回の更新日をもって解約となります。',
        type: 'success',
      });
      
      // 5秒後にマイページにリダイレクト
      setTimeout(() => {
        router.push('/mypage');
      }, 5000);
    } catch (error) {
      console.error('サブスクリプション解約エラー:', error);
      setMessage({
        text: error instanceof Error ? error.message : 'サブスクリプションの解約に失敗しました',
        type: 'error',
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading || checkingSubscription) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6">サブスクリプション解約</h1>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-700">
                現在アクティブなサブスクリプションがありません。
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/mypage"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                マイページに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-lg p-8"
        >
          <h1 className="text-2xl font-bold text-center mb-6">サブスクリプション解約</h1>
          
          {message ? (
            <div className={`p-4 rounded-md mb-6 ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              <p>{message.text}</p>
              {message.type === 'success' && (
                <p className="mt-2 text-sm">5秒後にマイページに移動します...</p>
              )}
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      サブスクリプションを解約すると、次回更新日をもってプレミアム機能が利用できなくなります。
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <h2 className="text-lg font-medium text-gray-900">解約による影響</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>すべての模試へのアクセスが制限されます</li>
                  <li>プレミアム特典が利用できなくなります</li>
                  <li>現在の期間終了まではサービスを引き続きご利用いただけます</li>
                  <li>解約後もアカウントとこれまでの学習データは保持されます</li>
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col items-center">
                  <p className="mb-4 text-gray-700">本当にサブスクリプションを解約しますか？</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => router.push('/mypage')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelling}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {cancelling ? '処理中...' : '解約する'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
} 