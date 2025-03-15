import { NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import { auth } from '@/app/lib/auth-firebase';
import { getUserActiveSubscription } from '@/app/lib/subscriptions';

export async function POST(req: Request) {
  try {
    // セッションからユーザー情報を取得
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // ユーザーのアクティブなサブスクリプションを取得
    const subscription = await getUserActiveSubscription(userId);
    if (!subscription) {
      return new NextResponse('No active subscription found', { status: 404 });
    }

    // Stripeのサブスクリプションをキャンセル
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    return new NextResponse('Subscription cancelled', { status: 200 });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return new NextResponse(error.message, { status: 500 });
  }
} 