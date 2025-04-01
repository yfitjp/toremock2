import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/app/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const body = await request.json();
    const { priceId, userId } = body;

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    // Firebase Admin SDKでトークンを検証
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);
      if (decodedToken.uid !== userId) {
        return NextResponse.json(
          { error: 'ユーザーIDが一致しません' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('トークン検証エラー:', error);
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      );
    }

    // Stripeのチェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/subscription`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    if (!session?.id) {
      throw new Error('セッションIDが取得できませんでした');
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripeセッション作成エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '決済セッションの作成に失敗しました' },
      { status: 500 }
    );
  }
} 