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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
// Firebase Admin SDKの初期化
function initFirebaseAdmin() {
    // 環境変数のチェック
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    // 環境変数の存在確認
    if (!projectId || !clientEmail || !privateKey) {
        console.error('Firebase Admin初期化に必要な環境変数が設定されていません:', {
            projectId: !!projectId,
            clientEmail: !!clientEmail,
            privateKey: !!privateKey,
        });
        throw new Error('Firebase Admin初期化に必要な環境変数が不足しています');
    }
    // Firebase Admin SDKの初期化
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    // 改行コードの処理
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin初期化成功:', {
                projectId,
                clientEmail: clientEmail.substring(0, 5) + '...',
            });
        }
        catch (error) {
            console.error('Firebase Admin初期化エラー:', error);
            throw new Error('Firebase Admin SDKの初期化に失敗しました');
        }
    }
    else {
        console.log('Firebase Admin SDKは既に初期化されています');
    }
    return admin;
}
// 初期化を実行
const adminApp = initFirebaseAdmin();
// Firestoreとアドミン認証をエクスポート
exports.db = adminApp.firestore();
exports.auth = adminApp.auth();
exports.default = adminApp;
