'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import PurchaseHistory from '@/app/components/PurchaseHistory';
import SubscriptionStatus from '@/app/components/SubscriptionStatus';
import SubscriptionManagement from '@/app/components/SubscriptionManagement';
import SubscriptionDebugTools from '@/app/components/SubscriptionDebugTools';
import { User, Bell, Lock, CreditCard, HelpCircle, LogOut, Settings, ClipboardList, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { logoutUser } from '@/app/lib/auth-firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import { db } from '@/app/lib/firebase'; // Firestore instance
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore'; // Firestore functions
import { ExamAttempt } from '@/app/lib/firestoreTypes'; // ExamAttempt type

// 設定サブセクションの型定義
type SettingSection = 'profile' | 'notifications' | 'password' | 'subscription' | 'help' | 'logout';

export default function MyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('history');
  const [activeSettingSection, setActiveSettingSection] = useState<SettingSection>('profile');
  const [examHistory, setExamHistory] = useState<ExamAttempt[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?callbackUrl=/mypage');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchExamHistory = async () => {
      if (user && activeSection === 'history') {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
          const attemptsRef = collection(db, 'exam_attempts');
          const q = query(
            attemptsRef,
            where('userId', '==', user.uid),
            where('status', '==', 'completed'),
            orderBy('completedAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const history: ExamAttempt[] = [];
          querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() } as ExamAttempt);
          });
          setExamHistory(history);
        } catch (error: any) {          
          console.error("Error fetching exam history:", error);
          setHistoryError("受験履歴の取得に失敗しました。時間をおいて再度お試しください。");
        }
        setHistoryLoading(false);
      }
    };

    fetchExamHistory();
  }, [user, activeSection]); // activeSection を依存配列に追加

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      alert('ログアウト中にエラーが発生しました。');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50"><LoadingSpinner /></div>;
  }

  if (!user) {
    return null;
  }

  const userName = user.displayName || user.email?.split('@')[0] || 'ユーザー';

  const baseLinkClasses = "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150 w-full text-left";
  const activeLinkClasses = "flex items-center px-4 py-3 text-blue-700 bg-blue-50 rounded-md font-semibold w-full text-left";
  const baseSettingLinkClasses = "flex items-center p-3 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out w-full text-left";
  const activeSettingLinkClasses = "flex items-center p-3 rounded-lg bg-gray-100 text-blue-700 font-medium transition duration-150 ease-in-out w-full text-left";

  const renderSettingContent = (section: SettingSection) => {
    const commonWrapperClass = "p-4 bg-white rounded-lg shadow-sm border border-gray-100 h-full overflow-y-auto";
    switch (section) {
      case 'profile':
        return (
          <div className={commonWrapperClass}>
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
          <div className={commonWrapperClass}>
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
          <div className={commonWrapperClass}>
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
          <div className={commonWrapperClass}>
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
          <div className={commonWrapperClass}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">ヘルプ & サポート</h3>
            <p className="text-gray-600 mb-2">ご不明な点がございましたら、以下のFAQをご覧いただくか、サポートまでお問い合わせください。</p>
            <Link href="/faq" className="text-blue-600 hover:underline">よくある質問を見る</Link>
          </div>
        );
      case 'logout':
        return (
          <div className={commonWrapperClass}>
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

  const renderMainSection = () => {
    if (activeSection === 'settings') return null;

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
              <User className="mr-2 h-5 w-5 text-blue-600" />
              アカウント情報
            </h2>
            <div className="space-y-3 mb-6">
              <p><span className="font-medium text-gray-500 text-sm">お名前:</span><br /><span className="text-gray-800">{userName}</span></p>
              <p><span className="font-medium text-gray-500 text-sm">メールアドレス:</span><br /><span className="text-gray-800 break-all">{user.email}</span></p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-base font-medium text-gray-700 mb-2">サブスクリプション状態</h3>
              <SubscriptionStatus />
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
              <ClipboardList className="mr-2 h-5 w-5 text-blue-600" />
              受験履歴
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {historyLoading ? (
                <p className="text-sm text-gray-500 text-center py-4">受験履歴を読み込んでいます...</p>
              ) : historyError ? (
                <p className="text-sm text-red-500 text-center py-4">{historyError}</p>
              ) : examHistory.length > 0 ? (
                examHistory.map(attempt => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out border-b last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attempt.examTitle}</p>
                      <p className="text-xs text-gray-500">
                        {attempt.completedAt instanceof Timestamp 
                          ? attempt.completedAt.toDate().toLocaleDateString() 
                          : attempt.completedAt ? new Date(attempt.completedAt as any).toLocaleDateString() : '日付不明'} 
                        {attempt.totalScore !== undefined && ` - スコア: ${attempt.totalScore}点 /120`}
                      </p>
                    </div>
                    <Link 
                      href={`/exams/${attempt.examId}/result?attemptId=${attempt.id}`}
                      className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap"
                    >
                      詳細を見る
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">受験履歴はありません。</p>
              )}
            </div>
            {/* TODO: 全履歴ページへのリンクは、別途ページ作成後に有効化 */} 
            {/* {examHistory.length > 3 && (
              <div className="mt-4 text-center">
                <Link href="/history/exams" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  全ての受験履歴を見る →
                </Link>
              </div>
            )} */}
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
              <ShoppingCart className="mr-2 h-5 w-5 text-blue-600" />
              購入履歴
            </h2>
            <PurchaseHistory />
          </motion.section>
        );
      default:
        return null;
    }
  };

  // 設定項目の定義
  const settingItems: { name: SettingSection; icon: JSX.Element; label: string }[] = [
    { name: 'profile', icon: <User size={20} />, label: 'プロフィール' },
    { name: 'notifications', icon: <Bell size={20} />, label: '通知' },
    { name: 'password', icon: <Lock size={20} />, label: 'パスワード' },
    { name: 'subscription', icon: <CreditCard size={20} />, label: 'サブスクリプション' },
    { name: 'help', icon: <HelpCircle size={20} />, label: 'ヘルプ' },
    { name: 'logout', icon: <LogOut size={20} />, label: 'ログアウト' },
  ];

  // メインナビゲーション項目の定義 (モバイルとデスクトップで共通化)
  const mainNavItems: { name: string; icon: JSX.Element; mobileIcon: JSX.Element; label: string }[] = [
    { name: 'history', icon: <ClipboardList className="mr-3 h-5 w-5" />, mobileIcon: <ClipboardList size={24} />, label: '受験履歴' },
    { name: 'purchase', icon: <ShoppingCart className="mr-3 h-5 w-5" />, mobileIcon: <ShoppingCart size={24} />, label: '購入履歴' },
    { name: 'account', icon: <User className="mr-3 h-5 w-5" />, mobileIcon: <User size={24} />, label: 'アカウント情報' },
    { name: 'settings', icon: <Settings className="mr-3 h-5 w-5" />, mobileIcon: <Settings size={24} />, label: '設定' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-12">
        <div className="container mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold mb-2">マイページ</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-blue-100 text-lg">ようこそ、{userName}さん！ アカウント情報や設定、学習履歴をご確認いただけます。</motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* モバイル用トップナビゲーション */} 
        <div className="md:hidden mb-6">
          <nav className="flex justify-around items-center pb-2 border-b"> {/* justify-around でアイコンを均等配置、スクロール不要なので overflow-x-auto を削除 */}
            {mainNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.name as any)}
                title={item.label} // アイコンにマウスオーバーでラベル表示
                className={`p-2 rounded-md flex flex-col items-center justify-center ${
                  activeSection === item.name 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {item.mobileIcon}
                {/* モバイル版はアイコン下に非常に小さな文字でラベルを表示することも検討可能だが、一旦アイコンのみとする */}
                {/* <span className={`text-xs mt-1 ${activeSection === item.name ? 'text-blue-600' : 'text-gray-500'}`}>{item.label}</span> */}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* デスクトップ用左側ナビゲーション */} 
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="space-y-2 sticky top-8">
              {mainNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveSection(item.name as any);
                    if (item.name === 'settings' && activeSettingSection === '' as SettingSection) {
                      setActiveSettingSection('profile');
                    }
                  }}
                  className={activeSection === item.name ? activeLinkClasses : baseLinkClasses}
                >
                  {item.icon} 
                  {item.label} {/* デスクトップではラベルを表示 */}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-grow min-w-0">
            <div className="md:hidden">
              {activeSection === 'settings' ? (
                <motion.div
                  key="settings-mobile"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 border-b flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">設定</h2>
                  </div>
                  <div className="flex flex-grow">
                    <nav className="w-16 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                      <div className="flex flex-col items-center space-y-1 py-2">
                        {settingItems.map(item => (
                          <button
                            key={item.name}
                            onClick={() => setActiveSettingSection(item.name)}
                            title={item.label}
                            className={`p-3 rounded-md flex justify-center items-center w-full ${
                              activeSettingSection === item.name
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                            }`}
                          >
                            {item.icon}
                          </button>
                        ))}
                      </div>
                    </nav>
                    <div className="flex-grow p-0 min-w-0">
                      {renderSettingContent(activeSettingSection)}
                    </div>
                  </div>
                </motion.div>
              ) : (
                renderMainSection()
              )}
            </div>

            <div className="hidden md:block">
              {activeSection === 'settings' ? (
                <motion.div
                  key="settings-desktop"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
                >
                  <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800 flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-blue-600" />
                    設定
                  </h2>
                  <div className="flex gap-6">
                    <nav className="w-48 flex-shrink-0 space-y-1">
                      {settingItems.map(item => (
                        <button
                          key={item.name}
                          onClick={() => setActiveSettingSection(item.name)}
                          className={activeSettingSection === item.name ? activeSettingLinkClasses : baseSettingLinkClasses}
                        >
                          {item.icon} <span className="ml-2">{item.label}</span>
                        </button>
                      ))}
                    </nav>
                    <div className="flex-grow border-l border-gray-200 pl-6 min-w-0">
                      {renderSettingContent(activeSettingSection)}
                    </div>
                  </div>
                </motion.div>
              ) : (
                renderMainSection()
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 