"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscriptionStatus = updateSubscriptionStatus;
const firebase_admin_1 = require("../firebase-admin");
/**
 * ユーザーのサブスクリプション状態を更新する関数
 * @param userId ユーザーID
 * @param status 更新する状態 ('active'または'inactive')
 * @returns 成功すればtrue、失敗すればfalse
 */
async function updateSubscriptionStatus(userId, status) {
    if (!userId) {
        console.error('[Subscription Update] エラー: ユーザーIDが指定されていません');
        throw new Error('ユーザーIDは必須です');
    }
    console.log(`[Subscription Update] 開始 - ユーザーID: ${userId}, ステータス: ${status}`);
    try {
        // usersコレクションへの更新試行ログ
        console.log(`[Subscription Update] usersコレクション更新試行 - ユーザーID: ${userId}, 更新内容:`, {
            subscriptionStatus: status,
        });
        try {
            await firebase_admin_1.db.collection('users').doc(userId).update({
                subscriptionStatus: status,
                updatedAt: new Date(),
            });
            console.log(`[Subscription Update] usersコレクション更新成功 - ユーザーID: ${userId}`);
        }
        catch (userUpdateError) {
            console.error(`[Subscription Update] usersコレクション更新エラー - ユーザーID: ${userId}:`, userUpdateError);
            // エラー詳細をログに出力
            if (userUpdateError instanceof Error && 'code' in userUpdateError) {
                console.error(`   Firebaseエラーコード: ${userUpdateError.code}`);
            }
            throw userUpdateError; // エラーを再スローして上位に伝える
        }
        // subscriptionsコレクションへの更新試行ログ
        const subscriptionRef = firebase_admin_1.db.collection('subscriptions').doc(userId);
        const subscriptionData = {
            status,
            userId,
            updatedAt: new Date(),
        };
        console.log(`[Subscription Update] subscriptionsコレクション更新/作成試行 - ユーザーID: ${userId}, 更新内容:`, subscriptionData);
        try {
            // ドキュメントが存在するか確認
            const subscriptionDoc = await subscriptionRef.get();
            if (subscriptionDoc.exists) {
                // 既存のドキュメントを更新
                console.log(`[Subscription Update] subscriptionsコレクション更新実行 - ユーザーID: ${userId}`);
                await subscriptionRef.update(subscriptionData);
                console.log(`[Subscription Update] subscriptionsコレクション更新完了 - ユーザーID: ${userId}`);
            }
            else {
                // 新規ドキュメントを作成
                console.log(`[Subscription Update] subscriptionsコレクション新規作成実行 - ユーザーID: ${userId}`);
                await subscriptionRef.set({
                    ...subscriptionData,
                    createdAt: new Date(),
                });
                console.log(`[Subscription Update] subscriptionsコレクション新規作成完了 - ユーザーID: ${userId}`);
            }
        }
        catch (subUpdateError) {
            console.error(`[Subscription Update] subscriptionsコレクション更新/作成エラー - ユーザーID: ${userId}:`, subUpdateError);
            // エラー詳細をログに出力
            if (subUpdateError instanceof Error && 'code' in subUpdateError) {
                console.error(`   Firebaseエラーコード: ${subUpdateError.code}`);
            }
            throw subUpdateError; // エラーを再スローして上位に伝える
        }
        console.log(`[Subscription Update] 完了 - ユーザーID: ${userId}`);
        return true;
    }
    catch (error) {
        // このトップレベルcatchは、上記の個別catchで捕捉されなかった予期せぬエラー用
        console.error(`[Subscription Update] 予期せぬエラー - ユーザーID: ${userId}:`, error);
        if (error instanceof Error && 'code' in error) {
            console.error(`   Firebaseエラーコード: ${error.code}`);
        }
        throw error;
    }
}
