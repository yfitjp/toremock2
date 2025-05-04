'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignUpPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const framer_motion_1 = require("framer-motion");
const auth_firebase_1 = require("@/app/lib/auth-firebase");
function SignUpForm() {
    const router = (0, navigation_1.useRouter)();
    const [name, setName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // パスワードの長さチェック（クライアント側でも検証）
        if (password.length < 6) {
            setError('パスワードは6文字以上で入力してください');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('パスワードが一致しません');
            setLoading(false);
            return;
        }
        try {
            await (0, auth_firebase_1.registerUser)(email, password, name);
            router.push('/auth/signin?registered=true');
        }
        catch (error) {
            console.error('登録エラー:', error);
            // Firebase認証エラーメッセージの日本語化
            if (error.code === 'auth/email-already-in-use') {
                setError('このメールアドレスは既に使用されています');
            }
            else if (error.code === 'auth/weak-password') {
                setError('セキュリティのため、パスワードは6文字以上で設定してください');
            }
            else if (error.code === 'auth/invalid-email') {
                setError('メールアドレスの形式が正しくありません');
            }
            else if (error.message) {
                // エラーメッセージがある場合はそれを表示
                setError(error.message);
            }
            else {
                setError('アカウント作成中にエラーが発生しました');
            }
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          新規アカウント登録
        </h2>
        <p className="mt-2 text-center text-sm text-gray-900">
          または{' '}
          <link_1.default href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
            ログイン
          </link_1.default>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>)}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                お名前
              </label>
              <div className="mt-1">
                <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                メールアドレス
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                パスワード
              </label>
              <div className="mt-1">
                <input id="password" name="password" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                <p className="mt-1 text-xs text-gray-500">
                  パスワードは6文字以上で入力してください
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                パスワード（確認）
              </label>
              <div className="mt-1">
                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              </div>
            </div>

            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                <link_1.default href="/terms" className="text-blue-600 hover:text-blue-500">利用規約</link_1.default>と
                <link_1.default href="/privacy" className="text-blue-600 hover:text-blue-500">プライバシーポリシー</link_1.default>に同意します
              </label>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? '登録中...' : '登録する'}
              </button>
            </div>
          </form>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
function SignUpPage() {
    return (<react_1.Suspense fallback={<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            読み込み中...
          </h2>
        </div>
      </div>}>
      <SignUpForm />
    </react_1.Suspense>);
}
