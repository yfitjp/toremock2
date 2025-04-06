import * as admin from 'firebase-admin';

// Firebase Admin SDKの初期化
function initFirebaseAdmin() {
  // 環境変数のチェック
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
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
    } catch (error) {
      console.error('Firebase Admin初期化エラー:', error);
      throw new Error('Firebase Admin SDKの初期化に失敗しました');
    }
  } else {
    console.log('Firebase Admin SDKは既に初期化されています');
  }

  return admin;
}

// 初期化を実行
const adminApp = initFirebaseAdmin();

// Firestoreとアドミン認証をエクスポート
export const db = adminApp.firestore();
export const auth = adminApp.auth();
export default adminApp; 