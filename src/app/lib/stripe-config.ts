export const STRIPE_PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID;

// サブスクリプションの設定
export const SUBSCRIPTION_CONFIG = {
  retryRules: {
    maxAttempts: 3,
    retryIntervals: [3, 5, 7], // days
  },
  cancelAtPeriodEnd: true, // 期間終了時にキャンセル
};

// Stripeのイベントタイプ
export const STRIPE_EVENTS = {
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  PAYMENT_FAILED: 'invoice.payment_failed',
} as const; 