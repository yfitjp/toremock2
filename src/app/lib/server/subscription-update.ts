import { db as adminDb } from '../firebase-admin';

export async function updateSubscriptionStatus(userId: string, status: 'active' | 'inactive') {
  try {
    console.log(`サブスクリプション更新処理開始 - ユーザーID: ${userId}, 状態: ${status}`);

    // ユーザードキュメントへの参照
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`ユーザーが見つかりません - ユーザーID: ${userId}`);
      throw new Error('ユーザーが見つかりません');
    }

    console.log(`ユーザードキュメント取得成功 - ユーザーID: ${userId}`);
    const userData = userDoc.data();
    
    // 現在のサブスクリプション情報
    const currentSubscriptions = userData?.subscriptions || {};
    console.log(`現在のサブスクリプション情報:`, JSON.stringify(currentSubscriptions));

    // 更新データ準備
    const updateData = {
      subscriptions: {
        ...currentSubscriptions,
        premium: {
          status,
          updatedAt: new Date().toISOString(),
        },
      },
      // ルートレベルのサブスクリプション状態も更新
      subscriptionStatus: status,
      updatedAt: new Date().toISOString(),
    };

    console.log(`更新データ準備完了:`, JSON.stringify(updateData));

    // ドキュメント更新
    await userRef.update(updateData);
    console.log(`サブスクリプション状態を更新しました - ユーザーID: ${userId}, 状態: ${status}`);

    // 更新後の確認
    const updatedDoc = await userRef.get();
    console.log(`更新後のユーザーデータ:`, JSON.stringify(updatedDoc.data()));

    return true;
  } catch (error) {
    console.error('サブスクリプション状態の更新エラー:', error);
    throw error;
  }
} 