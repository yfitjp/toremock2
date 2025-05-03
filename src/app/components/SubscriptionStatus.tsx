'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { Subscription } from '@/app/lib/subscriptions';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/subscription/status', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          setError(`サブスクリプション情報の取得に失敗しました (${response.status})`);
          setSubscription(null);
        } else {
          const sub = await response.json();
          setSubscription(sub);
        }
      } catch (error: any) {
        console.error('Error fetching subscription via API:', error);
        setError('サブスクリプション情報の取得中に予期せぬエラーが発生しました');
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return <div className="text-gray-600">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              プレミアム会員ではありません
            </p>
            <p className="mt-2 text-sm text-yellow-700">
              <a href="/subscription" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                プレミアム会員になる
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            プレミアム会員
          </p>
          <div className="mt-2 text-sm text-green-700">
            <p>プラン: {subscription.plan}</p>
            <p>ステータス: {subscription.status}</p>
            <p>次回更新日: {format(new Date(subscription.currentPeriodEnd * 1000), 'yyyy年MM月dd日', { locale: ja })}</p>
            {subscription.cancelAtPeriodEnd && (
              <p className="text-yellow-700">※次回更新時に解約されます</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 