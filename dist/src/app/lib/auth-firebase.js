"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getCurrentUser = exports.sendPasswordReset = exports.logoutUser = exports.loginUser = exports.registerUser = exports.auth = void 0;
const auth_1 = require("firebase/auth");
const firebase_1 = require("./firebase");
Object.defineProperty(exports, "auth", { enumerable: true, get: function () { return firebase_1.auth; } });
const firestore_1 = require("./firestore");
// ユーザー登録
const registerUser = async (email, password, name) => {
    try {
        console.log('Attempting to register user with email:', email);
        // Firebase認証が初期化されているか確認
        if (!firebase_1.auth) {
            console.error('Firebase auth is not initialized');
            throw new Error('Firebase auth is not initialized');
        }
        const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
        const user = userCredential.user;
        console.log('User registered successfully:', user.uid);
        // ユーザープロフィールを更新
        await (0, auth_1.updateProfile)(user, { displayName: name });
        console.log('User profile updated with displayName:', name);
        // Firestoreにユーザー情報を保存
        await (0, firestore_1.setDocument)(firestore_1.COLLECTIONS.USERS, user.uid, {
            name,
            email,
            createdAt: new Date(),
        });
        console.log('User data saved to Firestore');
        return user;
    }
    catch (error) {
        console.error('Error registering user:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        // エラーメッセージをより詳細に
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('このメールアドレスは既に使用されています');
        }
        else if (error.code === 'auth/invalid-email') {
            throw new Error('メールアドレスの形式が正しくありません');
        }
        else if (error.code === 'auth/weak-password') {
            throw new Error('パスワードは6文字以上にしてください');
        }
        else if (error.code === 'auth/network-request-failed') {
            throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください');
        }
        else if (error.code === 'auth/configuration-not-found') {
            throw new Error('Firebase設定エラー: プロジェクト設定を確認してください');
        }
        else {
            throw error;
        }
    }
};
exports.registerUser = registerUser;
// ログイン
const loginUser = async (email, password) => {
    try {
        console.log('Attempting to login user with email:', email);
        // Firebase認証が初期化されているか確認
        if (!firebase_1.auth) {
            console.error('Firebase auth is not initialized');
            throw new Error('Firebase auth is not initialized');
        }
        const result = await (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
        console.log('User logged in successfully:', result.user.uid);
        return result;
    }
    catch (error) {
        console.error('Error logging in:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        // エラーメッセージをより詳細に
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error('メールアドレスまたはパスワードが正しくありません');
        }
        else if (error.code === 'auth/invalid-email') {
            throw new Error('メールアドレスの形式が正しくありません');
        }
        else if (error.code === 'auth/user-disabled') {
            throw new Error('このアカウントは無効になっています');
        }
        else if (error.code === 'auth/too-many-requests') {
            throw new Error('ログイン試行回数が多すぎます。しばらく時間をおいてから再試行してください');
        }
        else if (error.code === 'auth/network-request-failed') {
            throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください');
        }
        else {
            throw error;
        }
    }
};
exports.loginUser = loginUser;
// ログアウト
const logoutUser = async () => {
    try {
        await (0, auth_1.signOut)(firebase_1.auth);
    }
    catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};
exports.logoutUser = logoutUser;
// パスワードリセットメールの送信
const sendPasswordReset = async (email) => {
    try {
        await (0, auth_1.sendPasswordResetEmail)(firebase_1.auth, email);
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};
exports.sendPasswordReset = sendPasswordReset;
// 現在のユーザーを取得
const getCurrentUser = () => {
    return firebase_1.auth.currentUser;
};
exports.getCurrentUser = getCurrentUser;
// ユーザープロフィールの更新
const updateUserProfile = async (user, displayName, photoURL) => {
    try {
        await (0, auth_1.updateProfile)(user, { displayName, photoURL });
        // Firestoreのユーザー情報も更新
        if (displayName) {
            await (0, firestore_1.setDocument)(firestore_1.COLLECTIONS.USERS, user.uid, { name: displayName }, true);
        }
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
exports.updateUserProfile = updateUserProfile;
