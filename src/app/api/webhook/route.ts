import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateSubscriptionStatus } from '@/app/lib/server/subscription-update';

// stripeインスタンス初期化時のエラーチェック
const initStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEYが設定されていません');
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  });
};

// エラーハンドリング付きでStripeインスタンスを作成
let stripe: Stripe;
try {
  stripe = initStripe();
} catch (error) {
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

export async function POST(request: Request) {
  console.log('📣 [Webhook] リクエスト受信: ' + new Date().toISOString());
  
  try {
    // Stripe初期化チェック
    if (!stripe) {
      console.error('⛔ [Webhook] Stripeが初期化されていません');
      return NextResponse.json(
        { error: 'Stripe APIが初期化されていません' },
        { status: 500 }
      );
    }

    // Webhookシークレットチェック
    let webhookSecret: string;
    try {
      webhookSecret = getWebhookSecret();
      console.log('✅ [Webhook] STRIPE_WEBHOOK_SECRET: 設定済み');
    } catch (error) {
      console.error('⛔ [Webhook] STRIPE_WEBHOOK_SECRETが設定されていません');
      return NextResponse.json(
        { error: 'Webhook設定エラー' },
        { status: 500 }
      );
    }
    
    // リクエストボディとシグネチャを取得
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('⛔ [Webhook] Stripe署名がありません');
      return NextResponse.json(
        { error: 'Stripe署名が見つかりません' },
        { status: 400 }
      );
    }

    // イベント検証
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log(`✅ [Webhook] イベント検証成功: ${event.type} (ID: ${event.id})`);
    } catch (err) {
      console.error('⛔ [Webhook] 署名検証エラー:', err);
      return NextResponse.json(
        { error: 'Webhook署名の検証に失敗しました' },
        { status: 400 }
      );
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
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;
        const email = paymentIntent.metadata?.email || paymentIntent.receipt_email;
        const type = paymentIntent.metadata?.type;
        const plan = paymentIntent.metadata?.plan;

        console.log(`💰 [Webhook] 支払い成功:`, {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          userId,
          email,
          type,
          plan,
          created: new Date(paymentIntent.created * 1000).toISOString(),
        });

        if (type === 'subscription' && userId) {
          console.log(`🔄 [Webhook] サブスクリプション更新開始: ${userId} (${email || '不明'})`);
          
          try {
            const result = await updateSubscriptionStatus(userId, 'active');
            console.log(`✅ [Webhook] サブスクリプション更新完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
          } catch (error) {
            console.error(`❌ [Webhook] サブスクリプション更新エラー: ${userId}`, error);
            // エラーを返さず処理を続行（再試行のため）
          }
        } else {
          console.log(`ℹ️ [Webhook] 対象外の支払い: type=${type}, userId=${userId || 'なし'}, email=${email || 'なし'}`);
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const email = session.metadata?.email || session.customer_email;
        const type = session.metadata?.type;
        const plan = session.metadata?.plan;

        console.log(`🛒 [Webhook] チェックアウト完了:`, {
          id: session.id,
          userId,
          email,
          type,
          plan,
          amount_total: session.amount_total,
        });

        if (type === 'subscription' && userId) {
          console.log(`🔄 [Webhook] セッション完了によるサブスクリプション更新: ${userId} (${email || '不明'})`);
          
          try {
            const result = await updateSubscriptionStatus(userId, 'active');
            console.log(`✅ [Webhook] セッション経由のサブスクリプション更新完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
          } catch (error) {
            console.error(`❌ [Webhook] セッション経由のサブスクリプション更新エラー: ${userId}`, error);
          }
        }
        break;
      }

      // その他のイベントタイプ
      default:
        console.log(`ℹ️ [Webhook] 未処理のイベント: ${event.type}`);
    }

    console.log('✅ [Webhook] 処理完了: ' + new Date().toISOString());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('⛔ [Webhook] 処理エラー:', error);
    
    // 詳細なエラー情報をログに出力
    if (error instanceof Error) {
      console.error(`エラーメッセージ: ${error.message}`);
      console.error(`エラースタック: ${error.stack}`);
    }
    
    // 200を返して再試行を防止（エラーは記録済み）
    return NextResponse.json(
      { error: 'Webhookの処理中にエラーが発生しました（記録済み）' },
      { status: 200 }
    );
  }
} 