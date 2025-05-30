'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const framer_motion_1 = require("framer-motion");
const useAuth_1 = require("@/app/hooks/useAuth");
const PurchaseHistory_1 = __importDefault(require("@/app/components/PurchaseHistory"));
const SubscriptionStatus_1 = __importDefault(require("@/app/components/SubscriptionStatus"));
const SubscriptionManagement_1 = __importDefault(require("@/app/components/SubscriptionManagement"));
const SubscriptionDebugTools_1 = __importDefault(require("@/app/components/SubscriptionDebugTools"));
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const auth_firebase_1 = require("@/app/lib/auth-firebase");
const LoadingSpinner_1 = __importDefault(require("../components/LoadingSpinner"));
function MyPage() {
    const router = (0, navigation_1.useRouter)();
    const { user, loading } = (0, useAuth_1.useAuth)();
    const [activeSection, setActiveSection] = (0, react_1.useState)('account');
    const [activeSettingSection, setActiveSettingSection] = (0, react_1.useState)('profile');
    (0, react_1.useEffect)(() => {
        if (!loading && !user) {
            router.push('/auth/signin?callbackUrl=/mypage');
        }
    }, [user, loading, router]);
    // ログアウト処理関数
    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await (0, auth_firebase_1.logoutUser)();
            // ホームページにリダイレクト
            router.push('/');
        }
        catch (error) {
            console.error('ログアウトエラー:', error);
            // エラーメッセージを表示するなど
            alert('ログアウト中にエラーが発生しました。');
        }
    };
    if (loading) {
        return (<div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner_1.default />
      </div>);
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
    const renderSettingContent = () => {
        switch (activeSettingSection) {
            case 'profile':
                return (<div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">プロフィール編集</h3>
            <p className="text-gray-600">ここにプロフィール編集フォームが表示されます。（未実装）</p>
            {/* ダミーフォーム要素など */}
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">表示名</label>
                <input type="text" name="displayName" id="displayName" defaultValue={userName} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
              </div>
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">更新</button>
            </div>
          </div>);
            case 'notifications':
                return (<div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">通知設定</h3>
            <p className="text-gray-600">ここに通知設定フォームが表示されます。（未実装）</p>
            <div className="mt-4 space-y-2">
                <div className="flex items-center">
                    <input id="email-notifications" name="email-notifications" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">新しい模試に関するメール通知を受け取る</label>
                </div>
            </div>
          </div>);
            case 'password':
                return (<div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">パスワード変更</h3>
            <p className="text-gray-600">ここにパスワード変更フォームが表示されます。（未実装）</p>
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
          </div>);
            case 'subscription':
                return (<div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">サブスクリプション管理</h3>
             <SubscriptionManagement_1.default />
             {process.env.NODE_ENV === 'development' && (<div className="mt-4 border-t pt-4">
                  <h4 className="text-base font-medium text-gray-800 mb-2">開発用デバッグツール</h4>
                 <SubscriptionDebugTools_1.default />
               </div>)}
          </div>);
            case 'help':
                return (<div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">ヘルプ & サポート</h3>
            <p className="text-gray-600 mb-2">ご不明な点がございましたら、以下のFAQをご覧いただくか、サポートまでお問い合わせください。</p>
            <link_1.default href="/faq" className="text-blue-600 hover:underline">よくある質問を見る</link_1.default>
            {/* <p className="mt-4">サポートへのお問い合わせ: support@toremock.com</p> */}
          </div>);
            case 'logout':
                return (<div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">ログアウト</h3>
            <p className="text-gray-600 mb-4">本当にログアウトしますか？</p>
            <button onClick={handleSignOut} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <lucide_react_1.LogOut className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
              ログアウトする
            </button>
          </div>);
            default:
                return null;
        }
    };
    // --- メインセクションの描画関数 ---
    const renderSection = () => {
        switch (activeSection) {
            case 'account':
                return (<framer_motion_1.motion.section key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <lucide_react_1.User className="mr-2 h-5 w-5 text-blue-500"/>
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
              <SubscriptionStatus_1.default />
            </div>
          </framer_motion_1.motion.section>);
            case 'settings':
                return (<framer_motion_1.motion.div key="settings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800 flex items-center">
              <lucide_react_1.Settings className="mr-2 h-5 w-5 text-gray-500"/>
              設定
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <nav className="md:w-48 flex-shrink-0 space-y-1">
                <button onClick={() => setActiveSettingSection('profile')} className={activeSettingSection === 'profile' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                  <lucide_react_1.User className="mr-3 h-5 w-5"/> プロフィール
                </button>
                <button onClick={() => setActiveSettingSection('notifications')} className={activeSettingSection === 'notifications' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                  <lucide_react_1.Bell className="mr-3 h-5 w-5"/> 通知
                </button>
                <button onClick={() => setActiveSettingSection('password')} className={activeSettingSection === 'password' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                  <lucide_react_1.Lock className="mr-3 h-5 w-5"/> パスワード
                </button>
                <button onClick={() => setActiveSettingSection('subscription')} className={activeSettingSection === 'subscription' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                  <lucide_react_1.CreditCard className="mr-3 h-5 w-5"/> サブスクリプション
                </button>
                <button onClick={() => setActiveSettingSection('help')} className={activeSettingSection === 'help' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                   <lucide_react_1.HelpCircle className="mr-3 h-5 w-5"/> ヘルプ
                </button>
                <button onClick={() => setActiveSettingSection('logout')} className={activeSettingSection === 'logout' ? activeSettingLinkClasses : baseSettingLinkClasses}>
                   <lucide_react_1.LogOut className="mr-3 h-5 w-5"/> ログアウト
                </button>
              </nav>
              <div className="flex-grow md:border-l md:pl-6">
                 {renderSettingContent()}
              </div>
            </div>
          </framer_motion_1.motion.div>);
            case 'favorites':
                return (<framer_motion_1.motion.section key="favorites" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <lucide_react_1.Heart className="mr-2 h-5 w-5 text-pink-500"/>
              お気に入り模試
            </h2>
            <div className="space-y-3">
              {dummyFavoriteExams.length > 0 ? (dummyFavoriteExams.map(exam => (<div key={exam.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <span className="text-sm text-gray-700 truncate pr-2">{exam.name}</span>
                    <link_1.default href={exam.link} className="text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap">
                      模試を見る
                    </link_1.default>
                  </div>))) : (<p className="text-sm text-gray-500">お気に入りの模試はありません。</p>)}
            </div>
          </framer_motion_1.motion.section>);
            case 'history':
                return (<framer_motion_1.motion.section key="history" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <lucide_react_1.ClipboardList className="mr-2 h-5 w-5 text-indigo-500"/>
              受験履歴
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {dummyExamHistory.length > 0 ? (dummyExamHistory.map(exam => (<div key={exam.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out border-b last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                      <p className="text-xs text-gray-500">{exam.date} - スコア: {exam.score}</p>
                    </div>
                    <link_1.default href={exam.link} className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap">
                      詳細を見る
                    </link_1.default>
                  </div>))) : (<p className="text-sm text-gray-500 text-center py-4">受験履歴はありません。</p>)}
            </div>
            {dummyExamHistory.length > 3 && (<div className="mt-4 text-center">
                <link_1.default href="/history/exams" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  全ての受験履歴を見る →
                </link_1.default>
              </div>)}
          </framer_motion_1.motion.section>);
            case 'purchase':
                return (<framer_motion_1.motion.section key="purchase" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center">
              <lucide_react_1.ShoppingCart className="mr-2 h-5 w-5 text-purple-500"/>
              購入履歴
            </h2>
            <PurchaseHistory_1.default />
          </framer_motion_1.motion.section>);
            default:
                return null;
        }
    };
    return (<div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-12">
        <div className="container mx-auto px-4">
          <framer_motion_1.motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold mb-2">
            マイページ
          </framer_motion_1.motion.h1>
          <framer_motion_1.motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-blue-100 text-lg">
            ようこそ、{userName}さん！ アカウント情報や設定、学習履歴をご確認いただけます。
          </framer_motion_1.motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 md:pr-8 mb-8 md:mb-0 flex-shrink-0">
          <nav className="space-y-2 md:sticky md:top-8">
            <button onClick={() => setActiveSection('account')} className={activeSection === 'account' ? activeLinkClasses : baseLinkClasses}>
              <lucide_react_1.User className="mr-3 h-5 w-5"/>
              アカウント情報
            </button>
            <button onClick={() => setActiveSection('favorites')} className={activeSection === 'favorites' ? activeLinkClasses : baseLinkClasses}>
              <lucide_react_1.Heart className="mr-3 h-5 w-5"/>
              お気に入り模試
            </button>
            <button onClick={() => setActiveSection('history')} className={activeSection === 'history' ? activeLinkClasses : baseLinkClasses}>
              <lucide_react_1.ClipboardList className="mr-3 h-5 w-5"/>
              受験履歴
            </button>
            <button onClick={() => setActiveSection('purchase')} className={activeSection === 'purchase' ? activeLinkClasses : baseLinkClasses}>
              <lucide_react_1.ShoppingCart className="mr-3 h-5 w-5"/>
              購入履歴
            </button>
            <button onClick={() => setActiveSection('settings')} className={activeSection === 'settings' ? activeLinkClasses : baseLinkClasses}>
              <lucide_react_1.Settings className="mr-3 h-5 w-5"/>
              設定
            </button>
          </nav>
        </aside>

        <main className="flex-grow">
          {renderSection()}
        </main>
      </div>
    </div>);
}
