import { NextResponse, NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import * as admin from 'firebase-admin'; // Firebase Admin SDK をインポート
import { verifyIdToken } from '@/utils/auth'; // IDトークン検証関数の仮パス

// Firebase Admin SDK の初期化 (一度だけ実行)
if (!admin.apps.length) {
    // 環境変数からサービスアカウントキーを読み込むなど、適切な方法で初期化
    // 例: const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!); 
    admin.initializeApp({
        // credential: admin.credential.cert(serviceAccount),
        // credential: admin.credential.applicationDefault(), // GCP環境など
    });
}
const adminDb = admin.firestore();

// Stripe 初期化 (Secret Key を使用)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // プロジェクトで使用しているバージョンに合わせる
});

// 模試タイプとPrice IDの対応マップ (環境変数から取得)
const PRICE_ID_MAP: { [key: string]: string | undefined } = {
  'TOEIC': process.env.STRIPE_TOEIC_PRICE_ID,
  'TOEFL': process.env.STRIPE_TOEFL_PRICE_ID,
  'EIKEN': process.env.STRIPE_EIKEN_PRICE_ID,
  // 必要に応じて他のタイプも追加
};

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');
    const token = authorization?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: '認証トークンが必要です' }, { status: 401 });
    }

    // IDトークンを検証してユーザー情報を取得
    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
    }
    const userId = decodedToken.uid;

    // リクエストボディから examId を取得
    const { examId } = await request.json();
    if (!examId) {
      return NextResponse.json({ error: 'examIdが必要です' }, { status: 400 });
    }

    console.log(`Received request for examId: ${examId} from userId: ${userId}`);

    // Firestoreから模試データを取得してタイプを確認
    const examRef = adminDb.collection('exams').doc(examId);
    const examDoc = await examRef.get();

    if (!examDoc.exists) {
      return NextResponse.json({ error: '指定された模試が見つかりません' }, { status: 404 });
    }
    const examData = examDoc.data();
    const examType = examData?.type; // Firestoreの模試ドキュメントに type フィールドがある想定

    if (!examType) {
        console.error(`Exam type not found for examId: ${examId}`);
        return NextResponse.json({ error: '模試のタイプが設定されていません' }, { status: 500 });
    }
    console.log(`Exam type identified as: ${examType}`);


    // 模試タイプに対応するPrice IDを取得
    const priceId = PRICE_ID_MAP[examType];
    if (!priceId) {
      console.error(`Stripe Price ID not found for exam type: ${examType}. Check environment variables.`);
      return NextResponse.json({ error: `タイプ '${examType}' の価格設定が見つかりません` }, { status: 400 });
    }
     console.log(`Using Stripe Price ID: ${priceId}`);

    // Stripe Checkout Sessionを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      // success_url と cancel_url を環境変数などで設定するのが望ましい
      // session_id を含めて購入後の処理で利用
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/exams`, // キャンセル時は模試一覧に戻る
      // メタデータにユーザーIDと模試IDを含める (Webhookでの処理に利用)
      metadata: {
        userId: userId,
        examId: examId,
      },
      // 必要に応じて顧客情報（メールなど）を渡すことも可能
      // customer_email: decodedToken.email,
    });

    console.log(`Stripe Checkout Session created: ${session.id}`);

    // 作成されたセッションのIDを返す
    return NextResponse.json({ id: session.id });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message || 'サーバーエラーが発生しました' }, { status: 500 });
  }
} 