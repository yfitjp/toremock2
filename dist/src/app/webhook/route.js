"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const stripe_1 = __importDefault(require("stripe"));
const subscription_update_1 = require("@/app/lib/server/subscription-update");
// stripeインスタンス初期化時のエラーチェック
const initStripe = () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEYが設定されていません');
    }
    return new stripe_1.default(secretKey, {
        apiVersion: '2025-02-24.acacia',
    });
};
// エラーハンドリング付きでStripeインスタンスを作成
let stripe;
try {
    stripe = initStripe();
}
catch (error) {
    console.error('Stripe初期化エラー:', error);
}
// Webhookシークレットのチェック
const getWebhookSecret = () => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
        throw new Error('STRIPE_WEBHOOK_SECRETが設定されていません');
    }
    return secret;
};
async function POST(request) {
    console.log('📣 [Webhook] リクエスト受信: ' + new Date().toISOString());
    console.log('📣 [Webhook] リクエストパス: ' + request.url);
    console.log('📣 [Webhook] リクエストメソッド: ' + request.method);
    // リクエストヘッダーのログ出力
    const headersLog = {};
    request.headers.forEach((value, key) => {
        headersLog[key] = value;
    });
    console.log('📣 [Webhook] リクエストヘッダー:', JSON.stringify(headersLog, null, 2));
    try {
        // Stripe初期化チェック
        if (!stripe) {
            console.error('⛔ [Webhook] Stripeが初期化されていません');
            return server_1.NextResponse.json({ error: 'Stripe APIが初期化されていません' }, { status: 500 });
        }
        // Webhookシークレットチェック
        let webhookSecret;
        try {
            webhookSecret = getWebhookSecret();
            console.log('✅ [Webhook] STRIPE_WEBHOOK_SECRET: 設定済み');
        }
        catch (error) {
            console.error('⛔ [Webhook] STRIPE_WEBHOOK_SECRETが設定されていません');
            return server_1.NextResponse.json({ error: 'Webhook設定エラー' }, { status: 500 });
        }
        // リクエストボディとシグネチャを取得
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');
        if (!signature) {
            console.error('⛔ [Webhook] Stripe署名がありません');
            return server_1.NextResponse.json({ error: 'Stripe署名が見つかりません' }, { status: 400 });
        }
        // イベント検証
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
            console.log(`✅ [Webhook] イベント検証成功: ${event.type} (ID: ${event.id})`);
        }
        catch (err) {
            console.error('⛔ [Webhook] 署名検証エラー:', err);
            return server_1.NextResponse.json({ error: 'Webhook署名の検証に失敗しました' }, { status: 400 });
        }
        // イベント詳細をログ出力
        console.log(`📋 [Webhook] イベント情報:`, {
            id: event.id,
            type: event.type,
            created: new Date(event.created * 1000).toISOString(),
            livemode: event.livemode ? 'プロダクション' : 'テスト',
        });
        // イベントタイプに応じた処理
        switch (event.type) {
            // 支払い成功イベント
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                let userId = paymentIntent.metadata?.userId;
                const email = paymentIntent.metadata?.email || paymentIntent.receipt_email;
                const type = paymentIntent.metadata?.type;
                const plan = paymentIntent.metadata?.plan;
                console.log(`💰 [Webhook] 支払い成功:`, {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount,
                    userId: userId || 'メタデータに無し',
                    email,
                    type,
                    plan,
                    created: new Date(paymentIntent.created * 1000).toISOString(),
                });
                if (type === 'subscription' && userId) {
                    console.log(`🔄 [Webhook] サブスクリプション更新開始: ${userId} (${email || '不明'})`);
                    try {
                        const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, 'active');
                        console.log(`✅ [Webhook] サブスクリプション更新完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
                    }
                    catch (error) {
                        console.error(`❌ [Webhook] サブスクリプション更新エラー: ${userId}`, error);
                        // エラーを返さず処理を続行（再試行のため）
                    }
                }
                else {
                    console.log(`ℹ️ [Webhook] 対象外の支払い: type=${type}, userId=${userId || 'なし'}, email=${email || 'なし'}`);
                }
                break;
            }
            // チェックアウト完了イベント
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('[Webhook] checkout.session.completed: セッション情報:', {
                    id: session.id,
                    metadata: session.metadata,
                    customer: session.customer,
                    customer_email: session.customer_email,
                });
                let userId = session.metadata?.userId;
                const email = session.metadata?.email || session.customer_email;
                const customerId = session.customer;
                console.log(`🛒 [Webhook] チェックアウト完了:`, {
                    id: session.id,
                    userIdFromSessionMeta: userId || '無し',
                    email,
                    customerId,
                });
                try {
                    // ユーザーIDがメタデータに存在しない場合、顧客情報から取得を試みる
                    if (!userId && customerId) {
                        console.log(`🔍 [Webhook] セッションメタデータにユーザーIDがないため顧客情報から取得を試みます - 顧客ID: ${customerId}`);
                        try {
                            const customer = await stripe.customers.retrieve(customerId);
                            console.log('[Webhook] checkout.session.completed: 取得した顧客情報:', {
                                id: customer.id,
                                metadata: customer.metadata,
                                email: customer.email,
                            });
                            userId = customer.metadata?.userId;
                            if (userId) {
                                console.log(`✅ [Webhook] 顧客情報からユーザーIDを取得: ${userId}`);
                            }
                            else {
                                console.warn(`⚠️ [Webhook] 顧客情報からもユーザーIDを取得できませんでした - 顧客ID: ${customerId}`);
                            }
                        }
                        catch (customerError) {
                            console.error(`❌ [Webhook] 顧客情報取得エラー - 顧客ID: ${customerId}`, customerError);
                        }
                    }
                    if (userId) {
                        console.log(`🔄 [Webhook] セッション完了によるサブスクリプション更新: ${userId} (${email || '不明'})`);
                        try {
                            const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, 'active');
                            console.log(`✅ [Webhook] セッション経由のサブスクリプション更新完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
                        }
                        catch (updateError) {
                            console.error(`❌ [Webhook] セッション経由のサブスクリプション更新エラー: ${userId}`, updateError);
                        }
                    }
                    else {
                        console.error(`❌ [Webhook] ユーザーIDが取得できないため更新をスキップ - セッションID: ${session.id}`);
                    }
                }
                catch (error) {
                    console.error(`❌ [Webhook] セッション処理中の予期しないエラー:`, error);
                }
                break;
            }
            // サブスクリプション作成イベント
            case 'customer.subscription.created': {
                const subscription = event.data.object;
                console.log('[Webhook] customer.subscription.created: サブスクリプション情報:', {
                    id: subscription.id,
                    metadata: subscription.metadata,
                    customer: subscription.customer,
                    status: subscription.status,
                });
                let userId = subscription.metadata?.userId;
                const customerId = subscription.customer;
                console.log(`🆕 [Webhook] サブスクリプション作成:`, {
                    id: subscription.id,
                    customer: customerId,
                    userIdFromSubMeta: userId || '無し',
                    status: subscription.status,
                });
                try {
                    // サブスクリプションのメタデータにユーザーIDがなければ顧客情報から取得
                    if (!userId && customerId) {
                        console.log(`🔍 [Webhook] サブスクリプションメタデータにユーザーIDがないため顧客情報から取得を試みます - 顧客ID: ${customerId}`);
                        try {
                            const customer = await stripe.customers.retrieve(customerId);
                            console.log('[Webhook] customer.subscription.created: 取得した顧客情報:', {
                                id: customer.id,
                                metadata: customer.metadata,
                                email: customer.email,
                            });
                            userId = customer.metadata?.userId;
                            if (userId) {
                                console.log(`✅ [Webhook] 顧客情報からユーザーIDを取得: ${userId}`);
                            }
                            else {
                                console.warn(`⚠️ [Webhook] 顧客情報からもユーザーIDを取得できませんでした - 顧客ID: ${customerId}`);
                            }
                        }
                        catch (customerError) {
                            console.error(`❌ [Webhook] 顧客情報取得エラー - 顧客ID: ${customerId}`, customerError);
                        }
                    }
                    if (userId) {
                        console.log(`🔄 [Webhook] サブスクリプション作成によるユーザー更新: ${userId}`);
                        try {
                            const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, 'active');
                            console.log(`✅ [Webhook] サブスクリプション作成の更新完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
                        }
                        catch (updateError) {
                            console.error(`❌ [Webhook] サブスクリプション作成の更新エラー: ${userId}`, updateError);
                        }
                    }
                    else {
                        console.error(`❌ [Webhook] ユーザーIDが取得できないため更新をスキップ - サブスクリプションID: ${subscription.id}`);
                    }
                }
                catch (error) {
                    console.error(`❌ [Webhook] サブスクリプション作成の処理エラー:`, error);
                }
                break;
            }
            // サブスクリプション更新イベント
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                console.log('[Webhook] customer.subscription.updated: サブスクリプション情報:', {
                    id: subscription.id,
                    metadata: subscription.metadata,
                    customer: subscription.customer,
                    status: subscription.status,
                });
                let userId = subscription.metadata?.userId;
                const customerId = subscription.customer;
                const status = subscription.status;
                console.log(`🔄 [Webhook] サブスクリプション更新:`, {
                    id: subscription.id,
                    customer: customerId,
                    userIdFromSubMeta: userId || '無し',
                    status: status,
                });
                try {
                    // サブスクリプションのメタデータにユーザーIDがなければ顧客情報から取得
                    if (!userId && customerId) {
                        console.log(`🔍 [Webhook] サブスクリプションメタデータにユーザーIDがないため顧客情報から取得を試みます - 顧客ID: ${customerId}`);
                        try {
                            const customer = await stripe.customers.retrieve(customerId);
                            console.log('[Webhook] customer.subscription.updated: 取得した顧客情報:', {
                                id: customer.id,
                                metadata: customer.metadata,
                                email: customer.email,
                            });
                            userId = customer.metadata?.userId;
                            if (userId) {
                                console.log(`✅ [Webhook] 顧客情報からユーザーIDを取得: ${userId}`);
                            }
                            else {
                                console.warn(`⚠️ [Webhook] 顧客情報からもユーザーIDを取得できませんでした - 顧客ID: ${customerId}`);
                            }
                        }
                        catch (customerError) {
                            console.error(`❌ [Webhook] 顧客情報取得エラー - 顧客ID: ${customerId}`, customerError);
                        }
                    }
                    if (userId) {
                        const newStatus = (status === 'active' || status === 'trialing')
                            ? 'active'
                            : (status === 'canceled' || status === 'unpaid' || status === 'past_due')
                                ? status
                                : 'canceled';
                        console.log(`🔄 [Webhook] サブスクリプション更新によるステータス変更: ${userId}, 新ステータス: ${newStatus}`);
                        try {
                            const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, newStatus);
                            console.log(`✅ [Webhook] サブスクリプション更新の処理完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
                        }
                        catch (updateError) {
                            console.error(`❌ [Webhook] サブスクリプション更新の処理エラー: ${userId}`, updateError);
                        }
                    }
                    else {
                        console.error(`❌ [Webhook] ユーザーIDが取得できないため更新をスキップ - サブスクリプションID: ${subscription.id}`);
                    }
                }
                catch (error) {
                    console.error(`❌ [Webhook] サブスクリプション更新の処理エラー:`, error);
                }
                break;
            }
            // サブスクリプション削除イベント
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                console.log(`❌ [Webhook] サブスクリプション削除:`, {
                    id: subscription.id,
                    customer: customerId,
                    cancel_at: subscription.cancel_at
                        ? new Date(subscription.cancel_at * 1000).toISOString()
                        : '即時',
                });
                try {
                    // 顧客情報から関連するユーザーIDを取得
                    const customer = await stripe.customers.retrieve(customerId);
                    const userId = customer.metadata?.userId;
                    if (userId) {
                        console.log(`🔄 [Webhook] サブスクリプション削除によるステータス変更: ${userId}`);
                        const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, 'canceled');
                        console.log(`✅ [Webhook] サブスクリプション削除の処理完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
                    }
                }
                catch (error) {
                    console.error(`❌ [Webhook] サブスクリプション削除の処理エラー:`, error);
                }
                break;
            }
            // 請求成功イベント
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                const customerId = invoice.customer;
                const subscriptionId = invoice.subscription;
                if (subscriptionId) {
                    console.log(`✅ [Webhook] 請求支払い成功:`, {
                        id: invoice.id,
                        customer: customerId,
                        subscription: subscriptionId,
                        amount_paid: invoice.amount_paid,
                        period_end: invoice.period_end
                            ? new Date(invoice.period_end * 1000).toISOString()
                            : '不明',
                    });
                    try {
                        // 顧客情報から関連するユーザーIDを取得
                        const customer = await stripe.customers.retrieve(customerId);
                        const userId = customer.metadata?.userId;
                        if (userId) {
                            console.log(`🔄 [Webhook] 請求支払い成功によるステータス更新: ${userId}`);
                            const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, 'active');
                            console.log(`✅ [Webhook] 請求支払い成功の処理完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
                        }
                    }
                    catch (error) {
                        console.error(`❌ [Webhook] 請求支払い成功の処理エラー:`, error);
                    }
                }
                break;
            }
            // 請求失敗イベント
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const customerId = invoice.customer;
                const subscriptionId = invoice.subscription;
                if (subscriptionId) {
                    console.log(`❌ [Webhook] 請求支払い失敗:`, {
                        id: invoice.id,
                        customer: customerId,
                        subscription: subscriptionId,
                        attempt_count: invoice.attempt_count,
                        next_payment_attempt: invoice.next_payment_attempt
                            ? new Date(invoice.next_payment_attempt * 1000).toISOString()
                            : 'なし',
                    });
                    try {
                        // 顧客情報から関連するユーザーIDを取得
                        const customer = await stripe.customers.retrieve(customerId);
                        const userId = customer.metadata?.userId;
                        if (userId) {
                            // 次回の支払い試行がない場合は無効化（canceled）
                            if (!invoice.next_payment_attempt) {
                                console.log(`🔄 [Webhook] 請求支払い失敗によるステータス無効化: ${userId}`);
                                const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, 'canceled');
                                console.log(`✅ [Webhook] 請求支払い失敗の処理完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
                            }
                            else {
                                console.log(`ℹ️ [Webhook] 請求支払い再試行予定あり - 変更なし: ${userId}, 次回試行: ${new Date(invoice.next_payment_attempt * 1000).toISOString()}`);
                            }
                        }
                    }
                    catch (error) {
                        console.error(`❌ [Webhook] 請求支払い失敗の処理エラー:`, error);
                    }
                }
                break;
            }
            // その他のイベントタイプ
            default:
                console.log(`ℹ️ [Webhook] 未処理のイベント: ${event.type}`);
        }
        console.log('✅ [Webhook] 処理完了: ' + new Date().toISOString());
        return server_1.NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('⛔ [Webhook] 処理エラー:', error);
        // 詳細なエラー情報をログに出力
        if (error instanceof Error) {
            console.error(`エラーメッセージ: ${error.message}`);
            console.error(`エラースタック: ${error.stack}`);
        }
        // 200を返して再試行を防止（エラーは記録済み）
        return server_1.NextResponse.json({ error: 'Webhookの処理中にエラーが発生しました（記録済み）' }, { status: 200 });
    }
}
