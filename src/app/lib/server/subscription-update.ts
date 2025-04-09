import { db } from '../firebase-admin';

/**
 * ユーザーのサブスクリプション状態を更新する関数
 * @param userId ユーザーID
 * @param status 更新する状態 ('active'または'inactive')
 * @returns 成功すればtrue、失敗すればfalse
 */
export async function updateSubscriptionStatus(
  userId: string,
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
) {
  if (!userId) {
    console.error('ユーザーIDが指定されていません');
    throw new Error('ユーザーIDは必須です');
  }

  console.log(`[Subscription Update] 開始 - ユーザーID: ${userId}, ステータス: ${status}`);

  try {
    // usersコレクションの更新
    await db.collection('users').doc(userId).update({
      subscriptionStatus: status,
      updatedAt: new Date(),
    });

    // subscriptionsコレクションの更新
    const subscriptionRef = db.collection('subscriptions').doc(userId);
    const subscriptionData = {
      status,
      userId,
      updatedAt: new Date(),
    };

    // ドキュメントが存在するか確認
    const subscriptionDoc = await subscriptionRef.get();
    if (subscriptionDoc.exists) {
      // 既存のドキュメントを更新
      await subscriptionRef.update(subscriptionData);
      console.log(`[Subscription Update] subscriptionsコレクション更新完了 - ユーザーID: ${userId}`);
    } else {
      // 新規ドキュメントを作成
      await subscriptionRef.set({
        ...subscriptionData,
        createdAt: new Date(),
      });
      console.log(`[Subscription Update] subscriptionsコレクション新規作成 - ユーザーID: ${userId}`);
    }

    console.log(`[Subscription Update] 完了 - ユーザーID: ${userId}`);
    return true;
  } catch (error) {
    console.error(`[Subscription Update] エラー - ユーザーID: ${userId}:`, error);
    throw error;
  }
} 