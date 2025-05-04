"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const firebase_admin_1 = require("@/app/lib/firebase-admin");
const subscriptions_admin_1 = require("@/app/lib/subscriptions-admin");
async function GET(req) {
    try {
        // 1. 認証トークンを取得・検証
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return new server_1.NextResponse('認証が必要です', { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await firebase_admin_1.auth.verifyIdToken(idToken);
        const userId = decodedToken.uid;
        // 2. Admin SDK を使ってサブスクリプション情報を取得
        const subscription = await (0, subscriptions_admin_1.getUserActiveSubscriptionAdmin)(userId);
        // 3. 結果を JSON で返す
        return server_1.NextResponse.json(subscription); // subscription が null の場合もそのまま返す
    }
    catch (error) {
        console.error('[API /subscription/status] Error:', error);
        if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
            return new server_1.NextResponse('認証トークンが無効です', { status: 401 });
        }
        return new server_1.NextResponse('サブスクリプション情報の取得中にエラーが発生しました', { status: 500 });
    }
}
