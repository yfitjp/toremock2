import Stripe from 'stripe';

// サーバーサイドでのみ実行
const getStripeConfig = () => {
  if (typeof window !== 'undefined') {
    return null;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }

  return {
    secretKey: process.env.STRIPE_SECRET_KEY,
    apiVersion: '2025-02-24.acacia' as const,
    typescript: true,
  };
};

export const stripeConfig = getStripeConfig(); 