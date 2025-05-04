"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const subscription_update_1 = require("@/app/lib/server/subscription-update");
// 簡易的なAPIキー認証（本来はもっと安全な方法を使用すべき）
const API_KEY = process.env.ADMIN_API_KEY;
async function POST(request) {
    try {
        // APIキーの検証
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ') || authHeader.split('Bearer ')[1] !== API_KEY) {
            console.error('認証エラー: 無効なAPIキー');
            return server_1.NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
        }
        // リクエストボディを取得
        const body = await request.json();
        const { userId } = body;
        // パラメータの検証
        if (!userId) {
            return server_1.NextResponse.json({ error: 'ユーザーIDが指定されていません' }, { status: 400 });
        }
        console.log(`[管理者] サブスクリプション手動更新開始 - ユーザーID: ${userId}`);
        try {
            // サブスクリプションの状態を'active'に更新
            const result = await (0, subscription_update_1.updateSubscriptionStatus)(userId, 'active');
            if (result) {
                console.log(`[管理者] サブスクリプション状態更新成功 - ユーザーID: ${userId}`);
                return server_1.NextResponse.json({
                    success: true,
                    message: 'サブスクリプションを有効化しました',
                    userId: userId
                });
            }
            else {
                console.error(`[管理者] サブスクリプション状態更新失敗 - ユーザーID: ${userId}`);
                return server_1.NextResponse.json({ error: 'サブスクリプションの更新に失敗しました' }, { status: 500 });
            }
        }
        catch (error) {
            console.error(`[管理者] サブスクリプション更新エラー:`, error);
            return server_1.NextResponse.json({ error: error instanceof Error ? error.message : 'サブスクリプションの更新に失敗しました' }, { status: 500 });
        }
    }
    catch (error) {
        console.error('[管理者] 予期しないエラー:', error);
        return server_1.NextResponse.json({ error: error instanceof Error ? error.message : 'サブスクリプションの更新に失敗しました' }, { status: 500 });
    }
}
