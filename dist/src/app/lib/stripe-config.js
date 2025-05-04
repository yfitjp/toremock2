"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_EVENTS = exports.SUBSCRIPTION_CONFIG = exports.STRIPE_PREMIUM_PRICE_ID = void 0;
exports.STRIPE_PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID;
// サブスクリプションの設定
exports.SUBSCRIPTION_CONFIG = {
    retryRules: {
        maxAttempts: 3,
        retryIntervals: [3, 5, 7], // days
    },
    cancelAtPeriodEnd: true, // 期間終了時にキャンセル
};
// Stripeのイベントタイプ
exports.STRIPE_EVENTS = {
    SUBSCRIPTION_CREATED: 'customer.subscription.created',
    SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
    SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
    PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
    PAYMENT_FAILED: 'invoice.payment_failed',
};
