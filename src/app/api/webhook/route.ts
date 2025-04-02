import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateSubscriptionStatus } from '@/app/lib/server/subscription-update';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Stripeのウェブフックシークレット
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Stripe署名が見つかりません' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook署名検証エラー:', err);
      return NextResponse.json(
        { error: 'Webhook署名の検証に失敗しました' },
        { status: 400 }
      );
    }

    // イベントタイプに応じた処理
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;
        const type = paymentIntent.metadata.type;

        if (type === 'subscription' && userId) {
          console.log(`サブスクリプション決済成功: ユーザーID ${userId}`);
          await updateSubscriptionStatus(userId, 'active');
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;
        const type = paymentIntent.metadata.type;

        if (type === 'subscription' && userId) {
          console.log(`サブスクリプション決済失敗: ユーザーID ${userId}`);
          await updateSubscriptionStatus(userId, 'inactive');
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook処理エラー:', error);
    return NextResponse.json(
      { error: 'Webhookの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 