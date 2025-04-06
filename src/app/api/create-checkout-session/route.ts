import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/app/lib/firebase-admin';
import { SUBSCRIPTION_PLANS } from '@/app/lib/subscriptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// サブスクリプションの価格IDを取得
const getPremiumPriceId = () => {
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) {
    throw new Error('NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_IDが設定されていません');
  }
  return priceId;
};

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

    // 認証トークンを取得
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証トークンが指定されていません' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
      console.log('認証成功: トークン検証OK - ユーザー:', decodedToken.uid);
    } catch (error) {
      console.error('認証エラー:', error);
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      );
    }

    if (decodedToken.uid !== userId) {
      return NextResponse.json(
        { error: '認証ユーザーとリクエストユーザーが一致しません' },
        { status: 403 }
      );
    }

    // 使用する価格IDを取得（環境変数から）
    const subscriptionPriceId = priceId || getPremiumPriceId();
    
    console.log('サブスクリプション作成開始:', {
      userId,
      email,
      priceId: subscriptionPriceId,
      plan: 'premium',
    });

    // Stripe顧客を作成または取得
    let customer;
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log(`既存の顧客を使用: ${customer.id}`);
    } else {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });
      console.log(`新規顧客を作成: ${customer.id}`);
    }

    // チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: subscriptionPriceId, // Stripeダッシュボードで作成した価格ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
      metadata: {
        userId: userId,
        type: 'subscription',
        plan: 'premium',
        email: email,
      },
    });

    console.log(`チェックアウトセッション作成成功: ID=${session.id}, ユーザー=${userId}`);

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error('サブスクリプション作成エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'サブスクリプション作成に失敗しました' },
      { status: 500 }
    );
  }
} 