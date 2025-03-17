import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/firebase-admin';
import { db } from '@/app/lib/firebase-admin';

export async function GET(
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

    // 購入履歴の確認
    const purchaseQuery = await db.collection('purchases')
      .where('userId', '==', userId)
      .where('examId', '==', params.id)
      .get();

    if (purchaseQuery.empty) {
      return NextResponse.json({ status: 'none' });
    }

    const purchaseDoc = purchaseQuery.docs[0];
    const purchaseData = purchaseDoc.data();

    return NextResponse.json({ status: purchaseData.status });
  } catch (error) {
    console.error('購入状態確認エラー:', error);
    return new NextResponse(
      error instanceof Error ? error.message : '内部サーバーエラー',
      { status: 500 }
    );
  }
} 