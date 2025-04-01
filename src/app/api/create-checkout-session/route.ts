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
    const { userId, priceId } = body;

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
    } catch (error) {
      console.error('認証エラー:', error);
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      );
    }

    // 支払いインテントを作成
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
    });

    if (!paymentIntent.client_secret) {
      throw new Error('クライアントシークレットの取得に失敗しました');
    }

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: SUBSCRIPTION_PLANS.PREMIUM.price,
      currency: 'jpy'
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: '支払いインテントの作成に失敗しました' },
      { status: 500 }
    );
  }
} 