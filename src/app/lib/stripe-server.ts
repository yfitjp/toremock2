import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

// Stripeの設定
const config = {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
} as const;

// Stripeインスタンスの作成
// @ts-ignore - APIバージョンの型定義の制約を一時的に無視
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, config); 