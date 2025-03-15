'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import { logoutUser } from '@/app/lib/auth-firebase';
import { hasActiveSubscription } from '@/app/lib/subscriptions';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        try {
          console.log('Navbar: サブスクリプション確認開始 - ユーザーID:', user.uid);
          const hasSubscription = await hasActiveSubscription(user.uid);
          console.log('Navbar: サブスクリプション状態:', hasSubscription);
          setHasSubscription(hasSubscription);
        } catch (error) {
          console.error('サブスクリプション確認エラー:', error);
        } finally {
          setCheckingSubscription(false);
        }
      } else if (!loading) {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [user, loading]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logoutUser();
      // ホームページにリダイレクト
      window.location.href = '/';
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/toremock-logo.png"
                  alt="ToreMock Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  ToreMock
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/exams"
                className="border-transparent text-gray-900 hover:text-blue-600 hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                模試一覧
              </Link>
              {user && (
                <>
                  <Link
                    href="/mypage"
                    className="border-transparent text-gray-900 hover:text-blue-600 hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  >
                    マイページ
                  </Link>
                  {!hasSubscription && (
                    <Link
                      href="/subscription"
                      className="border-transparent text-gray-900 hover:text-blue-600 hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                    >
                      プレミアムプラン
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {loading || checkingSubscription ? (
              <div className="text-gray-500 px-3 py-2 text-sm font-medium">
                読み込み中...
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {hasSubscription && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    プレミアム会員
                  </span>
                )}
                <span className="text-gray-900 text-sm">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                ログイン
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">メニューを開く</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/exams"
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-900 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
          >
            模試一覧
          </Link>
          {user && (
            <>
              <Link
                href="/mypage"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-900 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
              >
                マイページ
              </Link>
              {!hasSubscription && (
                <Link
                  href="/subscription"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-900 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
                >
                  プレミアムプラン
                </Link>
              )}
            </>
          )}
          {loading || checkingSubscription ? (
            <div className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500">
              読み込み中...
            </div>
          ) : user ? (
            <button
              onClick={handleSignOut}
              className="w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-900 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
            >
              ログアウト
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-blue-500 text-blue-600 bg-blue-50"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 