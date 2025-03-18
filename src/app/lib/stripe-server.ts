import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // 型定義の制約により、一時的にこのバージョンを使用
  typescript: true,
});

// APIバージョンの型定義を拡張
declare module 'stripe' {
  namespace Stripe {
    interface StripeConfig {
      apiVersion: '2023-10-16' | '2023-12-14' | '2024-01-01' | '2025-02-24.acacia';
    }
  }
} 