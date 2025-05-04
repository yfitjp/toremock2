"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const stripe_1 = __importDefault(require("stripe"));
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
// Firebase Admin SDK の初期化 (一度だけ実行)
if (!admin.apps.length) {
    // 環境変数からサービスアカウントキーを読み込む
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        console.error("Firebase Admin SDK initialization error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
        // ここでエラーを投げるか、適切に処理する
        // 例: throw new Error("Firebase Admin SDK configuration error.");
        // エラーを投げない場合、Firebase機能が利用できない可能性がある
    }
    else {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(serviceAccountKey))
            });
            console.log("Firebase Admin SDK initialized successfully.");
        }
        catch (parseError) {
            console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", parseError);
            // パースエラーの処理
        }
    }
    // 環境変数が設定されていない場合、もしくはパースエラーの場合のフォールバックやエラー処理が必要
    // ここでは、初期化されなかった場合に後続の処理でエラーが出る可能性がある
}
const auth = admin.auth();
const adminDb = (0, firestore_1.getFirestore)();
// stripeインスタンス初期化時のエラーチェック
const initStripe = () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEYが設定されていません');
    }
    return new stripe_1.default(secretKey, {
        apiVersion: '2025-02-24.acacia',
    });
};
// エラーハンドリング付きでStripeインスタンスを作成
let stripe;
try {
    stripe = initStripe();
}
catch (error) {
    console.error('Stripe初期化エラー:', error);
}
// サブスクリプションの価格IDを取得
const getPremiumPriceId = () => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
    if (!priceId) {
        throw new Error('NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_IDが設定されていません');
    }
    return priceId;
};
// 模試タイプとPrice IDの対応マップ (環境変数から取得)
const EXAM_PRICE_ID_MAP = {
    'TOEIC': process.env.STRIPE_TOEIC_PRICE_ID,
    'TOEFL': process.env.STRIPE_TOEFL_PRICE_ID,
    'EIKEN': process.env.STRIPE_EIKEN_PRICE_ID,
};
// ベースURLを取得する関数
const getBaseUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl) {
        return baseUrl;
    }
    if (process.env.NODE_ENV === 'production') {
        return 'https://toremock.com'; // 実際のドメインに置き換えてください
    }
    return 'http://localhost:3000';
};
async function POST(request) {
    try {
        if (!stripe) {
            console.error('⛔ [Checkout] Stripeが初期化されていません');
            return server_1.NextResponse.json({ error: 'Stripe APIが初期化されていません' }, { status: 500 });
        }
        const body = await request.json();
        const { userId, priceId, email, examId } = body;
        if (!userId) {
            return server_1.NextResponse.json({ error: 'ユーザーIDが指定されていません' }, { status: 400 });
        }
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return server_1.NextResponse.json({ error: '認証トークンが指定されていません' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(token);
            console.log('認証成功: トークン検証OK - ユーザー:', decodedToken.uid);
        }
        catch (error) {
            console.error('認証エラー:', error);
            return server_1.NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
        }
        if (decodedToken.uid !== userId) {
            return server_1.NextResponse.json({ error: '認証ユーザーとリクエストユーザーが一致しません' }, { status: 403 });
        }
        // Stripe顧客を作成または取得 (共通処理)
        let customer;
        const customers = await stripe.customers.list({ email: email, limit: 1 });
        if (customers.data.length > 0) {
            customer = customers.data[0];
            console.log(`既存の顧客を使用: ${customer.id}`);
        }
        else {
            customer = await stripe.customers.create({ email: email, metadata: { userId: userId } });
            console.log(`新規顧客を作成: ${customer.id}`);
        }
        const baseUrl = getBaseUrl();
        let session;
        // === 個別模試購入フロー ===
        if (examId) {
            console.log(`個別模試購入開始: examId=${examId}`);
            if (!adminDb) {
                throw new Error('Firestore Admin DBが初期化されていません。');
            }
            // Firestoreから模試データを取得
            const examRef = adminDb.collection('exams').doc(examId);
            const examDoc = await examRef.get();
            if (!examDoc.exists) {
                return server_1.NextResponse.json({ error: '指定された模試が見つかりません' }, { status: 404 });
            }
            const examData = examDoc.data();
            const examType = examData?.type;
            if (!examType) {
                return server_1.NextResponse.json({ error: '模試のタイプが設定されていません' }, { status: 500 });
            }
            // 模試タイプに対応するPrice IDを取得
            const examPriceId = EXAM_PRICE_ID_MAP[examType];
            if (!examPriceId) {
                return server_1.NextResponse.json({ error: `タイプ '${examType}' の価格設定が見つかりません` }, { status: 400 });
            }
            console.log(`使用する価格ID (模試): ${examPriceId}`);
            // 一回払い用のCheckout Sessionを作成
            session = await stripe.checkout.sessions.create({
                customer: customer.id,
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: examPriceId,
                        quantity: 1,
                    },
                ],
                mode: 'payment', // ★変更点: paymentモード
                success_url: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`, // ★変更点: 個別購入成功URL
                cancel_url: `${baseUrl}/exams`, // ★変更点: キャンセル時は模試一覧へ
                metadata: {
                    userId,
                    type: 'exam_purchase', // ★変更点: メタデータにタイプ指定
                    examId: examId,
                    email: email, // 必要に応じてメールも記録
                },
            });
            console.log(`✅ [Checkout] 個別模試セッション作成成功: ${session.id}`);
            // === サブスクリプションフロー ===
        }
        else {
            console.log('サブスクリプション作成開始');
            const subscriptionPriceId = priceId || getPremiumPriceId();
            console.log(`使用する価格ID (サブスク): ${subscriptionPriceId}`);
            session = await stripe.checkout.sessions.create({
                customer: customer.id,
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: subscriptionPriceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${baseUrl}/subscription`,
                metadata: {
                    userId,
                    type: 'subscription',
                    plan: 'premium',
                    email: email,
                },
                subscription_data: {
                    metadata: {
                        userId: userId,
                    }
                }
            });
            console.log(`✅ [Checkout] サブスクリプションセッション作成成功: ${session.id}`);
        }
        // 共通のレスポンス
        return server_1.NextResponse.json({
            sessionUrl: session.url,
        });
    }
    catch (error) {
        console.error('⛔ [Checkout] エラー:', error);
        return server_1.NextResponse.json({ error: error instanceof Error ? error.message : 'チェックアウトセッションの作成に失敗しました' }, { status: 500 });
    }
}
