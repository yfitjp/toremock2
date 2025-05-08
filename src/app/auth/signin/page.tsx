'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { loginUser, signInWithGoogle } from '@/app/lib/auth-firebase';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 新規登録後のリダイレクトの場合、メッセージを表示
  const registered = searchParams.get('registered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await loginUser(email, password);
      router.push('/mypage');
    } catch (error: any) {
      console.error('ログインエラー:', error);
      
      // エラーコードに基づいてメッセージを表示
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMessage('メールアドレスまたはパスワードが正しくありません');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('メールアドレスの形式が正しくありません');
      } else if (error.code === 'auth/user-disabled') {
        setErrorMessage('このアカウントは無効になっています');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('ログイン試行回数が多すぎます。しばらく時間をおいてから再試行してください');
      } else if (error.message) {
        // エラーメッセージがある場合はそれを表示
        setErrorMessage(error.message);
      } else {
        setErrorMessage('ログイン中にエラーが発生しました');
      }
      
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage('');
    try {
      await signInWithGoogle();
      router.push('/mypage');
    } catch (error: any) {
      console.error('Googleログインエラー:', error);
      if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Googleログイン中にエラーが発生しました');
      }
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          アカウントにログイン
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              アカウントが作成されました。ログインしてください。
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {googleLoading ? (
                '処理中...'
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 118.3 512 0 393.7 0 256S118.3 0 244 0c69.8 0 133 28.1 178.5 74.4L383 128H244c-66.2 0-120 53.8-120 120s53.8 120 120 120c58.4 0 108.1-41.8 117.4-96H244v-64h209.4c12.3 50.3 16.2 101.5 16.2 141.8z"></path></svg>
                  Googleでログイン
                </>
              )}
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">またはメールアドレスでログイン</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  パスワードは6文字以上です
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  ログイン状態を保持
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  パスワードをお忘れですか？
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-900">
            アカウントをお持ちでないですか？{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              新規登録
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            読み込み中...
          </h2>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}