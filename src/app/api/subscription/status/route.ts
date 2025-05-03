import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/firebase-admin';
import { getUserActiveSubscriptionAdmin } from '@/app/lib/subscriptions-admin';

export async function GET(req: Request) {
  try {
    // 1. 認証トークンを取得・検証
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse('認証が必要です', { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 2. Admin SDK を使ってサブスクリプション情報を取得
    const subscription = await getUserActiveSubscriptionAdmin(userId);

    // 3. 結果を JSON で返す
    return NextResponse.json(subscription); // subscription が null の場合もそのまま返す

  } catch (error: any) {
    console.error('[API /subscription/status] Error:', error);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return new NextResponse('認証トークンが無効です', { status: 401 });
    }
    return new NextResponse('サブスクリプション情報の取得中にエラーが発生しました', { status: 500 });
  }
} 