import { db as clientDb } from './firebase';
import {
  COLLECTIONS,
  queryDocuments,
  addDocument
} from './firestore';
import { doc, getDoc } from 'firebase/firestore';
import Stripe from 'stripe';
import {
  collection,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';

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

// サブスクリプションの状態を確認 (クライアントSDKを使用 - 修正版)
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  if (!userId) {
    console.log('userId is missing, cannot check subscription.');
    return false;
  }

  try {
    // subscriptions コレクションへの参照を取得
    const subscriptionsRef = collection(clientDb, 'subscriptions');

    // クエリを作成: userId が一致し、status が 'active' のドキュメントを検索
    // 注意: 'trialing' など、他のアクティブとみなすステータスがあれば、それらも考慮に入れる必要があるかもしれません
    // 例: where('status', 'in', ['active', 'trialing'])
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      where('status', '==', 'active'), // 'active' 以外のアクティブステータスも考慮する場合は変更
      limit(1) // 1つ見つかれば十分なので効率化
    );

    // クエリを実行
    const querySnapshot = await getDocs(q);

    // 条件に合致するドキュメントが存在するかどうかを返す
    return !querySnapshot.empty; // empty でなければ true (アクティブなサブスクリプションあり)

  } catch (error) {
    console.error('サブスクリプション状態確認エラー:', error);
    // エラー発生時は安全のため false を返す
    return false;
  }
};

// isUserSubscribed は hasActiveSubscription を呼んでいるので、クライアントSDK依存
export const isUserSubscribed = async (userId: string): Promise<boolean> => {
  return await hasActiveSubscription(userId);
};