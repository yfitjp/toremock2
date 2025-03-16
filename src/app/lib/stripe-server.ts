import Stripe from 'stripe';
import { stripeConfig } from './stripe-server-config';

if (typeof window !== 'undefined') {
  throw new Error('このモジュールはサーバーサイドでのみ使用できます');
}

if (!stripeConfig) {
  throw new Error('Stripe設定が見つかりません');
}

// サーバーサイドでのStripeインスタンスを作成
export const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: stripeConfig.apiVersion,
  typescript: stripeConfig.typescript,
}); 