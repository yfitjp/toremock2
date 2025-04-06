import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateSubscriptionStatus } from '@/app/lib/server/subscription-update';

// stripeインスタンス初期化時のエラーチェック
const initStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEYが設定されていません');
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  });
};

// エラーハンドリング付きでStripeインスタンスを作成
let stripe: Stripe;
try {
  stripe = initStripe();
} catch (error) {
  console.error('Stripe初期化エラー:', error);
}

// Webhookシークレットのチェック
const getWebhookSecret = () => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRETが設定されていません');
  }
  return secret;
};

export async function POST(request: Request) {
  console.log('📣 [API Webhook] リクエスト受信: ' + new Date().toISOString());
  console.log('📣 [API Webhook] リクエストパス: ' + request.url);
  console.log('📣 [API Webhook] リクエストメソッド: ' + request.method);
  
  // リクエストヘッダーのログ出力
  const headersLog: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headersLog[key] = value;
  });
  console.log('📣 [API Webhook] リクエストヘッダー:', JSON.stringify(headersLog, null, 2));
  
  try {
    // リクエストボディのクローンを作成して内容をログに出力（bodyは一度しか読み取れないため）
    const clonedRequest = request.clone();
    const bodyText = await clonedRequest.text();
    
    // ボディの最初の1000文字だけ出力（長すぎる場合があるため）
    const truncatedBody = bodyText.length > 1000 
      ? bodyText.substring(0, 1000) + '... (truncated)'
      : bodyText;
    
    console.log('📣 [API Webhook] リクエストボディ:', truncatedBody);
    
    // Stripe初期化チェック
    if (!stripe) {
      console.error('⛔ [API Webhook] Stripeが初期化されていません');
      return NextResponse.json(
        { error: 'Stripe APIが初期化されていません' },
        { status: 500 }
      );
    }

    // Webhookシークレットチェック
    let webhookSecret: string;
    try {
      webhookSecret = getWebhookSecret();
      console.log('✅ [API Webhook] STRIPE_WEBHOOK_SECRET: 設定済み');
    } catch (error) {
      console.error('⛔ [API Webhook] STRIPE_WEBHOOK_SECRETが設定されていません');
      return NextResponse.json(
        { error: 'Webhook設定エラー' },
        { status: 500 }
      );
    }
    
    // シグネチャを取得
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('⛔ [API Webhook] Stripe署名がありません');
      return NextResponse.json(
        { error: 'Stripe署名が見つかりません' },
        { status: 400 }
      );
    }

    // イベント検証
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret);
      console.log(`✅ [API Webhook] イベント検証成功: ${event.type} (ID: ${event.id})`);
    } catch (err) {
      console.error('⛔ [API Webhook] 署名検証エラー:', err);
      return NextResponse.json(
        { error: 'Webhook署名の検証に失敗しました' },
        { status: 400 }
      );
    }

    // イベント詳細をログ出力
    console.log(`📋 [API Webhook] イベント情報:`, {
      id: event.id,
      type: event.type,
      created: new Date(event.created * 1000).toISOString(),
      livemode: event.livemode ? 'プロダクション' : 'テスト',
    });

    // イベントタイプに応じた処理
    switch (event.type) {
      // 支払い成功イベント
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;
        const email = paymentIntent.metadata?.email || paymentIntent.receipt_email;
        const type = paymentIntent.metadata?.type;
        const plan = paymentIntent.metadata?.plan;

        console.log(`💰 [API Webhook] 支払い成功:`, {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          userId,
          email,
          type,
          plan,
          created: new Date(paymentIntent.created * 1000).toISOString(),
        });

        if (type === 'subscription' && userId) {
          console.log(`🔄 [API Webhook] サブスクリプション更新開始: ${userId} (${email || '不明'})`);
          
          try {
            const result = await updateSubscriptionStatus(userId, 'active');
            console.log(`✅ [API Webhook] サブスクリプション更新完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
          } catch (error) {
            console.error(`⛔ [API Webhook] サブスクリプション更新エラー:`, error);
          }
        } else {
          console.log(`ℹ️ [API Webhook] 対象外の支払い: type=${type}, userId=${userId || 'なし'}, email=${email || 'なし'}`);
        }
        break;
      }

      // チェックアウト完了イベント
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const email = session.metadata?.email || session.customer_email;
        const type = session.metadata?.type;
        const plan = session.metadata?.plan;
        const customerId = session.customer as string;
        const mode = session.mode;

        console.log(`🛒 [API Webhook] チェックアウト完了:`, {
          id: session.id,
          userId,
          email,
          type,
          plan,
          mode,
          customerId,
          amount_total: session.amount_total,
        });

        try {
          let targetUserId = userId;
          
          // ユーザーIDがメタデータに存在しない場合、顧客情報から取得を試みる
          if (!targetUserId && customerId) {
            console.log(`🔍 [API Webhook] メタデータにユーザーIDがないため顧客情報から取得を試みます - 顧客ID: ${customerId}`);
            try {
              const customer = await stripe.customers.retrieve(customerId);
              targetUserId = (customer as Stripe.Customer).metadata?.userId;
              
              if (targetUserId) {
                console.log(`✅ [API Webhook] 顧客情報からユーザーIDを取得: ${targetUserId}`);
              } else {
                console.warn(`⚠️ [API Webhook] 顧客情報からもユーザーIDを取得できませんでした - 顧客ID: ${customerId}`);
              }
            } catch (customerError) {
              console.error(`❌ [API Webhook] 顧客情報取得エラー:`, customerError);
            }
          }

          // サブスクリプション関連のセッションの場合のみ処理する
          if (targetUserId && (type === 'subscription' || mode === 'subscription')) {
            console.log(`🔄 [API Webhook] セッション完了によるサブスクリプション更新: ${targetUserId} (${email || '不明'})`);
            
            try {
              const result = await updateSubscriptionStatus(targetUserId, 'active');
              console.log(`✅ [API Webhook] セッション経由のサブスクリプション更新完了: ${targetUserId}, 結果: ${result ? '成功' : '失敗'}`);
            } catch (error) {
              console.error(`❌ [API Webhook] セッション経由のサブスクリプション更新エラー: ${targetUserId}`, error);
            }
          } else {
            if (!targetUserId) {
              console.error(`❌ [API Webhook] ユーザーIDが取得できないため更新をスキップ - セッションID: ${session.id}`);
            } else if (type !== 'subscription' && mode !== 'subscription') {
              console.log(`ℹ️ [API Webhook] サブスクリプション以外のセッション - 処理をスキップ - タイプ: ${type}, モード: ${mode}`);
            }
          }
        } catch (error) {
          console.error(`❌ [API Webhook] セッション処理中の予期しないエラー:`, error);
        }
        break;
      }

      // サブスクリプション作成イベント
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        console.log(`🆕 [API Webhook] サブスクリプション作成:`, {
          id: subscription.id,
          customer: customerId,
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        
        try {
          // サブスクリプションのメタデータからユーザーIDを取得
          let userId = subscription.metadata?.userId;
          
          // サブスクリプションのメタデータにユーザーIDがなければ顧客情報から取得
          if (!userId && customerId) {
            console.log(`🔍 [API Webhook] サブスクリプションメタデータにユーザーIDがないため顧客情報から取得を試みます - 顧客ID: ${customerId}`);
            try {
              const customer = await stripe.customers.retrieve(customerId);
              userId = (customer as Stripe.Customer).metadata?.userId;
              
              if (userId) {
                console.log(`✅ [API Webhook] 顧客情報からユーザーIDを取得: ${userId}`);
              } else {
                console.warn(`⚠️ [API Webhook] 顧客情報からもユーザーIDを取得できませんでした - 顧客ID: ${customerId}`);
              }
            } catch (error) {
              console.error(`❌ [API Webhook] 顧客情報取得エラー:`, error);
            }
          }
          
          if (userId) {
            console.log(`🔄 [API Webhook] サブスクリプション作成によるユーザー更新: ${userId}`);
            
            try {
              const result = await updateSubscriptionStatus(userId, 'active');
              console.log(`✅ [API Webhook] サブスクリプション作成の更新完了: ${userId}, 結果: ${result ? '成功' : '失敗'}`);
            } catch (error) {
              console.error(`❌ [API Webhook] サブスクリプション作成の更新エラー: ${userId}`, error);
            }
          } else {
            console.error(`❌ [API Webhook] ユーザーIDが取得できないため更新をスキップ - サブスクリプションID: ${subscription.id}`);
          }
        } catch (error) {
          console.error(`❌ [API Webhook] サブスクリプション作成の処理エラー:`, error);
        }
        break;
      }

      default: {
        console.log(`📝 [API Webhook] 未処理のイベントタイプ: ${event.type}`);
      }
    }

    console.log('✅ [API Webhook] 処理完了: ' + new Date().toISOString());
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('⛔ [API Webhook] エラー:', error);
    if (error instanceof Error) {
      console.error(`エラーメッセージ: ${error.message}`);
      console.error(`エラースタック: ${error.stack}`);
    }
    
    // 200を返して再試行を防止（エラーは記録済み）
    return NextResponse.json(
      { error: 'Webhook処理中にエラーが発生しました（記録済み）' },
      { status: 200 }
    );
  }
}
