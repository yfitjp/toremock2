import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { COLLECTIONS, setDocument } from './firestore';

// ユーザー登録
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ユーザープロフィールを更新
    await updateProfile(user, { displayName: name });

    // Firestoreにユーザー情報を保存
    await setDocument(COLLECTIONS.USERS, user.uid, {
      name,
      email,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// ログイン
export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error logging in:', error);
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