"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const firebase_admin_1 = require("@/app/lib/firebase-admin");
const firebase_admin_2 = require("@/app/lib/firebase-admin");
async function GET(req, { params }) {
    try {
        // 認証ヘッダーからトークンを取得
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return new server_1.NextResponse('認証が必要です', { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await firebase_admin_1.auth.verifyIdToken(idToken);
        const userId = decodedToken.uid;
        // 購入履歴の確認
        const purchaseQuery = await firebase_admin_2.db.collection('purchases')
            .where('userId', '==', userId)
            .where('examId', '==', params.id)
            .get();
        if (purchaseQuery.empty) {
            return server_1.NextResponse.json({ status: 'none' });
        }
        const purchaseDoc = purchaseQuery.docs[0];
        const purchaseData = purchaseDoc.data();
        return server_1.NextResponse.json({ status: purchaseData.status });
    }
    catch (error) {
        console.error('購入状態確認エラー:', error);
        return new server_1.NextResponse(error instanceof Error ? error.message : '内部サーバーエラー', { status: 500 });
    }
}
