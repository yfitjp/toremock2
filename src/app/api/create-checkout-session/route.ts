import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/app/lib/firebase-admin';
import { SUBSCRIPTION_PLANS } from '@/app/lib/subscriptions';

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

// サブスクリプションの価格IDを取得
const getPremiumPriceId = () => {
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) {
    throw new Error('NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_IDが設定されていません');
  }
  return priceId;
};

// ベースURLを取得する関数
const getBaseUrl = () => {
  // 環境変数から取得
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  // 環境変数が設定されている場合はそのまま返す
  if (baseUrl) {
    return baseUrl;
  }
  
  // 環境変数が設定されていない場合のフォールバック
  // 本番環境の場合は実際のドメインを指定
  if (process.env.NODE_ENV === 'production') {
    return 'https://toremock.com'; // 実際のドメインに置き換えてください
  }
  
  // 開発環境の場合はlocalhostを使用
  return 'http://localhost:3000';
};

export async function POST(request: Request) {
  try {
    // Stripe初期化チェック
    if (!stripe) {
      console.error('⛔ [Checkout] Stripeが初期化されていません');
      return NextResponse.json(
        { error: 'Stripe APIが初期化されていません' },
        { status: 500 }
      );
    }

    // リクエストボディを取得
    const body = await request.json();
    const { userId, priceId, email, plan } = body;

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

    // ベースURLを取得
    const baseUrl = getBaseUrl();
    console.log(`ℹ️ [Checkout] ベースURL: ${baseUrl}`);
    console.log(`ℹ️ [Checkout] 環境変数 NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);
    console.log(`ℹ️ [Checkout] NODE_ENV: ${process.env.NODE_ENV}`);

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
      success_url: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscription`,
      metadata: {
        userId,
        type: 'subscription',
        plan: 'premium',
        email: email,
      },
    });

    console.log(`✅ [Checkout] セッション作成成功: ${session.id}`);

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error('⛔ [Checkout] エラー:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'チェックアウトセッションの作成に失敗しました' },
      { status: 500 }
    );
  }
} 