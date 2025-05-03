import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, db as adminDb } from '@/app/lib/firebase-admin'; // 中央ファイルからインポート
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

let stripe: Stripe;
try {
  stripe = initStripe();
} catch (error) {
  console.error('Stripe初期化エラー:', error);
}

const getPremiumPriceId = () => {
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) {
    throw new Error('NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_IDが設定されていません');
  }
  return priceId;
};

const EXAM_PRICE_ID_MAP: { [key: string]: string | undefined } = {
  'TOEIC': process.env.STRIPE_TOEIC_PRICE_ID,
  'TOEFL': process.env.STRIPE_TOEFL_PRICE_ID,
  'EIKEN': process.env.STRIPE_EIKEN_PRICE_ID,
};

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl) {
    return baseUrl;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://toremock.com';
  }
  return 'http://localhost:3000';
};

export async function POST(request: Request) {
  try {
    // 初期化済みのインスタンスが存在するか確認
    if (!adminDb || !auth) {
       console.error('⛔ [Checkout] Firebase Admin SDKが初期化されていません (中央ファイルを確認)');
       return NextResponse.json({ error: 'Firebase Admin SDKが初期化されていません' }, { status: 500 });
    }
    if (!stripe) {
      console.error('⛔ [Checkout] Stripeが初期化されていません');
      return NextResponse.json({ error: 'Stripe APIが初期化されていません' }, { status: 500 });
    }

    const body = await request.json();
    const { userId, priceId, email, examId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが指定されていません' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証トークンが指定されていません' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
      console.log('認証成功: トークン検証OK - ユーザー:', decodedToken.uid);
    } catch (error) {
      console.error('認証エラー:', error);
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
    }
    if (decodedToken.uid !== userId) {
      return NextResponse.json({ error: '認証ユーザーとリクエストユーザーが一致しません' }, { status: 403 });
    }

    let customer;
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log(`既存の顧客を使用: ${customer.id}`);
    } else {
      customer = await stripe.customers.create({ email: email, metadata: { userId: userId } });
      console.log(`新規顧客を作成: ${customer.id}`);
    }

    const baseUrl = getBaseUrl();
    let session;

    if (examId) {
      console.log(`個別模試購入開始: examId=${examId}`);

      const examRef = adminDb.collection('exams').doc(examId);
      const examDoc = await examRef.get();
      if (!examDoc.exists) {
        return NextResponse.json({ error: '指定された模試が見つかりません' }, { status: 404 });
      }
      const examData = examDoc.data();
      const examType = examData?.type;
      if (!examType) {
        return NextResponse.json({ error: '模試のタイプが設定されていません' }, { status: 500 });
      }

      const examPriceId = EXAM_PRICE_ID_MAP[examType];
      if (!examPriceId) {
        return NextResponse.json({ error: `タイプ '${examType}' の価格設定が見つかりません` }, { status: 400 });
      }
      console.log(`使用する価格ID (模試): ${examPriceId}`);

      session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: examPriceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/exams`,
        metadata: {
          userId,
          type: 'exam_purchase',
          examId: examId,
          email: email,
        },
      });
      console.log(`✅ [Checkout] 個別模試セッション作成成功: ${session.id}`);

    } else {
      console.log('サブスクリプション作成開始');
      const subscriptionPriceId = priceId || getPremiumPriceId();
      console.log(`使用する価格ID (サブスク): ${subscriptionPriceId}`);

      session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: subscriptionPriceId,
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
        subscription_data: {
          metadata: {
            userId: userId,
          }
        }
      });
      console.log(`✅ [Checkout] サブスクリプションセッション作成成功: ${session.id}`);
    }

    return NextResponse.json({
      sessionUrl: session.url,
    });

  } catch (error) {
    console.error('⛔ [Checkout] エラー:', error);
    const errorMessage = error instanceof Error ? error.message : 'チェックアウトセッションの作成中に予期せぬエラーが発生しました';
    // statusコードはシンプルに500に戻す (初期化失敗は考えにくくなったため)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 