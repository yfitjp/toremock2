import Stripe from 'stripe';
import { stripeConfig } from './stripe-server-config';

// サーバーサイドでのみStripeインスタンスを作成
export const stripe = typeof window === 'undefined' && stripeConfig
  ? new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
      typescript: stripeConfig.typescript,
    })
  : null; 