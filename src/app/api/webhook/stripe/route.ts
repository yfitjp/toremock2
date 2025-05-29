import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/app/lib/stripe-server';
import { STRIPE_EVENTS } from '@/app/lib/stripe-config';
import { createOrUpdateSubscriptionAdmin } from '@/app/lib/subscriptions-admin';
import { updatePurchaseStatus, getPurchaseByPaymentIntent } from '@/app/lib/purchases';
import Stripe from 'stripe';
import { db } from '@/app/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return new NextResponse('Webhook secret is not set', { status: 500 });
    }

    if (!signature) {
      console.error('No signature found in request');
      return new NextResponse('No signature', { status: 400 });
    }

    if (!stripe) {
      console.error('Stripe instance is not initialized');
      return new NextResponse('Stripe is not initialized', { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case STRIPE_EVENTS.SUBSCRIPTION_CREATED:
      case STRIPE_EVENTS.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        
        if (!userId) {
          console.error('No userId found in subscription metadata');
          return new NextResponse('No userId found', { status: 400 });
        }

        console.log('Creating/Updating subscription:', subscription.id, 'for user:', userId, 'status:', subscription.status);
        
        await createOrUpdateSubscriptionAdmin(subscription.id, {
          userId: userId,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          plan: 'premium',
          startDate: new Date(subscription.start_date * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
        });
        break;
      }

      case STRIPE_EVENTS.PAYMENT_SUCCEEDED:
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Processing payment intent succeeded:', paymentIntent.id);
        
        const { purchaseId, examId, userId, type } = paymentIntent.metadata;
        
        // 購入関連のPaymentIntentの場合
        if (type === 'exam_purchase' && examId && userId) {
          console.log('Processing exam purchase payment:', paymentIntent.id, 'for exam:', examId);
          
          // PaymentIntentに関連するpurchaseレコードを検索
          const purchaseQuery = await db.collection('purchases')
            .where('paymentIntentId', '==', paymentIntent.id)
            .get();
          
          if (!purchaseQuery.empty) {
            const purchaseDoc = purchaseQuery.docs[0];
            console.log('Updating purchase status to completed:', purchaseDoc.id);
            await purchaseDoc.ref.update({
              status: 'completed',
              updatedAt: new Date(),
            });
          } else {
            console.log('No purchase record found for payment intent:', paymentIntent.id);
          }
        }
        // 従来の処理
        else if (purchaseId) {
          console.log('Updating purchase status to completed:', purchaseId);
          await updatePurchaseStatus(purchaseId, 'completed', paymentIntent.id);
        } else {
          console.log('No purchaseId or exam purchase metadata found in payment intent:', paymentIntent.id);
        }
        break;
      }

      case STRIPE_EVENTS.PAYMENT_FAILED: {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) {
          console.log('No subscription found in invoice');
          return new NextResponse('Success', { status: 200 });
        }

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        
        console.log('Payment failed for subscription:', subscription.id);
        
        await createOrUpdateSubscriptionAdmin(subscription.id, {
          userId: subscription.metadata?.userId ?? 'unknown_user',
          status: 'past_due',
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          plan: 'premium',
          startDate: new Date(subscription.start_date * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
        });
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (!metadata) {
          console.error('[Webhook] Metadata not found in checkout session:', session.id);
          return new NextResponse('Metadata not found', { status: 400 });
        }

        const { userId, examId, type, email } = metadata; // email も取得

        // 個別模試購入の場合のみ処理
        if (type === 'exam_purchase' && userId && examId) {
          console.log(`[Webhook] Processing completed checkout session for exam purchase: ${session.id}, User: ${userId}, Exam: ${examId}`);

          // Firestoreに購入情報を書き込む
          const purchaseRef = db.collection('purchases').doc(); // 新しいドキュメントIDを生成
          await purchaseRef.set({
            userId: userId,
            examId: examId,
            examTitle: metadata.examTitle || '', // create-checkout-sessionのmetadataに含める必要あり
            purchaseDate: new Date(), // 購入日時
            status: 'completed', // ステータス
            stripeSessionId: session.id, // Stripe Checkout Session ID
            stripePaymentIntentId: session.payment_intent as string, // Stripe Payment Intent ID
            amount: session.amount_total, // 金額 (Stripeから取得)
            currency: session.currency, // 通貨 (Stripeから取得)
            customerEmail: email, // 顧客メールアドレス
            // createdAt: admin.firestore.FieldValue.serverTimestamp(), // admin SDKを使っている場合はこちら
            // updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`[Webhook] Purchase record created: ${purchaseRef.id} for session: ${session.id}`);
        } else if (type === 'subscription') {
          // サブスクリプションの場合はここで特別な処理は不要（SUBSCRIPTION_CREATED/UPDATEDで処理されるため）
          console.log(`[Webhook] Checkout session completed for subscription: ${session.id}. Handled by subscription events.`);
        } else {
          console.warn(`[Webhook] Checkout session completed with unknown type or missing data: ${session.id}`, metadata);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const sessionId = paymentIntent.metadata.sessionId;

        // ★ sessionId が存在する場合のみ購入履歴を検索・更新 ★
        if (sessionId) {
          console.log(`[Webhook] Processing failed payment for session: ${sessionId}`);
          // 購入履歴の更新
          const purchaseQuery = await db.collection('purchases')
            .where('stripeSessionId', '==', sessionId)
            .get();

          if (!purchaseQuery.empty) {
            const purchaseDoc = purchaseQuery.docs[0];
            await purchaseDoc.ref.update({
              status: 'failed',
              updatedAt: new Date(), // ここも FieldValue.serverTimestamp() の方が良いかも
            });
             console.log(`[Webhook] Updated purchase ${purchaseDoc.id} status to failed.`);
          } else {
            console.log(`[Webhook] No purchase found for failed payment session: ${sessionId}`);
          }
        } else {
          // sessionId がない場合 (例: サブスクリプションの自動更新失敗など)
          console.log('[Webhook] Payment intent failed, but no sessionId found in metadata. Skipping purchase update.', paymentIntent.id);
          // ここでサブスクリプション自体のステータス更新など、別の処理が必要か検討
        }

        break;
      }
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new NextResponse(error.message, { status: 400 });
  }
} 