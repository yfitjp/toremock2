"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const stripe_server_1 = require("@/app/lib/stripe-server");
const stripe_config_1 = require("@/app/lib/stripe-config");
const subscriptions_admin_1 = require("@/app/lib/subscriptions-admin");
const purchases_1 = require("@/app/lib/purchases");
const firebase_admin_1 = require("@/app/lib/firebase-admin");
async function POST(req) {
    try {
        const body = await req.text();
        const headersList = await (0, headers_1.headers)();
        const signature = headersList.get('stripe-signature');
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error('STRIPE_WEBHOOK_SECRET is not set');
            return new server_1.NextResponse('Webhook secret is not set', { status: 500 });
        }
        if (!signature) {
            console.error('No signature found in request');
            return new server_1.NextResponse('No signature', { status: 400 });
        }
        if (!stripe_server_1.stripe) {
            console.error('Stripe instance is not initialized');
            return new server_1.NextResponse('Stripe is not initialized', { status: 500 });
        }
        const event = stripe_server_1.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('Processing webhook event:', event.type);
        switch (event.type) {
            case stripe_config_1.STRIPE_EVENTS.SUBSCRIPTION_CREATED:
            case stripe_config_1.STRIPE_EVENTS.SUBSCRIPTION_UPDATED: {
                const subscription = event.data.object;
                const userId = subscription.metadata?.userId;
                if (!userId) {
                    console.error('No userId found in subscription metadata');
                    return new server_1.NextResponse('No userId found', { status: 400 });
                }
                console.log('Creating/Updating subscription:', subscription.id, 'for user:', userId, 'status:', subscription.status);
                await (0, subscriptions_admin_1.createOrUpdateSubscriptionAdmin)(subscription.id, {
                    userId: userId,
                    status: subscription.status,
                    currentPeriodEnd: subscription.current_period_end,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    plan: 'premium',
                    startDate: new Date(subscription.start_date * 1000),
                    endDate: new Date(subscription.current_period_end * 1000),
                });
                break;
            }
            case stripe_config_1.STRIPE_EVENTS.PAYMENT_SUCCEEDED:
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                console.log('Processing payment intent succeeded:', paymentIntent.id);
                const { purchaseId, examId, userId, type } = paymentIntent.metadata;
                // 購入関連のPaymentIntentの場合
                if (type === 'exam_purchase' && examId && userId) {
                    console.log('Processing exam purchase payment:', paymentIntent.id, 'for exam:', examId);
                    // PaymentIntentに関連するpurchaseレコードを検索
                    const purchaseQuery = await firebase_admin_1.db.collection('purchases')
                        .where('paymentIntentId', '==', paymentIntent.id)
                        .get();
                    if (!purchaseQuery.empty) {
                        const purchaseDoc = purchaseQuery.docs[0];
                        console.log('Updating purchase status to completed:', purchaseDoc.id);
                        await purchaseDoc.ref.update({
                            status: 'completed',
                            updatedAt: new Date(),
                        });
                    }
                    else {
                        console.log('No purchase record found for payment intent:', paymentIntent.id);
                    }
                }
                // 従来の処理
                else if (purchaseId) {
                    console.log('Updating purchase status to completed:', purchaseId);
                    await (0, purchases_1.updatePurchaseStatus)(purchaseId, 'completed', paymentIntent.id);
                }
                else {
                    console.log('No purchaseId or exam purchase metadata found in payment intent:', paymentIntent.id);
                }
                break;
            }
            case stripe_config_1.STRIPE_EVENTS.PAYMENT_FAILED: {
                const invoice = event.data.object;
                if (!invoice.subscription) {
                    console.log('No subscription found in invoice');
                    return new server_1.NextResponse('Success', { status: 200 });
                }
                const subscription = await stripe_server_1.stripe.subscriptions.retrieve(invoice.subscription);
                console.log('Payment failed for subscription:', subscription.id);
                await (0, subscriptions_admin_1.createOrUpdateSubscriptionAdmin)(subscription.id, {
                    userId: subscription.metadata?.userId ?? 'unknown_user',
                    status: 'past_due',
                    currentPeriodEnd: subscription.current_period_end,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    plan: 'premium',
                    startDate: new Date(subscription.start_date * 1000),
                    endDate: new Date(subscription.current_period_end * 1000),
                });
                break;
            }
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { userId, examId } = session.metadata;
                // 購入履歴の更新
                const purchaseQuery = await firebase_admin_1.db.collection('purchases')
                    .where('stripeSessionId', '==', session.id)
                    .get();
                if (!purchaseQuery.empty) {
                    const purchaseDoc = purchaseQuery.docs[0];
                    await purchaseDoc.ref.update({
                        status: 'completed',
                        stripePaymentIntentId: session.payment_intent,
                        updatedAt: new Date(),
                    });
                }
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const sessionId = paymentIntent.metadata.sessionId;
                // ★ sessionId が存在する場合のみ購入履歴を検索・更新 ★
                if (sessionId) {
                    console.log(`[Webhook] Processing failed payment for session: ${sessionId}`);
                    // 購入履歴の更新
                    const purchaseQuery = await firebase_admin_1.db.collection('purchases')
                        .where('stripeSessionId', '==', sessionId)
                        .get();
                    if (!purchaseQuery.empty) {
                        const purchaseDoc = purchaseQuery.docs[0];
                        await purchaseDoc.ref.update({
                            status: 'failed',
                            updatedAt: new Date(), // ここも FieldValue.serverTimestamp() の方が良いかも
                        });
                        console.log(`[Webhook] Updated purchase ${purchaseDoc.id} status to failed.`);
                    }
                    else {
                        console.log(`[Webhook] No purchase found for failed payment session: ${sessionId}`);
                    }
                }
                else {
                    // sessionId がない場合 (例: サブスクリプションの自動更新失敗など)
                    console.log('[Webhook] Payment intent failed, but no sessionId found in metadata. Skipping purchase update.', paymentIntent.id);
                    // ここでサブスクリプション自体のステータス更新など、別の処理が必要か検討
                }
                break;
            }
        }
        return new server_1.NextResponse('Success', { status: 200 });
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        return new server_1.NextResponse(error.message, { status: 400 });
    }
}
