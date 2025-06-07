'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllExams } from '@/app/lib/exams';
import { ExamData } from '@/app/lib/firestoreTypes';
import { useAuth } from '@/app/hooks/useAuth';
import { hasActiveSubscription } from '@/app/lib/subscriptions';
import { checkExamPurchase } from '@/app/lib/purchases';
import LoadingSpinner from './LoadingSpinner';

// 試験タイプのリスト
const EXAM_TYPES = ['TOEIC', 'TOEFL', 'EIKEN'];

// 試験タイプに応じたアイコンと表示名の設定
const TYPE_STYLES = {
  'TOEIC': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
      </svg>
    ),
    displayName: 'TOEIC',
  },
  'TOEFL': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
      </svg>
    ),
    displayName: 'TOEFL',
  },
  'EIKEN': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    displayName: '英検',
  }
};


export default function ExamList() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [exams, setExams] = useState<ExamData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [purchasedExams, setPurchasedExams] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<string>('all');
    const [examsByType, setExamsByType] = useState<Record<string, ExamData[]>>({});
  
    useEffect(() => {
      const fetchExams = async () => {
        try {
          setLoading(true);
          const examData = await getAllExams();
          if (!examData || examData.length === 0) {
            setError('現在利用可能な模試はありません。');
            setExams([]);
            setExamsByType({}); // エラー時やデータがない場合も初期化
          } else {
            // type の優先順位
            const typeOrder = ['TOEIC', 'TOEFL', 'EIKEN'];
  
            // 「すべての模試」用のソート
            const sortedAllExams = [...examData].sort((a, b) => {
              const typeAIndex = typeOrder.indexOf(a.type);
              const typeBIndex = typeOrder.indexOf(b.type);
  
              // typeOrder に基づいてソート
              if (typeAIndex !== typeBIndex) {
                // どちらか一方または両方が typeOrder にない場合、ある方を優先
                if (typeAIndex === -1 && typeBIndex !== -1) return 1;
                if (typeAIndex !== -1 && typeBIndex === -1) return -1;
                // 両方とも typeOrder にある場合、インデックスで比較
                if (typeAIndex !== -1 && typeBIndex !== -1) return typeAIndex - typeBIndex;
                // 両方とも typeOrder にない場合、type 文字列で比較 (フォールバック)
                return a.type.localeCompare(b.type);
              }
  
              // type が同じ場合は id でソート
              return a.id.localeCompare(b.id);
            });
  
            setExams(sortedAllExams); // ソート済みの全模試リストを設定
  
            // 試験タイプごとに分類し、各タイプ内で id でソート
            const typeMap: Record<string, ExamData[]> = { 'all': sortedAllExams }; // 'all' にもソート済みリストを使用
            EXAM_TYPES.forEach(type => {
              typeMap[type] = examData
                .filter(exam => exam.type === type)
                .sort((a, b) => a.id.localeCompare(b.id)); // idでソート
            });
            setExamsByType(typeMap);
  
            setError(null);
          }
        } catch (err) {
          console.error('Error fetching exams:', err);
          setError('模試データの取得中にエラーが発生しました。しばらく待ってから再度お試しください。');
          setExams([]);
          setExamsByType({}); // エラー時も初期化
        } finally {
          setLoading(false);
        }
      };
  
      fetchExams();
    }, []);
  
    useEffect(() => {
      const checkSubscription = async () => {
        if (user) {
          try {
            const hasSubscription = await hasActiveSubscription(user.uid);
            setHasSubscription(hasSubscription);
          } catch (err) {
            console.error('サブスクリプション確認エラー:', err);
            setHasSubscription(false);
          }
        } else {
          setHasSubscription(false);
        }
      };
  
      const checkPurchases = async () => {
        if (user) {
          try {
            const purchased = new Set<string>();
            for (const exam of exams) {
              if (!exam.isFree) {
                const isPurchased = await checkExamPurchase(user.uid, exam.id);
                if (isPurchased) {
                  purchased.add(exam.id);
                }
              }
            }
            setPurchasedExams(purchased);
          } catch (err) {
            console.error('購入状態確認エラー:', err);
          }
        }
      };
  
      if (!authLoading) {
        checkSubscription();
        checkPurchases();
      }
    }, [user, authLoading, exams]);
  
    const renderExamCard = (exam: ExamData) => {
      const typeStyle = TYPE_STYLES[exam.type as keyof typeof TYPE_STYLES] || TYPE_STYLES['TOEIC'];
      
      let totalDurationMinutes: number | string;
      switch (exam.type) {
        case 'TOEIC':
        case 'TOEFL':
          totalDurationMinutes = 120;
          break;
        case 'EIKEN':
          totalDurationMinutes = 80;
          break;
        default:
          const calculatedDuration = exam.structure?.reduce((acc, section) => acc + (section.duration || 0), 0) || 0;
          totalDurationMinutes = calculatedDuration > 0 ? Math.floor(calculatedDuration / 60) : '??';
          break;
      }
  
      const isUnlocked = exam.isFree || hasSubscription || purchasedExams.has(exam.id);
  
      return (
        <motion.div
          key={exam.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
        >
          <div className="p-6 flex-grow">
            <div className="flex justify-between items-start">
              <span className={`inline-flex items-center gap-2 text-sm font-bold ${isUnlocked ? 'text-blue-600' : 'text-gray-500'}`}>
                {typeStyle.icon}
                {typeStyle.displayName}
              </span>
              {exam.isFree && (
                 <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  無料
                 </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">{exam.title}</h3>
            <p className="text-gray-600 text-sm mt-2 flex-grow">{exam.description}</p>
          </div>
  
          <div className="bg-gray-50 p-4 border-t border-gray-100">
             <div className="flex items-center justify-between text-sm text-gray-500">
               <span className="flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg>
                 約{totalDurationMinutes}分
               </span>
               <span className="font-semibold">{isUnlocked ? "受験可能" : "要購入"}</span>
             </div>
             <Link href={`/exams/${exam.id}`} passHref>
               <button 
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                    isUnlocked 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!isUnlocked}
                  aria-label={`${exam.title} の詳細を見る`}
               >
                 {isUnlocked ? '詳細を見る' : 'ロック中'}
               </button>
            </Link>
          </div>
        </motion.div>
      );
    };

    const tabs = ['all', ...EXAM_TYPES];
    const tabDisplayNames: { [key: string]: string } = {
        'all': 'すべての模試',
        'TOEIC': 'TOEIC',
        'TOEFL': 'TOEFL',
        'EIKEN': '英検'
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="text-center py-10 px-4">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">エラー</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      );
    }
  
    return (
        <div className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                            activeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                        aria-current={activeTab === tab ? 'page' : undefined}
                    >
                    {tabDisplayNames[tab]}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </header>
  
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {examsByType[activeTab] && examsByType[activeTab].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {examsByType[activeTab].map(exam => renderExamCard(exam))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-gray-700">利用可能な模試がありません</h3>
                  <p className="mt-1 text-sm text-gray-500">選択されたカテゴリーには、現在受験できる模試がありません。</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  } 