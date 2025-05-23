'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import Link from 'next/link'; // Linkを追加
import LoadingSpinner from '@/app/components/LoadingSpinner'; // ローディングスピナーを追加
import { getExam } from '@/app/lib/exams'; // Exam を削除
import { ExamData } from '@/app/lib/firestoreTypes'; // ExamData をインポート
import { motion } from 'framer-motion'; // motion をインポート

// ExamInfo 型定義は不要なので削除
// interface ExamInfo { ... }

// 試験タイプと表示名のマッピングを型安全にする
const EXAM_TYPE_LABELS: { [key: string]: string } = {
  'TOEIC': 'TOEIC® TEST',
  'TOEFL': 'TOEFL iBT® TEST',
  'EIKEN': '英検®'
};

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth(); // loading は認証状態のローディング
  const { showToast } = useToast();
  const [exam, setExam] = useState<ExamData | null>(null); // Exam を ExamData に変更
  // purchaseStatus は不要なので削除
  // const [purchaseStatus, setPurchaseStatus] = useState<'none' | 'pending' | 'completed' | 'failed'>('none');
  const [isLoading, setIsLoading] = useState(true); // ページ全体のローディング状態

  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      try {
        // getExam 関数を直接呼び出す
        const data = await getExam(params.id);

        if (!data) { // データが取得できなかった場合
          throw new Error('指定された模試が見つかりませんでした。');
        }

        setExam(data);
      } catch (error) {
        console.error('模試取得エラー:', error);
        showToast(error instanceof Error ? error.message : '模試の取得に失敗しました', 'error');
        setExam(null);
      } finally {
        setIsLoading(false);
      }
    };

    // 認証状態に関わらず模試情報は取得する
    fetchExam();

    // 購入状態のチェックは不要なので削除
    // const checkPurchaseStatus = async () => { ... };
    // checkPurchaseStatus();

    // 認証状態が読み込み完了したら、未ログインならリダイレクトするなどを検討 (オプション)
    // if (!loading && !user) {
    //   // 必要ならログインページへリダイレクト
    // }

  }, [params.id, showToast]); // user, loading を依存配列から削除 (認証に依存しないため)

  // handlePurchase 関数は不要なので削除
  // const handlePurchase = async () => { ... };

  // 認証状態のローディングとデータローディングの両方を考慮
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          模試情報が見つかりません。前のページに戻ってやり直してください。
        </div>
        <div className="mt-4">
          <Link href="/exams" className="text-blue-600 hover:text-blue-800">
            &larr; 模試一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  // 試験タイプに応じたラベル (型安全なマッピングを使用)
  const examTypeLabel = EXAM_TYPE_LABELS[exam.type] || '模試';
  // structure から合計 duration を計算
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


  return (
    <div className="bg-gray-50 min-h-screen pb-12"> {/* 背景色とpaddingを追加 */}
      {/* 新しいヘッダーセクション */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-2"
          >
            {exam.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 max-w-3xl"
          >
            受験前の最終確認：以下の注意事項をよくお読みください。
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 flex items-center space-x-4 text-blue-200"
            >
             <span className="inline-flex items-center bg-white bg-opacity-10 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
               {examTypeLabel}
             </span>
             <span className="inline-flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
               </svg>
               所要時間: 約{totalDurationMinutes}分
             </span>
            {exam.isFree && (
              <span className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                 無料
               </span>
             )}
           </motion.div>
        </div>
      </div>

      {/* 注意事項セクションを白いカードに変更 */}
      <div className="container mx-auto px-4 py-8 -mt-10"> {/* ネガティブマージンでヘッダーと重ねる */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-6 md:p-8"
          >
          {/* <h2 className="text-2xl font-semibold mb-4 text-gray-900">受験にあたっての注意事項</h2> */}{/* カード内ではh2は不要かも */}
          
          {/* 注意事項ボックスのデザイン変更 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="font-semibold text-blue-800">受験前に必ずご確認ください</span>
            </div>
            <ul className="ml-8 mt-3 list-disc text-sm text-blue-700 space-y-2">
              <li>制限時間は <strong>{totalDurationMinutes}分</strong> です。時間内に全ての問題に回答してください。</li>
              <li>試験開始後はタイマーが作動します。中断した場合でもタイマーは停止しません。</li>
              <li>一度提出した回答は修正できません。</li>
              {exam.type === 'TOEFL' || exam.type === 'IELTS' || exam.type === 'EIKEN' ? (
                <li>スピーキング・ライティングセクションでは、マイク・キーボードが必要になります。事前にデバイスの接続と動作をご確認ください。</li>
              ) : null}
              {exam.type === 'TOEIC' && (
                <li>リスニングセクションとリーディングセクションに分かれています。セクション間の移動は指示に従ってください。</li>
              )}
              <li>リスニング問題が含まれる場合は、ヘッドフォンまたはイヤホンの使用を強く推奨します。静かな環境で受験してください。</li>
              <li>試験中にブラウザを閉じたり、更新したり、他のページに移動すると、解答状況が失われる可能性があります。十分ご注意ください。</li>
              <li>安定したインターネット接続環境で受験してください。接続が不安定な場合、問題の読み込みや解答の送信に失敗する可能性があります。</li>
              <li>万が一、試験中に技術的な問題が発生した場合は、慌てずに画面の指示を確認するか、サポートまでお問い合わせください。</li>
              <li>試験終了後、結果概要が画面に表示されます。詳細な分析レポートはマイページから後日確認できます。（※表示内容は模試により異なる場合があります）</li>
              <li>特に記載がない限り、各模試は一度のみ受験可能です。</li>
              <li>準備ができたら下の「受験を開始する」ボタンをクリックしてください。クリックすると試験が開始され、タイマーが作動します。</li>
            </ul>
          </div>

          {/* 受験開始ボタン */}
          <div className="text-center">
            <Link
              href={`/exams/${exam.id}/take`}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              受験を開始する
            </Link>
          </div>
        </motion.div>
      </div>

       {/* 必要であれば他の模試詳細情報や関連情報へのリンクなどをここに追加 */}
       {/* 例: 関連する学習資料へのリンクなど */}
       {/* <div className="mt-8 border-t pt-6">
         <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">関連資料</h3>
         </div> */}
    </div>
  );
} 