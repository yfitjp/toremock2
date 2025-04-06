import { db as adminDb } from '../firebase-admin';

/**
 * ユーザーのサブスクリプション状態を更新する関数
 * @param userId ユーザーID
 * @param status 更新する状態 ('active'または'inactive')
 * @returns 成功すればtrue、失敗すればfalse
 */
export async function updateSubscriptionStatus(userId: string, status: 'active' | 'inactive') {
  if (!userId) {
    console.error('ユーザーIDが指定されていません');
    throw new Error('ユーザーIDは必須です');
  }

  console.log(`[サーバー] サブスクリプション更新開始 - ユーザーID: ${userId}, 状態: ${status}`);

  try {
    // Firestoreが正しく初期化されているか確認
    if (!adminDb) {
      console.error('Firestore Adminが初期化されていません');
      throw new Error('データベース接続エラー');
    }

    // ユーザードキュメントへの参照
    const userRef = adminDb.collection('users').doc(userId);
    
    // ユーザードキュメントの存在を確認
    const userDoc = await userRef.get();
    
    // ユーザードキュメントが存在しない場合は新規作成
    if (!userDoc.exists) {
      console.log(`[サーバー] ユーザードキュメントが存在しないため作成します - ユーザーID: ${userId}`);
      
      // 基本的なユーザー情報を設定
      const now = new Date().toISOString();
      const initialUserData = {
        uid: userId,
        subscriptionStatus: status,
        subscriptions: {
          premium: {
            status,
            startDate: now,
            updatedAt: now
          }
        },
        createdAt: now,
        updatedAt: now
      };
      
      try {
        // ユーザードキュメントを作成
        await userRef.set(initialUserData);
        console.log(`[サーバー] ユーザードキュメント作成成功 - ユーザーID: ${userId}`);
        return true;
      } catch (error) {
        console.error(`[サーバー] ユーザードキュメント作成エラー - ユーザーID: ${userId}:`, error);
        throw error;
      }
    }
    
    // ユーザードキュメントが存在する場合は更新
    console.log(`[サーバー] 既存ユーザードキュメント更新 - ユーザーID: ${userId}`);
    
    // トランザクションを使用して安全に更新
    const result = await adminDb.runTransaction(async (transaction) => {
      // トランザクション内でユーザードキュメントを再取得
      const latestUserDoc = await transaction.get(userRef);
      
      if (!latestUserDoc.exists) {
        console.error(`[サーバー] トランザクション内でユーザードキュメントが見つかりません - ユーザーID: ${userId}`);
        throw new Error('ユーザーが見つかりません');
      }
      
      const userData = latestUserDoc.data() || {};
      console.log(`[サーバー] 現在のユーザーデータ:`, JSON.stringify({
        uid: userId,
        email: userData?.email,
        subscriptionStatus: userData?.subscriptionStatus,
        hasSubscriptions: !!userData?.subscriptions
      }));
      
      // 現在のサブスクリプション情報を取得
      const currentSubscriptions = userData?.subscriptions || {};
      
      // 更新データを準備
      const now = new Date().toISOString();
      const updateData = {
        // subscriptionsオブジェクト全体を更新
        subscriptions: {
          ...currentSubscriptions,
          premium: {
            status,
            updatedAt: now,
            // 有効化の場合は開始日も設定 (既存の開始日があれば保持)
            ...(status === 'active' && {
              startDate: currentSubscriptions?.premium?.startDate || now
            }),
          }
        },
        // トップレベルのフィールドも更新
        subscriptionStatus: status,
        updatedAt: now,
      };
      
      console.log(`[サーバー] 更新データ:`, JSON.stringify(updateData));
      
      // トランザクション内でドキュメントを更新
      transaction.update(userRef, updateData);
      
      return true;
    });
    
    console.log(`[サーバー] サブスクリプション状態更新成功 - ユーザーID: ${userId}`);
    
    // 更新後のデータを確認
    try {
      const updatedDoc = await userRef.get();
      if (updatedDoc.exists) {
        const updatedData = updatedDoc.data();
        console.log(`[サーバー] 更新後のサブスクリプション状態:`, 
          updatedData?.subscriptionStatus,
          updatedData?.subscriptions?.premium?.status
        );
      }
    } catch (error) {
      // 確認のためのエラーは致命的ではないのでスローしない
      console.error(`[サーバー] 更新後の確認エラー - ユーザーID: ${userId}:`, error);
    }
    
    return result;
  } catch (error) {
    console.error(`[サーバー] サブスクリプション更新エラー - ユーザーID: ${userId}:`, error);
    
    // Vercelのログには詳細なエラー情報を出力
    if (error instanceof Error) {
      console.error(`エラーメッセージ: ${error.message}`);
      console.error(`エラースタック: ${error.stack}`);
    }
    
    throw error;
  }
} 