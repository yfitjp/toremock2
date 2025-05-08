import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';
import { COLLECTIONS, setDocument, getDocument } from './firestore';

export { auth };

// ユーザー登録
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    console.log('Attempting to register user with email:', email);
    
    // Firebase認証が初期化されているか確認
    if (!auth) {
      console.error('Firebase auth is not initialized');
      throw new Error('Firebase auth is not initialized');
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User registered successfully:', user.uid);

    // ユーザープロフィールを更新
    await updateProfile(user, { displayName: name });
    console.log('User profile updated with displayName:', name);

    // Firestoreにユーザー情報を保存
    await setDocument(COLLECTIONS.USERS, user.uid, {
      name,
      email,
      createdAt: new Date(),
    });
    console.log('User data saved to Firestore');

    return user;
  } catch (error: any) {
    console.error('Error registering user:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // エラーメッセージをより詳細に
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('このメールアドレスは既に使用されています');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('メールアドレスの形式が正しくありません');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('パスワードは6文字以上にしてください');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください');
    } else if (error.code === 'auth/configuration-not-found') {
      throw new Error('Firebase設定エラー: プロジェクト設定を確認してください');
    } else {
      throw error;
    }
  }
};

// ログイン
export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    console.log('Attempting to login user with email:', email);
    
    // Firebase認証が初期化されているか確認
    if (!auth) {
      console.error('Firebase auth is not initialized');
      throw new Error('Firebase auth is not initialized');
    }
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in successfully:', result.user.uid);
    return result;
  } catch (error: any) {
    console.error('Error logging in:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // エラーメッセージをより詳細に
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('メールアドレスの形式が正しくありません');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('このアカウントは無効になっています');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('ログイン試行回数が多すぎます。しばらく時間をおいてから再試行してください');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください');
    } else {
      throw error;
    }
  }
};

// Googleでログイン
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    if (!auth) {
      console.error('Firebase auth is not initialized');
      throw new Error('Firebase auth is not initialized');
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Firestoreにユーザー情報が存在するか確認
    const userDoc = await getDocument(COLLECTIONS.USERS, user.uid);
    if (!userDoc) {
      // 新規ユーザーの場合、Firestoreに情報を保存
      await setDocument(COLLECTIONS.USERS, user.uid, {
        name: user.displayName || 'Anonymous',
        email: user.email,
        createdAt: new Date(),
        photoURL: user.photoURL, // プロフィール写真も保存
      });
      console.log('New Google user data saved to Firestore');
    } else {
      // 既存ユーザーの場合、最終ログイン日時やプロフィール写真などを更新することも可能
      // 必要であれば更新処理をここに記述
      await setDocument(COLLECTIONS.USERS, user.uid, {
        lastLoginAt: new Date(), // 例: 最終ログイン日時
        photoURL: user.photoURL,
      }, true); // trueでマージ
      console.log('Existing Google user data updated in Firestore');
    }

    console.log('User signed in with Google successfully:', user.uid);
    return result;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    // エラーコードに応じて適切なメッセージをスローする
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Googleログインのポップアップが閉じられました。');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('複数のログインリクエストが発行されました。');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('ブラウザによってポップアップがブロックされました。ポップアップを許可してください。');
    }
    // 他のFirebaseエラーもハンドルする
    throw error;
  }
};

// ログアウト
export const logoutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// パスワードリセットメールの送信
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// 現在のユーザーを取得
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// ユーザープロフィールの更新
export const updateUserProfile = async (
  user: User,
  displayName?: string | null,
  photoURL?: string | null
): Promise<void> => {
  try {
    await updateProfile(user, { displayName, photoURL });
    
    // Firestoreのユーザー情報も更新
    if (displayName) {
      await setDocument(
        COLLECTIONS.USERS,
        user.uid,
        { name: displayName },
        true
      );
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 