import { NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe-server';
import { STRIPE_PREMIUM_PRICE_ID } from '@/app/lib/stripe-config';
import { auth, db } from '@/app/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    // セッションからユーザー情報を取得
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('認証ヘッダーが見つかりません');
      return new NextResponse('認証が必要です', { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!STRIPE_PREMIUM_PRICE_ID) {
      console.error('STRIPE_PREMIUM_PRICE_ID が設定されていません');
      return new NextResponse('STRIPE_PREMIUM_PRICE_ID が設定されていません', { status: 500 });
    }

    // Stripeの顧客を作成または取得
    let customer;
    try {
      const customers = await stripe.customers.search({
        query: `metadata['userId']:'${userId}'`,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
        console.log('既存の顧客を取得しました:', customer.id);
      } else {
        customer = await stripe.customers.create({
          metadata: {
            userId: userId,
          },
        });
        console.log('新しい顧客を作成しました:', customer.id);
      }
    } catch (error) {
      console.error('顧客の作成/取得に失敗しました:', error);
      return new NextResponse('顧客の作成に失敗しました', { status: 500 });
    }

    // サブスクリプションを作成
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: STRIPE_PREMIUM_PRICE_ID }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: userId,
        },
      });

      const invoice = subscription.latest_invoice as any;
      const payment_intent = invoice.payment_intent as any;

      // Firestoreにサブスクリプション情報を保存
      await db.collection('subscriptions').doc(subscription.id).set({
        userId: userId,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: 'premium',
        startDate: new Date(subscription.start_date * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('サブスクリプションを作成しました:', subscription.id);

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: payment_intent.client_secret,
      });
    } catch (error) {
      console.error('サブスクリプションの作成に失敗しました:', error);
      return new NextResponse('サブスクリプションの作成に失敗しました', { status: 500 });
    }
  } catch (error: any) {
    console.error('エラーが発生しました:', error);
    return new NextResponse(
      error instanceof Error ? error.message : '内部サーバーエラー',
      { status: 500 }
    );
  }
} 