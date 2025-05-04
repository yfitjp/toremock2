"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserSubscribed = exports.hasActiveSubscription = exports.SUBSCRIPTION_PLANS = void 0;
const firebase_1 = require("./firebase");
const firestore_1 = require("firebase/firestore");
// サブスクリプションプランの定義
exports.SUBSCRIPTION_PLANS = {
    FREE: {
        name: 'Free',
        price: 0,
        description: '無料で基本的な模試にアクセスできます。有料模試は個別に購入が必要です。',
        features: [
            '無料模試へのアクセス',
            '各模試の詳細な解説',
            'スコア分析と学習アドバイス',
            '有料模試は個別購入（￥290/模試）',
        ],
    },
    PREMIUM: {
        name: 'Premium',
        price: 1490,
        description: 'すべての模試にアクセスでき、詳細な解説や学習分析機能が利用できます。',
        features: [
            'すべての模試へのアクセス',
            '各模試の詳細な解説',
            'スコア分析と学習アドバイス',
        ],
    },
    ELITE: {
        name: 'Elite',
        price: 5490,
        description: '最高レベルの学習体験を提供する特別なプランです。',
        features: [
            'プレミアムプランのすべての機能',
            'ネイティブ講師によるレッスン',
            '模試の復習に便利な単語帳機能',
            '専門家による専用カリキュラムの作成',
        ],
        availabilityStatus: '受付停止中',
    },
};
// サブスクリプションの状態を確認 (クライアントSDKを使用 - 修正版)
const hasActiveSubscription = async (userId) => {
    if (!userId) {
        console.log('userId is missing, cannot check subscription.');
        return false;
    }
    try {
        // subscriptions コレクションへの参照を取得
        const subscriptionsRef = (0, firestore_1.collection)(firebase_1.db, 'subscriptions');
        // クエリを作成: userId が一致し、status が 'active' のドキュメントを検索
        // 注意: 'trialing' など、他のアクティブとみなすステータスがあれば、それらも考慮に入れる必要があるかもしれません
        // 例: where('status', 'in', ['active', 'trialing'])
        const q = (0, firestore_1.query)(subscriptionsRef, (0, firestore_1.where)('userId', '==', userId), (0, firestore_1.where)('status', '==', 'active'), // 'active' 以外のアクティブステータスも考慮する場合は変更
        (0, firestore_1.limit)(1) // 1つ見つかれば十分なので効率化
        );
        // クエリを実行
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        // 条件に合致するドキュメントが存在するかどうかを返す
        return !querySnapshot.empty; // empty でなければ true (アクティブなサブスクリプションあり)
    }
    catch (error) {
        console.error('サブスクリプション状態確認エラー:', error);
        // エラー発生時は安全のため false を返す
        return false;
    }
};
exports.hasActiveSubscription = hasActiveSubscription;
// isUserSubscribed は hasActiveSubscription を呼んでいるので、クライアントSDK依存
const isUserSubscribed = async (userId) => {
    return await (0, exports.hasActiveSubscription)(userId);
};
exports.isUserSubscribed = isUserSubscribed;
