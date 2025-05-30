"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const stripe_1 = __importDefault(require("stripe"));
const firebase_admin_1 = require("@/app/lib/firebase-admin");
const firebase_admin_2 = require("@/app/lib/firebase-admin");
// Stripeインスタンスの初期化
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
});
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
        if (decodedToken.uid !== userId) {
            return server_1.NextResponse.json({ error: '認証ユーザーとリクエストユーザーが一致しません' }, { status: 403 });
        }
        console.log(`サブスクリプション管理ポータル作成開始 - ユーザーID: ${userId}`);
        // ユーザードキュメントを取得
        const userRef = firebase_admin_2.db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.error(`ユーザーが見つかりません - ユーザーID: ${userId}`);
            return server_1.NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
        }
        // Stripe上で顧客を検索
        const userData = userDoc.data();
        const email = userData?.email;
        if (!email) {
            console.error(`ユーザーにメールアドレスが登録されていません - ユーザーID: ${userId}`);
            return server_1.NextResponse.json({ error: 'ユーザー情報が不完全です' }, { status: 400 });
        }
        // 顧客情報の取得
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });
        if (customers.data.length === 0) {
            console.error(`Stripe顧客が見つかりません - ユーザーID: ${userId}, Email: ${email}`);
            return server_1.NextResponse.json({ error: 'サブスクリプション情報が見つかりません' }, { status: 404 });
        }
        const customer = customers.data[0];
        console.log(`Stripe顧客情報取得成功 - ID: ${customer.id}`);
        // ポータルセッションの設定
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
        const returnUrl = `${baseUrl}/mypage`;
        // 顧客ポータルセッションの作成
        const session = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: returnUrl,
            // 以下はオプション設定
            flow_data: {
                type: 'payment_method_update',
            },
        });
        console.log(`カスタマーポータルセッション作成成功 - URL: ${session.url}`);
        return server_1.NextResponse.json({
            success: true,
            url: session.url
        });
    }
    catch (error) {
        console.error('カスタマーポータルセッション作成エラー:', error);
        return server_1.NextResponse.json({ error: error instanceof Error ? error.message : 'カスタマーポータルの作成に失敗しました' }, { status: 500 });
    }
}
