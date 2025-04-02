import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/app/lib/firebase-admin';
import { SUBSCRIPTION_PLANS } from '@/app/lib/subscriptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    // リクエストボディを取得
    const body = await request.json();
    const { userId, priceId, email } = body;

    // パラメータの検証
    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが指定されていません' },
        { status: 400 }
      );
    }
    if (!priceId) {
      return NextResponse.json(
        { error: '価格IDが指定されていません' },
        { status: 400 }
      );
    }

    // 認証トークンを取得
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証トークンが指定されていません' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      await auth.verifyIdToken(token);
      console.log('認証成功: トークン検証OK');
    } catch (error) {
      console.error('認証エラー:', error);
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      );
    }

    // 支払いインテントを作成
    console.log('支払いインテント作成開始:', {userId, priceId, type: 'subscription'});
    const paymentIntent = await stripe.paymentIntents.create({
      amount: SUBSCRIPTION_PLANS.PREMIUM.price,
      currency: 'jpy',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        priceId,
        type: 'subscription',
      },
      // 支払い成功後のリダイレクト先とWebhook
      receipt_email: email,
      description: `${SUBSCRIPTION_PLANS.PREMIUM.name} サブスクリプション`,
      // 成功時の処理方法
      confirm: false,
    });

    if (!paymentIntent.client_secret) {
      throw new Error('クライアントシークレットの取得に失敗しました');
    }

    console.log(`支払いインテント作成成功: ${paymentIntent.id}`);

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: SUBSCRIPTION_PLANS.PREMIUM.price,
      currency: 'jpy',
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '支払いインテントの作成に失敗しました' },
      { status: 500 }
    );
  }
} 