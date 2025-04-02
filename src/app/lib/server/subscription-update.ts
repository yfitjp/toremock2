import { db as adminDb } from '../firebase-admin';

export async function updateSubscriptionStatus(userId: string, status: 'active' | 'inactive') {
  try {
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('ユーザーが見つかりません');
    }

    const userData = userDoc.data();
    const currentSubscriptions = userData?.subscriptions || {};

    // サブスクリプション状態を更新
    await userRef.update({
      subscriptions: {
        ...currentSubscriptions,
        premium: {
          status,
          updatedAt: new Date().toISOString(),
        },
      },
    });

    console.log(`サブスクリプション状態を更新しました - ユーザーID: ${userId}, 状態: ${status}`);
  } catch (error) {
    console.error('サブスクリプション状態の更新エラー:', error);
    throw error;
  }
} 