import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/firebase-admin';
import { db } from '@/app/lib/firebase-admin';
import { stripe } from '@/app/lib/stripe-server';
import type Stripe from 'stripe';

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
    const examDoc = await examRef.get().catch(error => {
      console.error('Firestore読み取りエラー:', error);
      throw new Error('データベースの接続に失敗しました');
    });
    
    if (!examDoc.exists) {
      return new NextResponse('模試が見つかりません', { status: 404 });
    }

    const examData = examDoc.data();
    if (!examData) {
      return new NextResponse('模試データが不正です', { status: 400 });
    }

    // 環境変数からStripeの商品IDと価格IDを取得
    const stripeProductId = process.env.STRIPE_TOEIC_2_PRODUCT_ID;
    const stripePriceId = process.env.STRIPE_TOEIC_2_PRICE_ID;

    if (!stripeProductId || !stripePriceId) {
      console.error('Stripeの商品IDまたは価格IDが環境変数に設定されていません:', {
        examId: params.id,
        stripeProductId,
        stripePriceId
      });
      return new NextResponse('Stripeの商品設定が不正です', { status: 400 });
    }

    // 既に購入済みかチェック
    const existingPurchase = await db.collection('purchases')
      .where('userId', '==', userId)
      .where('examId', '==', params.id)
      .get();

    if (!existingPurchase.empty) {
      // 購入レコードの状態を確認
      const purchaseDoc = existingPurchase.docs[0];
      const purchaseData = purchaseDoc.data();
      
      if (purchaseData.status === 'completed') {
        return new NextResponse('この模試は既に購入済みです', { status: 400 });
      }
      
      // pendingの場合は古い購入レコードを削除（または非アクティブにマーク）
      if (purchaseData.status === 'pending') {
        console.log('古いpending状態の購入レコードを削除します:', purchaseDoc.id);
        await db.collection('purchases').doc(purchaseDoc.id).update({
          status: 'abandoned',
          updatedAt: new Date()
        });
      }
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

    // 既存の顧客を検索または新規作成
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
          email: decodedToken.email,
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

    // Stripeの価格情報を取得
    const price = await stripe.prices.retrieve(stripePriceId);
    if (!price) {
      return new NextResponse('価格情報の取得に失敗しました', { status: 500 });
    }

    const amount = price.unit_amount || 0;

    // PaymentIntentを作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'jpy',
      customer: customer.id,
      payment_method_types: ['card'],
      metadata: {
        userId,
        examId: params.id,
        productId: stripeProductId,
        priceId: stripePriceId,
        type: 'exam_purchase'
      }
    });

    // Firestoreに仮の購入レコードを作成
    await db.collection('purchases').add({
      userId,
      examId: params.id,
      examTitle: examData.title,
      price: amount,
      status: 'pending',
      paymentIntentId: paymentIntent.id,
      stripeCustomerId: customer.id,
      stripeProductId: stripeProductId,
      stripePriceId: stripePriceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
      amount: amount,
      title: examData.title
    });
  } catch (error) {
    console.error('模試購入エラー:', error);
    
    // エラーオブジェクトの型チェック
    if (error && typeof error === 'object' && 'code' in error && error.code === 13) {
      return new NextResponse(
        JSON.stringify({
          error: 'データベース接続エラー',
          message: 'データベース接続エラーが発生しました。しばらく待ってから再度お試しください。'
        }),
        { 
          status: 503,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    if (error instanceof Error) {
      if ('type' in error && typeof error.type === 'string') {
        // Stripeエラーの処理
        console.error('Stripeエラーの詳細:', {
          type: error.type,
          code: 'code' in error ? error.code : undefined,
          message: error.message,
          stack: error.stack,
        });
        return new NextResponse(
          JSON.stringify({
            error: 'Stripeエラー',
            message: error.message,
          }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
    
    // その他のエラーの詳細をログ出力
    console.error('その他のエラー:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new NextResponse(
      JSON.stringify({
        error: '内部サーバーエラー',
        message: error instanceof Error ? error.message : '内部サーバーエラーが発生しました'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 