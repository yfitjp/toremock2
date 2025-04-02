import * as admin from 'firebase-admin';

// 環境変数のバリデーション
const validateEnvVariables = () => {
  const requiredEnvVars = {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please set these variables in your environment or .env file.'
    );
  }
};

// すでに初期化されているかどうかを確認
if (!admin.apps.length) {
  try {
    validateEnvVariables();
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    
    console.log('Firebase Admin初期化成功');
  } catch (error) {
    console.error('Firebase Admin初期化エラー:', error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin; 