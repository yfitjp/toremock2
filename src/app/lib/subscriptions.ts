import * as admin from 'firebase-admin';
import { db } from '@/app/lib/firebase-admin';
import { db as clientDb } from './firebase';
import {
  COLLECTIONS,
  queryDocuments,
  addDocument
} from './firestore';
import { doc, getDoc } from 'firebase/firestore';
import Stripe from 'stripe';

// サーバーサイドでのみStripeを初期化
const stripe = typeof window === 'undefined' ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
}) : null;

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
  FREE: {
    name: 'Free',
    price: 0,
    description: '無料で基本的な模試にアクセスできます。有料模試は個別に購入が必要です。',
    features: [
      '無料模試へのアクセス',
      '各模試の詳細な解説',
      'スコア分析と学習アドバイス',
      '有料模試は個別購入（￥290～/模試）',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    price: 1490,
    description: 'すべての模試にアクセスでき、詳細な解説や学習分析機能が利用できます。',
    features: [
      'すべての模試へのアクセス',
      '各模試の詳細な解説',
      'スコア分析と学習アドバイス',
    ],
  },
  ELITE: {
    name: 'Elite',
    price: 5490,
    description: '最高レベルの学習体験を提供する特別なプランです。',
    features: [
      'プレミアムプランのすべての機能',
      'ネイティブ講師によるレッスン',
      '模試の復習に便利な単語帳機能',
      '専門家による専用カリキュラムの作成',
    ],
    availabilityStatus: '受付停止中',
  },
};

// サブスクリプションを作成または更新
export const createOrUpdateSubscription = async (
  subscriptionId: string,
  data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt' | 'endDate'> & { endDate?: Date | admin.firestore.Timestamp }
): Promise<void> => {
  try {
    const subRef = db.collection('subscriptions').doc(subscriptionId);
    const subDoc = await subRef.get();

    const dataToSave: any = { ...data };
    if (data.startDate instanceof Date) {
        dataToSave.startDate = admin.firestore.Timestamp.fromDate(data.startDate);
    }
    if (data.endDate instanceof Date) {
        dataToSave.endDate = admin.firestore.Timestamp.fromDate(data.endDate);
    }

    if (subDoc.exists) {
      await subRef.update({
        ...dataToSave,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Subscription ${subscriptionId} updated with Admin SDK.`);
    } else {
      await subRef.set({
        ...dataToSave,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`Subscription ${subscriptionId} created with Admin SDK.`);
    }
  } catch (error) {
    console.error(`Error creating/updating subscription ${subscriptionId} with Admin SDK:`, error);
    throw error;
  }
};

// サブスクリプションを更新
export const updateSubscription = async (
  subscriptionId: string,
  data: Partial<Subscription>
): Promise<void> => {
  try {
    const subRef = db.collection('subscriptions').doc(subscriptionId);
    await subRef.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// 特定のサブスクリプションを取得
export const getSubscription = async (subscriptionId: string): Promise<Subscription | null> => {
  try {
    const subRef = db.collection('subscriptions').doc(subscriptionId);
    const docSnap = await subRef.get();
    if (!docSnap.exists) {
      return null;
    }
    const data = docSnap.data() as any;
    if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
    if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate();
    if (data.startDate?.toDate) data.startDate = data.startDate.toDate();
    if (data.endDate?.toDate) data.endDate = data.endDate.toDate();
    return { id: docSnap.id, ...data } as Subscription;
  } catch (error) {
    console.error(`Error getting subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// ユーザーのアクティブなサブスクリプションを取得
export const getUserActiveSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    const q = db.collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(1);

    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data() as any;
    if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
    if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate();
    if (data.startDate?.toDate) data.startDate = data.startDate.toDate();
    if (data.endDate?.toDate) data.endDate = data.endDate.toDate();
    return { id: docSnap.id, ...data } as Subscription;
  } catch (error) {
    console.error('Error getting user subscription with Admin SDK:', error);
    return null;
  }
};

// サブスクリプションの状態を確認
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(clientDb, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    return userData?.subscriptions?.premium?.status === 'active';
  } catch (error) {
    console.error('サブスクリプション状態確認エラー:', error);
    return false;
  }
};

// サブスクリプションをキャンセル
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const subRef = db.collection('subscriptions').doc(subscriptionId);
    await subRef.update({
      status: 'canceled',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error(`Error canceling subscription ${subscriptionId}:`, error);
    throw error;
  }
};

export const isUserSubscribed = async (userId: string): Promise<boolean> => {
  return await hasActiveSubscription(userId);
};

// 支払いインテントを作成する関数
export async function createPaymentIntent(userId: string, priceId: string) {
  if (!stripe) throw new Error('Stripeが初期化されていません');

  try {
    console.log(`支払いインテント作成開始: userId=${userId}, priceId=${priceId}`);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: SUBSCRIPTION_PLANS.PREMIUM.price,
      currency: 'jpy',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        priceId,
        type: 'subscription'
      },
    });

    console.log(`支払いインテント作成成功: ${paymentIntent.id}, metadata:`, paymentIntent.metadata);
    return paymentIntent.client_secret;
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw error;
  }
}

// チェックアウトセッションを作成する関数
export async function createCheckoutSession(userId: string, priceId: string) {
  if (!stripe) throw new Error('Stripeが初期化されていません');

  try {
    const clientSecret = await createPaymentIntent(userId, priceId);
    return clientSecret;
  } catch (error) {
    console.error('Checkout session creation error:', error);
    throw error;
  }
} 