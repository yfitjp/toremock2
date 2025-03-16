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
    apiVersion: '2023-10-16' as const,
    typescript: true as const,
  };
};

export const stripeConfig = getStripeConfig(); 