import {
  COLLECTIONS,
  getDocument,
  setDocument,
  updateDocument,
  queryDocuments,
  addDocument
} from './firestore';
import { where, orderBy, limit } from 'firebase/firestore';
import { auth } from './firebase';

// サブスクリプションの型定義
export interface Subscription {
  id: string;
  userId: string;
  status: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
  plan?: string;
  startDate?: Date;
  endDate?: Date;
}

// サブスクリプションプランの定義
export const SUBSCRIPTION_PLANS = {
  PREMIUM: {
    id: 'premium',
    name: 'プレミアムプラン',
    description: 'すべての模試にアクセス可能',
    price: 1980,
    features: [
      'すべての模試にアクセス可能',
      '新しい模試が追加されたら即時アクセス可能',
      '詳細な解説と学習アドバイス',
      '成績分析と学習進捗の追跡'
    ]
  }
};

// サブスクリプションを作成または更新
export const createOrUpdateSubscription = async (
  subscriptionId: string,
  data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  try {
    const existingSubscription = await getDocument<Subscription>(
      COLLECTIONS.SUBSCRIPTIONS,
      subscriptionId
    );

    if (existingSubscription) {
      // 既存のサブスクリプションを更新
      await updateDocument<Subscription>(COLLECTIONS.SUBSCRIPTIONS, subscriptionId, {
        ...data,
        updatedAt: new Date()
      });
    } else {
      // 新しいサブスクリプションを作成
      await setDocument<Subscription>(
        COLLECTIONS.SUBSCRIPTIONS,
        subscriptionId,
        {
          ...data,
          id: subscriptionId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }
  } catch (error) {
    console.error('Error creating/updating subscription:', error);
    throw error;
  }
};

// サブスクリプションを更新
export const updateSubscription = async (
  subscriptionId: string,
  data: Partial<Subscription>
): Promise<void> => {
  try {
    await updateDocument<Subscription>(COLLECTIONS.SUBSCRIPTIONS, subscriptionId, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Error updating subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// 特定のサブスクリプションを取得
export const getSubscription = async (subscriptionId: string): Promise<Subscription | null> => {
  try {
    return await getDocument<Subscription>(COLLECTIONS.SUBSCRIPTIONS, subscriptionId);
  } catch (error) {
    console.error(`Error getting subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// ユーザーのアクティブなサブスクリプションを取得
export const getUserActiveSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    // ユーザーの最新のサブスクリプションを取得
    const subscriptions = await queryDocuments<Subscription>(
      COLLECTIONS.SUBSCRIPTIONS,
      [
        where('userId', '==', userId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(1)
      ]
    );

    return subscriptions.length > 0 ? subscriptions[0] : null;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
};

// ユーザーがアクティブなサブスクリプションを持っているか確認
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  try {
    console.log('サブスクリプションチェック開始 - ユーザーID:', userId);
    
    const subscription = await getUserActiveSubscription(userId);
    console.log('取得したサブスクリプション:', subscription);
    
    if (!subscription || !subscription.currentPeriodEnd) {
      console.log('サブスクリプションが見つかりません');
      return false;
    }

    const currentDate = new Date();
    const periodEnd = new Date(subscription.currentPeriodEnd * 1000);

    console.log('現在の日時:', currentDate);
    console.log('現在の課金期間終了日:', periodEnd);
    
    const result = periodEnd > currentDate && subscription.status === 'active';
    console.log('サブスクリプション判定結果:', result);
    return result;
  } catch (error) {
    console.error(`Error checking if user ${userId} has active subscription:`, error);
    throw error;
  }
};

// サブスクリプションをキャンセル
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    await updateSubscription(subscriptionId, {
      status: 'canceled',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Error canceling subscription ${subscriptionId}:`, error);
    throw error;
  }
};

export const isUserSubscribed = async (userId: string): Promise<boolean> => {
  return await hasActiveSubscription(userId);
};

// Stripeのチェックアウトセッションを作成
export const createCheckoutSession = async (userId: string, priceId: string): Promise<string> => {
  try {
    // ユーザーの認証トークンを取得
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error('認証トークンが取得できません');
    }

    // APIエンドポイントにリクエストを送信
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'チェックアウトセッションの作成に失敗しました');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}; 