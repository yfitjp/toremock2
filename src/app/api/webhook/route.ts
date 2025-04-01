import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateSubscriptionStatus } from '@/app/lib/subscriptions';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Stripeのウェブフックシークレット
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    // シグネチャの検証
    if (!webhookSecret) {
      throw new Error('Webhookシークレットが設定されていません');
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
    console.error(`Webhook Error: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // イベントタイプに基づいて処理
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessfulPayment(paymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`決済失敗: ${failedPaymentIntent.id}`);
        // 失敗時の処理を追加（必要に応じて）
        break;
        
      default:
        console.log(`未処理のイベントタイプ: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook処理エラー:', error);
    return NextResponse.json(
      { error: '内部処理エラーが発生しました' },
      { status: 500 }
    );
  }
}

// 成功した決済を処理
async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    // メタデータからユーザーIDを取得
    const userId = paymentIntent.metadata.userId;
    
    if (!userId) {
      console.error('ユーザーIDがメタデータに含まれていません:', paymentIntent.id);
      return;
    }
    
    console.log(`決済成功 - ユーザーID: ${userId}, 決済ID: ${paymentIntent.id}`);
    
    // サブスクリプション関連の決済であれば、ユーザーのサブスクリプション状態を更新
    if (paymentIntent.metadata.type === 'subscription') {
      console.log(`サブスクリプションを有効化します - ユーザーID: ${userId}`);
      await updateSubscriptionStatus(userId, 'active');
    }
  } catch (error) {
    console.error('決済成功処理エラー:', error);
    throw error;
  }
} 