import { NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe-server';
import { STRIPE_PREMIUM_PRICE_ID } from '@/app/lib/stripe-config';
import { adminAuth } from '@/app/lib/firebase-admin';
import { createOrUpdateSubscription } from '@/app/lib/subscriptions';

export async function POST(req: Request) {
  try {
    // セッションからユーザー情報を取得
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('認証ヘッダーが見つかりません');
      return new NextResponse('認証が必要です', { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!STRIPE_PREMIUM_PRICE_ID) {
      console.error('STRIPE_PREMIUM_PRICE_ID が設定されていません');
      throw new Error('STRIPE_PREMIUM_PRICE_ID が設定されていません');
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
      throw new Error('顧客の作成に失敗しました');
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
      await createOrUpdateSubscription(subscription.id, {
        userId: userId,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: 'premium',
        startDate: new Date(subscription.start_date * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
      });

      console.log('サブスクリプションを作成しました:', subscription.id);

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: payment_intent.client_secret,
      });
    } catch (error) {
      console.error('サブスクリプションの作成に失敗しました:', error);
      throw new Error('サブスクリプションの作成に失敗しました');
    }
  } catch (error: any) {
    console.error('エラーが発生しました:', error);
    return new NextResponse(error.message, { status: 500 });
  }
} 