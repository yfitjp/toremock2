import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/app/lib/stripe-server';
import { STRIPE_EVENTS } from '@/app/lib/stripe-config';
import { createOrUpdateSubscription } from '@/app/lib/subscriptions';
import { updatePurchaseStatus, getPurchaseByPaymentIntent } from '@/app/lib/purchases';
import Stripe from 'stripe';

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
        
        await createOrUpdateSubscription(subscription.id, {
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
        
        const { purchaseId } = paymentIntent.metadata;
        if (purchaseId) {
          console.log('Updating purchase status to completed:', purchaseId);
          await updatePurchaseStatus(purchaseId, 'completed', paymentIntent.id);
        } else {
          console.log('No purchaseId found in payment intent metadata:', paymentIntent.id);
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
        
        await createOrUpdateSubscription(subscription.id, {
          userId: subscription.metadata.userId,
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
        console.log('Processing checkout session completed:', session.id);
        
        if (session.payment_status === 'paid' && session.payment_intent) {
          const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent.id;

          // payment_intentを取得してメタデータを確認
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          const { purchaseId } = paymentIntent.metadata;

          if (purchaseId) {
            console.log('Updating purchase status to completed:', purchaseId);
            await updatePurchaseStatus(purchaseId, 'completed', paymentIntentId);
          } else {
            console.log('No purchaseId found in payment intent metadata:', paymentIntentId);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { purchaseId } = paymentIntent.metadata;
        
        if (purchaseId) {
          console.log('Updating purchase status to failed:', purchaseId);
          await updatePurchaseStatus(purchaseId, 'failed', paymentIntent.id);
        } else {
          console.log('No purchaseId found in payment intent metadata:', paymentIntent.id);
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