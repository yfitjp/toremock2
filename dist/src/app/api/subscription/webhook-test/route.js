"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const subscription_update_1 = require("@/app/lib/server/subscription-update");
const firebase_admin_1 = require("@/app/lib/firebase-admin");
async function POST(request) {
    try {
        // リクエストボディを取得
        const body = await request.json();
        const { userId } = body;
        // パラメータの検証
        if (!userId) {
            return server_1.NextResponse.json({ error: 'ユーザーIDが指定されていません' }, { status: 400 });
        }
        // 認証トークンを取得
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return server_1.NextResponse.json({ error: '認証トークンが指定されていません' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await firebase_admin_1.auth.verifyIdToken(token);
            console.log('認証成功: トークン検証OK - ユーザー:', decodedToken.uid);
        }
        catch (error) {
            console.error('認証エラー:', error);
            return server_1.NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
        }
        console.log(`[テスト] サブスクリプション手動更新開始 - ユーザーID: ${userId}`);
        try {
            // サブスクリプションの状態を'active'に更新
            const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, 'active');
            if (result) {
                console.log(`[テスト] サブスクリプション状態更新成功 - ユーザーID: ${userId}`);
                return server_1.NextResponse.json({
                    success: true,
                    message: 'サブスクリプションを有効化しました',
                    userId: userId
                });
            }
            else {
                console.error(`[テスト] サブスクリプション状態更新失敗 - ユーザーID: ${userId}`);
                return server_1.NextResponse.json({ error: 'サブスクリプションの更新に失敗しました' }, { status: 500 });
            }
        }
        catch (error) {
            console.error(`[テスト] サブスクリプション更新エラー:`, error);
            return server_1.NextResponse.json({ error: error instanceof Error ? error.message : 'サブスクリプションの更新に失敗しました' }, { status: 500 });
        }
    }
    catch (error) {
        console.error('[テスト] 予期しないエラー:', error);
        return server_1.NextResponse.json({ error: error instanceof Error ? error.message : 'サブスクリプションの更新に失敗しました' }, { status: 500 });
    }
}
