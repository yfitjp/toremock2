import { db as clientDb } from './firebase';
import {
  COLLECTIONS,
  queryDocuments,
  addDocument
} from './firestore';
import { doc, getDoc } from 'firebase/firestore';
import Stripe from 'stripe';

// Stripe 初期化はサーバーサイド専用なので、ここからは削除 (必要なら webhook などで使う)
// const stripe = typeof window === 'undefined' ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-02-24.acacia',
// }) : null;

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

// サブスクリプションの状態を確認 (クライアントSDKを使用)
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(clientDb, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    // ★ 注意: このデータ構造 (`userData?.subscriptions?.premium?.status`) が正しいか確認が必要
    // Firestore の users/{userId} ドキュメントに subscriptions.premium.status がある想定
    return userData?.subscriptions?.premium?.status === 'active';
  } catch (error) {
    console.error('サブスクリプション状態確認エラー:', error);
    return false;
  }
};

// isUserSubscribed は hasActiveSubscription を呼んでいるので、クライアントSDK依存
export const isUserSubscribed = async (userId: string): Promise<boolean> => {
  return await hasActiveSubscription(userId);
};

// ▼▼▼ サーバーサイド専用のStripe関数は削除 ▼▼▼
// export async function createPaymentIntent(...) {
// ...
// }
// export async function createCheckoutSession(...) {
// ...
// }
// ▲▲▲ ここまで削除 ▲▲▲ 