'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { Subscription } from '@/app/lib/subscriptions';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';

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
    return <div className="text-gray-600 animate-pulse">ステータスを読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">エラー</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-gray-700">
              現在、無料プランをご利用中です。
            </p>
            <p className="mt-3 text-sm md:ml-6 md:mt-0">
              <a
                href="/subscription"
                className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
              >
                プレミアムプランを見る
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-green-50 p-4 border border-green-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            プレミアムプランをご利用中です
          </h3>
          <div className="mt-2 text-sm text-green-700 space-y-1">
            <p><span className="font-semibold">プラン:</span> {typeof subscription.plan === 'string' ? subscription.plan : (subscription.plan as any)?.name || '詳細不明'}</p>
            <p><span className="font-semibold">ステータス:</span> {subscription.status === 'active' ? '有効' : subscription.status}</p>
            <p>
              <span className="font-semibold">次回更新日:</span>{' '}
              {format(new Date(subscription.currentPeriodEnd * 1000), 'yyyy年MM月dd日', { locale: ja })}
            </p>
            {subscription.cancelAtPeriodEnd && (
              <p className="font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded inline-block">
                ※次回更新日に解約予定
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 