'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import PurchaseHistory from '@/app/components/PurchaseHistory';
import SubscriptionStatus from '@/app/components/SubscriptionStatus';
import SubscriptionManagement from '@/app/components/SubscriptionManagement';
import SubscriptionDebugTools from '@/app/components/SubscriptionDebugTools';
import { User, Bell, Lock, CreditCard, HelpCircle, LogOut, Settings, Heart, ClipboardList, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { logoutUser } from '@/app/lib/auth-firebase';
import LoadingSpinner from '../components/LoadingSpinner';

// 設定サブセクションの型定義
type SettingSection = 'profile' | 'notifications' | 'password' | 'subscription' | 'help' | 'logout';

export default function MyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [activeSettingSection, setActiveSettingSection] = useState<SettingSection>('profile');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 設定メニューの開閉状態

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?callbackUrl=/mypage');
    }
  }, [user, loading, router]);

  // ログアウト処理関数
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logoutUser();
      // ホームページにリダイレクト
      router.push('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      // エラーメッセージを表示するなど
      alert('ログアウト中にエラーが発生しました。');
    }
  };

  // 設定メニューの開閉を切り替える関数
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    if (!isSettingsOpen) {
      setActiveSection('settings');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.displayName || user.email?.split('@')[0] || 'ユーザー';

  // ダミーデータ
  const dummyExamHistory = [
    { id: 1, name: "TOEIC® L&R TEST 模試 Vol.3", date: "2024年5月15日", score: "850 / 990", link: "/results/1" },
    { id: 2, name: "英検®準1級 模試パック 第2回", date: "2024年4月28日", score: "合格", link: "/results/2" },
    { id: 3, name: "TOEFL iBT® 実践模試 B", date: "2024年4月10日", score: "95 / 120", link: "/results/3" },
  ];

  const dummyFavoriteExams = [
    { id: 1, name: "TOEIC® L&R TEST 模試 Vol.4", link: "/exams/toeic/vol4" },
    { id: 2, name: "英検®1級 模試パック 第1回", link: "/exams/eiken/1-1" },
  ];

  // --- スタイル定義 ---
  const baseLinkClasses = "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150 w-full text-left";
  const activeLinkClasses = "flex items-center px-4 py-3 text-blue-700 bg-blue-50 rounded-md font-semibold w-full text-left";

  const baseSettingLinkClasses = "flex items-center p-3 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out w-full text-left";
  const activeSettingLinkClasses = "flex items-center p-3 rounded-lg bg-gray-100 text-blue-700 font-medium transition duration-150 ease-in-out w-full text-left";

  // --- 設定セクションのコンテンツ描画関数 ---
  const renderSettingContent = (section: SettingSection) => {
    switch (section) {
      case 'profile':
        return (
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">プロフィール編集</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">表示名</label>
                <input type="text" name="displayName" id="displayName" defaultValue={userName} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
              </div>
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">更新</button>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">通知設定</h3>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <input id="email-notifications" name="email-notifications" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">新しい模試に関するメール通知を受け取る</label>
              </div>
            </div>
          </div>
        );
      case 'password':
        return (
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">パスワード変更</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">現在のパスワード</label>
                <input type="password" name="current-password" id="current-password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">新しいパスワード</label>
                <input type="password" name="new-password" id="new-password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
              </div>
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">変更</button>
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">サブスクリプション管理</h3>
            <SubscriptionManagement />
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-base font-medium text-gray-800 mb-2">開発用デバッグツール</h4>
                <SubscriptionDebugTools />
              </div>
            )}
          </div>
        );
      case 'help':
        return (
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ヘルプ & サポート</h3>
            <p className="text-gray-600 mb-2">ご不明な点がございましたら、以下のFAQをご覧いただくか、サポートまでお問い合わせください。</p>
            <Link href="/faq" className="text-blue-600 hover:underline">よくある質問を見る</Link>
          </div>
        );
      case 'logout':
        return (
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ログアウト</h3>
            <p className="text-gray-600 mb-4">本当にログアウトしますか？</p>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              ログアウトする
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // --- メインセクションの描画関数 ---
  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <motion.section
            key="account"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              アカウント情報
            </h2>
            <div className="space-y-3 mb-6">
              <p>
                <span className="font-medium text-gray-500 text-sm">お名前:</span>
                <br />
                <span className="text-gray-800">{userName}</span>
              </p>
              <p>
                <span className="font-medium text-gray-500 text-sm">メールアドレス:</span>
                <br />
                <span className="text-gray-800 break-all">{user.email}</span>
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-base font-medium text-gray-700 mb-2">サブスクリプション状態</h3>
              <SubscriptionStatus />
            </div>
          </motion.section>
        );
      case 'settings':
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800 flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-500" />
              設定
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <nav className="md:w-48 flex-shrink-0 space-y-1">
                <button onClick={() => setActiveSettingSection('profile')} className={activeSettingSection === 'profile' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                  <User className="mr-3 h-5 w-5" /> プロフィール
                </button>
                <button onClick={() => setActiveSettingSection('notifications')} className={activeSettingSection === 'notifications' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                  <Bell className="mr-3 h-5 w-5" /> 通知
                </button>
                <button onClick={() => setActiveSettingSection('password')} className={activeSettingSection === 'password' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                  <Lock className="mr-3 h-5 w-5" /> パスワード
                </button>
                <button onClick={() => setActiveSettingSection('subscription')} className={activeSettingSection === 'subscription' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                  <CreditCard className="mr-3 h-5 w-5" /> サブスクリプション
                </button>
                <button onClick={() => setActiveSettingSection('help')} className={activeSettingSection === 'help' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                   <HelpCircle className="mr-3 h-5 w-5" /> ヘルプ
                </button>
                <button onClick={() => setActiveSettingSection('logout')} className={activeSettingSection === 'logout' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                   <LogOut className="mr-3 h-5 w-5" /> ログアウト
                </button>
              </nav>
              <div className="flex-grow md:border-l md:pl-6">
                 {renderSettingContent(activeSettingSection)}
              </div>
            </div>
          </motion.div>
        );
      case 'favorites':
        return (
          <motion.section
            key="favorites"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pink-500" />
              お気に入り模試
            </h2>
            <div className="space-y-3">
              {dummyFavoriteExams.length > 0 ? (
                dummyFavoriteExams.map(exam => (
                  <div key={exam.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <span className="text-sm text-gray-700 truncate pr-2">{exam.name}</span>
                    <Link href={exam.link} className="text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap">
                      模試を見る
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">お気に入りの模試はありません。</p>
              )}
            </div>
          </motion.section>
        );
      case 'history':
        return (
          <motion.section
            key="history"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-indigo-500" />
              受験履歴
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {dummyExamHistory.length > 0 ? (
                dummyExamHistory.map(exam => (
                  <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out border-b last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                      <p className="text-xs text-gray-500">{exam.date} - スコア: {exam.score}</p>
                    </div>
                    <Link href={exam.link} className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap">
                      詳細を見る
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">受験履歴はありません。</p>
              )}
            </div>
            {dummyExamHistory.length > 3 && (
              <div className="mt-4 text-center">
                <Link href="/history/exams" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  全ての受験履歴を見る →
                </Link>
              </div>
            )}
          </motion.section>
        );
      case 'purchase':
        return (
          <motion.section
            key="purchase"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-purple-500" />
              購入履歴
            </h2>
            <PurchaseHistory />
          </motion.section>
        );
      default:
        return null;
    }
  };

  // モバイル用ナビゲーションの設定メニュー部分を修正
  const renderMobileSettingsButton = () => (
    <div className="relative">
      <button
        onClick={toggleSettings}
        className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
          activeSection === 'settings' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Settings className="h-5 w-5 mr-2" />
        設定
      </button>
      {isSettingsOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10"
        >
          <div className="space-y-1">
            <button
              onClick={() => setActiveSettingSection('profile')}
              className={`w-full text-left px-4 py-2 text-sm ${
                activeSettingSection === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="inline-block mr-2 h-4 w-4" />
              プロフィール
            </button>
            {activeSettingSection === 'profile' && (
              <div className="px-4 py-2">
                {renderSettingContent('profile')}
              </div>
            )}
            <button
              onClick={() => setActiveSettingSection('notifications')}
              className={`w-full text-left px-4 py-2 text-sm ${
                activeSettingSection === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell className="inline-block mr-2 h-4 w-4" />
              通知
            </button>
            {activeSettingSection === 'notifications' && (
              <div className="px-4 py-2">
                {renderSettingContent('notifications')}
              </div>
            )}
            <button
              onClick={() => setActiveSettingSection('password')}
              className={`w-full text-left px-4 py-2 text-sm ${
                activeSettingSection === 'password' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lock className="inline-block mr-2 h-4 w-4" />
              パスワード
            </button>
            {activeSettingSection === 'password' && (
              <div className="px-4 py-2">
                {renderSettingContent('password')}
              </div>
            )}
            <button
              onClick={() => setActiveSettingSection('subscription')}
              className={`w-full text-left px-4 py-2 text-sm ${
                activeSettingSection === 'subscription' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="inline-block mr-2 h-4 w-4" />
              サブスクリプション
            </button>
            {activeSettingSection === 'subscription' && (
              <div className="px-4 py-2">
                {renderSettingContent('subscription')}
              </div>
            )}
            <button
              onClick={() => setActiveSettingSection('help')}
              className={`w-full text-left px-4 py-2 text-sm ${
                activeSettingSection === 'help' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="inline-block mr-2 h-4 w-4" />
              ヘルプ
            </button>
            {activeSettingSection === 'help' && (
              <div className="px-4 py-2">
                {renderSettingContent('help')}
              </div>
            )}
            <button
              onClick={() => setActiveSettingSection('logout')}
              className={`w-full text-left px-4 py-2 text-sm ${
                activeSettingSection === 'logout' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LogOut className="inline-block mr-2 h-4 w-4" />
              ログアウト
            </button>
            {activeSettingSection === 'logout' && (
              <div className="px-4 py-2">
                {renderSettingContent('logout')}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-12">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-2"
          >
            マイページ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 text-lg"
          >
            ようこそ、{userName}さん！ アカウント情報や設定、学習履歴をご確認いただけます。
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* モバイル用ナビゲーション */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <nav className="flex space-x-2 pb-2">
            <button
              onClick={() => setActiveSection('account')}
              className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
                activeSection === 'account' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              アカウント情報
            </button>
            <button
              onClick={() => setActiveSection('favorites')}
              className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
                activeSection === 'favorites' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="h-5 w-5 mr-2" />
              お気に入り
            </button>
            <button
              onClick={() => setActiveSection('history')}
              className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
                activeSection === 'history' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              受験履歴
            </button>
            <button
              onClick={() => setActiveSection('purchase')}
              className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
                activeSection === 'purchase' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              購入履歴
            </button>
            {renderMobileSettingsButton()}
          </nav>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* デスクトップ用ナビゲーション */}
          <aside className="hidden md:block w-64 pr-8 flex-shrink-0">
            <nav className="space-y-2 sticky top-8">
              <button
                onClick={() => setActiveSection('account')}
                className={activeSection === 'account' ? activeLinkClasses : baseLinkClasses}
              >
                <User className="mr-3 h-5 w-5" />
                アカウント情報
              </button>
              <button
                onClick={() => setActiveSection('favorites')}
                className={activeSection === 'favorites' ? activeLinkClasses : baseLinkClasses}
              >
                <Heart className="mr-3 h-5 w-5" />
                お気に入り模試
              </button>
              <button
                onClick={() => setActiveSection('history')}
                className={activeSection === 'history' ? activeLinkClasses : baseLinkClasses}
              >
                <ClipboardList className="mr-3 h-5 w-5" />
                受験履歴
              </button>
              <button
                onClick={() => setActiveSection('purchase')}
                className={activeSection === 'purchase' ? activeLinkClasses : baseLinkClasses}
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                購入履歴
              </button>
              <div className="relative">
                <button
                  onClick={toggleSettings}
                  className={`w-full ${activeSection === 'settings' ? activeLinkClasses : baseLinkClasses}`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  設定
                </button>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 space-y-1"
                  >
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveSettingSection('profile')}
                        className={`w-full ${activeSettingSection === 'profile' ? activeLinkClasses : baseLinkClasses}`}
                      >
                        <User className="mr-3 h-5 w-5" />
                        プロフィール
                      </button>
                      {activeSettingSection === 'profile' && (
                        <div className="pl-4">
                          {renderSettingContent('profile')}
                        </div>
                      )}
                      <button
                        onClick={() => setActiveSettingSection('notifications')}
                        className={`w-full ${activeSettingSection === 'notifications' ? activeLinkClasses : baseLinkClasses}`}
                      >
                        <Bell className="mr-3 h-5 w-5" />
                        通知
                      </button>
                      {activeSettingSection === 'notifications' && (
                        <div className="pl-4">
                          {renderSettingContent('notifications')}
                        </div>
                      )}
                      <button
                        onClick={() => setActiveSettingSection('password')}
                        className={`w-full ${activeSettingSection === 'password' ? activeLinkClasses : baseLinkClasses}`}
                      >
                        <Lock className="mr-3 h-5 w-5" />
                        パスワード
                      </button>
                      {activeSettingSection === 'password' && (
                        <div className="pl-4">
                          {renderSettingContent('password')}
                        </div>
                      )}
                      <button
                        onClick={() => setActiveSettingSection('subscription')}
                        className={`w-full ${activeSettingSection === 'subscription' ? activeLinkClasses : baseLinkClasses}`}
                      >
                        <CreditCard className="mr-3 h-5 w-5" />
                        サブスクリプション
                      </button>
                      {activeSettingSection === 'subscription' && (
                        <div className="pl-4">
                          {renderSettingContent('subscription')}
                        </div>
                      )}
                      <button
                        onClick={() => setActiveSettingSection('help')}
                        className={`w-full ${activeSettingSection === 'help' ? activeLinkClasses : baseLinkClasses}`}
                      >
                        <HelpCircle className="mr-3 h-5 w-5" />
                        ヘルプ
                      </button>
                      {activeSettingSection === 'help' && (
                        <div className="pl-4">
                          {renderSettingContent('help')}
                        </div>
                      )}
                      <button
                        onClick={() => setActiveSettingSection('logout')}
                        className={`w-full ${activeSettingSection === 'logout' ? activeLinkClasses : baseLinkClasses}`}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        ログアウト
                      </button>
                      {activeSettingSection === 'logout' && (
                        <div className="pl-4">
                          {renderSettingContent('logout')}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </nav>
          </aside>

          <main className="flex-grow">
            {activeSection !== 'settings' && renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
} 