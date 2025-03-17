import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/firebase-admin';
import { db } from '@/app/lib/firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 認証ヘッダーからトークンを取得
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse('認証が必要です', { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 模試の存在確認
    const examRef = db.collection('exams').doc(params.id);
    const examDoc = await examRef.get();
    
    if (!examDoc.exists) {
      return new NextResponse('模試が見つかりません', { status: 404 });
    }

    const examData = examDoc.data();
    if (!examData) {
      return new NextResponse('模試データが不正です', { status: 400 });
    }

    // 既に購入済みかチェック
    const existingPurchase = await db.collection('purchases')
      .where('userId', '==', userId)
      .where('examId', '==', params.id)
      .get();

    if (!existingPurchase.empty) {
      return new NextResponse('この模試は既に購入済みです', { status: 400 });
    }

    // 環境変数の確認
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return new NextResponse('Stripeの設定が不正です', { status: 500 });
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not set');
      return new NextResponse('API URLの設定が不正です', { status: 500 });
    }

    // Stripeセッションの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: examData.title,
              description: examData.description,
            },
            unit_amount: examData.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.id}?canceled=true`,
      metadata: {
        userId,
        examId: params.id,
      },
      payment_method_collection: 'always',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
      customer_email: decodedToken.email,
      locale: 'ja',
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    });

    // 購入履歴の作成
    await db.collection('purchases').add({
      userId,
      examId: params.id,
      examTitle: examData.title,
      price: examData.price,
      status: 'pending',
      stripeSessionId: session.id,
      stripePaymentIntentId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('模試購入エラー:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripeエラーの詳細:', {
        type: error.type,
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      return new NextResponse(
        `Stripeエラー: ${error.message}`,
        { status: 400 }
      );
    }
    
    return new NextResponse(
      error instanceof Error ? error.message : '内部サーバーエラー',
      { status: 500 }
    );
  }
} 