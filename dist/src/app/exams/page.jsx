'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExamsPage;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const link_1 = __importDefault(require("next/link"));
const exams_1 = require("@/app/lib/exams");
const useAuth_1 = require("@/app/hooks/useAuth");
const subscriptions_1 = require("@/app/lib/subscriptions");
const purchases_1 = require("@/app/lib/purchases");
const PurchaseButton_1 = __importDefault(require("@/app/components/PurchaseButton"));
const LoadingSpinner_1 = __importDefault(require("../components/LoadingSpinner"));
// 試験タイプのリスト
const EXAM_TYPES = ['TOEIC', 'TOEFL', 'EIKEN'];
// 試験タイプに応じたアイコンと表示名の設定
const TYPE_STYLES = {
    'TOEIC': {
        color: 'gray',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"/>
      </svg>),
        bgGradient: 'from-gray-50 to-gray-100',
        border: 'border-gray-200',
        header: 'bg-gray-700',
        iconColor: 'text-blue-700',
        displayName: 'TOEIC',
        bgColor: 'bg-blue-700',
    },
    'TOEFL': {
        color: 'gray',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
      </svg>),
        bgGradient: 'from-gray-50 to-gray-100',
        border: 'border-gray-200',
        header: 'bg-gray-700',
        iconColor: 'text-red-700',
        displayName: 'TOEFL',
        bgColor: 'bg-red-700',
    },
    'EIKEN': {
        color: 'gray',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>),
        bgGradient: 'from-gray-50 to-gray-100',
        border: 'border-gray-200',
        header: 'bg-gray-700',
        iconColor: 'text-green-700',
        displayName: '英検',
        bgColor: 'bg-green-700',
    }
};
function ExamsPage() {
    const { user, loading: authLoading } = (0, useAuth_1.useAuth)();
    const [exams, setExams] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [hasSubscription, setHasSubscription] = (0, react_1.useState)(false);
    const [purchasedExams, setPurchasedExams] = (0, react_1.useState)(new Set());
    const [activeTab, setActiveTab] = (0, react_1.useState)('all');
    const [examsByType, setExamsByType] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const fetchExams = async () => {
            try {
                setLoading(true);
                const examData = await (0, exams_1.getAllExams)();
                if (!examData || examData.length === 0) {
                    setError('現在利用可能な模試はありません。');
                    setExams([]);
                    setExamsByType({}); // エラー時やデータがない場合も初期化
                }
                else {
                    // type の優先順位
                    const typeOrder = ['TOEIC', 'TOEFL', 'EIKEN'];
                    // 「すべての模試」用のソート
                    const sortedAllExams = [...examData].sort((a, b) => {
                        const typeAIndex = typeOrder.indexOf(a.type);
                        const typeBIndex = typeOrder.indexOf(b.type);
                        // typeOrder に基づいてソート
                        if (typeAIndex !== typeBIndex) {
                            // どちらか一方または両方が typeOrder にない場合、ある方を優先
                            if (typeAIndex === -1 && typeBIndex !== -1)
                                return 1;
                            if (typeAIndex !== -1 && typeBIndex === -1)
                                return -1;
                            // 両方とも typeOrder にある場合、インデックスで比較
                            if (typeAIndex !== -1 && typeBIndex !== -1)
                                return typeAIndex - typeBIndex;
                            // 両方とも typeOrder にない場合、type 文字列で比較 (フォールバック)
                            return a.type.localeCompare(b.type);
                        }
                        // type が同じ場合は id でソート
                        return a.id.localeCompare(b.id);
                    });
                    setExams(sortedAllExams); // ソート済みの全模試リストを設定
                    // 試験タイプごとに分類し、各タイプ内で id でソート
                    const typeMap = { 'all': sortedAllExams }; // 'all' にもソート済みリストを使用
                    EXAM_TYPES.forEach(type => {
                        typeMap[type] = examData
                            .filter(exam => exam.type === type)
                            .sort((a, b) => a.id.localeCompare(b.id)); // idでソート
                    });
                    setExamsByType(typeMap);
                    setError(null);
                }
            }
            catch (err) {
                console.error('Error fetching exams:', err);
                setError('模試データの取得中にエラーが発生しました。しばらく待ってから再度お試しください。');
                setExams([]);
                setExamsByType({}); // エラー時も初期化
            }
            finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);
    (0, react_1.useEffect)(() => {
        const checkSubscription = async () => {
            if (user) {
                try {
                    const hasSubscription = await (0, subscriptions_1.hasActiveSubscription)(user.uid);
                    setHasSubscription(hasSubscription);
                }
                catch (err) {
                    console.error('サブスクリプション確認エラー:', err);
                    setHasSubscription(false);
                }
            }
            else {
                setHasSubscription(false);
            }
        };
        const checkPurchases = async () => {
            if (user) {
                try {
                    const purchased = new Set();
                    for (const exam of exams) {
                        if (!exam.isFree) {
                            const isPurchased = await (0, purchases_1.checkExamPurchase)(user.uid, exam.id);
                            if (isPurchased) {
                                purchased.add(exam.id);
                            }
                        }
                    }
                    setPurchasedExams(purchased);
                }
                catch (err) {
                    console.error('購入状態確認エラー:', err);
                }
            }
        };
        if (!authLoading) {
            checkSubscription();
            checkPurchases();
        }
    }, [user, authLoading, exams]);
    const renderExamCard = (exam) => {
        const typeStyle = TYPE_STYLES[exam.type] || TYPE_STYLES['TOEIC'];
        // structure から合計 duration を計算
        const totalDuration = exam.structure?.reduce((acc, section) => acc + (section.duration || 0), 0) || 0;
        const totalDurationMinutes = Math.floor(totalDuration / 60);
        return (<framer_motion_1.motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 flex flex-col relative">
        <div className="p-6 flex-grow pb-20">
          <div className="absolute top-4 right-4">
            {exam.isFree ? (<span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                無料
              </span>) : (<span className="text-lg font-bold text-gray-800">
                ¥{exam.price?.toLocaleString() ?? '----'}
              </span>)}
          </div>

          <div className="flex items-center mb-2">
            <span className={`mr-1.5 ${typeStyle.iconColor}`}>{typeStyle.icon}</span>
            <span className="text-sm font-medium text-gray-600">{typeStyle.displayName}</span>
          </div>
          
          <h2 className="text-xl font-semibold mb-3 text-gray-900">{exam.title}</h2>
          <p className="text-gray-600 mb-4 text-sm flex-grow">{exam.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-6 mt-auto">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>約{totalDurationMinutes > 0 ? `${totalDurationMinutes}分` : '??分'}</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 pt-0">
            {exam.isFree ? (<link_1.default href={`/exams/${exam.id}`} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                無料で受験する
              </link_1.default>) : purchasedExams.has(exam.id) ? (<link_1.default href={`/exams/${exam.id}`} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                受験する（購入済み）
              </link_1.default>) : hasSubscription ? (<link_1.default href={`/exams/${exam.id}`} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                受験する
              </link_1.default>) : (<PurchaseButton_1.default examId={exam.id} price={exam.price || 0} isDisabled={!user || purchasedExams.has(exam.id)}/>)}

            {hasSubscription && !exam.isFree && !purchasedExams.has(exam.id) && (<p className="mt-2 text-xs text-green-600 text-center">
                プレミアム会員特典：無料でアクセス可能
              </p>)}

            {!user && !exam.isFree && (<p className="mt-2 text-sm text-gray-500 text-center">
                購入するには
                <link_1.default href="/auth/signin" className="text-blue-600 hover:text-blue-500 ml-1">
                  ログイン
                </link_1.default>
                が必要です
              </p>)}
          </div>
        </div>
      </framer_motion_1.motion.div>);
    };
    if (loading || authLoading) {
        return (<div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner_1.default />
      </div>);
    }
    return (<div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
      <div className="container mx-auto px-4">
          <framer_motion_1.motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold mb-4">
            模試一覧
          </framer_motion_1.motion.h1>
          <framer_motion_1.motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-blue-100 max-w-3xl">
            TOEIC®、TOEFL®、英検®など、様々な試験の模擬試験を提供しています。
            模試を通じて自分の弱点を把握し、効率的に学習を進めましょう。
          </framer_motion_1.motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-lg shadow-md p-4 mb-8 flex overflow-x-auto">
          <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-md whitespace-nowrap mr-2 transition-colors ${activeTab === 'all'
            ? 'bg-gray-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              すべての模試
              <span className="ml-2 bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                {exams.length}
              </span>
            </span>
          </button>
          {EXAM_TYPES.map(type => {
            const style = TYPE_STYLES[type];
            if (!style)
                return null;
            return (<button key={type} onClick={() => setActiveTab(type)} className={`px-4 py-2 rounded-md flex items-center whitespace-nowrap mr-2 transition-colors ${activeTab === type
                    ? `${style?.bgColor ?? 'bg-gray-700'} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <span className={`mr-2 ${activeTab === type ? 'text-white' : style.iconColor}`}>{style.icon}</span>
                <span>{style.displayName}</span>
                <span className={`ml-2 ${activeTab === type ? 'bg-white bg-opacity-25' : 'bg-gray-200'} text-xs px-2 py-0.5 rounded-full`}>
                  {examsByType[type]?.length || 0}
                </span>
              </button>);
        })}
        </framer_motion_1.motion.div>

        {error ? (<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>) : (<>
            <framer_motion_1.AnimatePresence mode="wait">
              {activeTab === 'all' ? (<framer_motion_1.motion.div key="all-exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-2xl font-bold mb-6">すべての模試</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {exams.map(renderExamCard)}
                  </div>
                </framer_motion_1.motion.div>) : (<framer_motion_1.motion.div key={`${activeTab}-exams`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold">{TYPE_STYLES[activeTab]?.displayName || activeTab}模試</h2>
                    <span className="ml-3 text-sm text-gray-500">
                      {examsByType[activeTab]?.length || 0}件の模試が見つかりました
                    </span>
                  </div>
                  
                  {examsByType[activeTab]?.length > 0 ? (<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {examsByType[activeTab].map(renderExamCard)}
                    </div>) : (<div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">現在、{TYPE_STYLES[activeTab]?.displayName || activeTab}の模試はありません。</p>
                      <button onClick={() => setActiveTab('all')} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                        すべての模試を見る
                      </button>
                    </div>)}
                </framer_motion_1.motion.div>)}
            </framer_motion_1.AnimatePresence>
          </>)}

        {/* Premium Plan CTA Section */}
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-16 mb-12 bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white bg-opacity-10 rounded-full filter blur-xl"></div>

          <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-4">
                  <span className="block">全ての模試にアクセスしませんか？</span>
                  <span className="block text-yellow-200">Premiumに登録しましょう</span>
              </h2>
              <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                  プレミアムプランなら、全てのTOEIC®・TOEFL®・英検®模試が受け放題。AIによる詳細分析で弱点を克服し、効率的にスコアアップを目指せます。
              </p>
              <link_1.default href="/subscription" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-green-700 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  プレミアムプランの詳細を見る
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
              </link_1.default>
          </div>
        </framer_motion_1.motion.div>

      </div>
    </div>);
}
