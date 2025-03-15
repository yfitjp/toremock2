import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth } from '@/app/lib/firebase-admin';
import { getExam } from '@/app/lib/exams';
import { createPurchase, updatePurchaseStatus } from '@/app/lib/purchases';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// ベースURLの取得
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const examId = context.params.id;
    if (!examId) {
      return NextResponse.json(
        { error: '模試IDが指定されていません' },
        { status: 400 }
      );
    }

    // ヘッダーからAuthorizationトークンを取得
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // トークンを検証してユーザー情報を取得
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 模試情報を取得
    const exam = await getExam(examId);
    if (!exam) {
      return NextResponse.json(
        { error: '模試が見つかりません' },
        { status: 404 }
      );
    }

    // 無料の模試の場合は購入処理をスキップ
    if (exam.isFree) {
      return NextResponse.json(
        { error: 'この模試は無料です' },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();

    try {
      // 購入レコードを作成（ステータスは'pending'）
      const purchaseId = await createPurchase({
        userId,
        examId: examId,
        amount: exam.price,
        status: 'pending',
        stripePaymentIntentId: '', // 一時的に空文字列を設定
      });

      console.log('Created purchase record:', {
        purchaseId,
        userId,
        examId,
      });

      // Stripeのチェックアウトセッションを作成
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: exam.title,
                description: exam.description,
              },
              unit_amount: exam.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/exams/${examId}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/exams`,
        payment_intent_data: {
          metadata: {
            purchaseId,
            examId,
            userId,
          },
        },
      });

      console.log('Created checkout session:', {
        sessionId: session.id,
      });

      return NextResponse.json({ 
        sessionId: session.id,
        purchaseId: purchaseId,
      });
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError);
      return NextResponse.json(
        { error: 'Stripeでの決済セッション作成に失敗しました' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: '決済セッションの作成に失敗しました' },
      { status: 500 }
    );
  }
} 