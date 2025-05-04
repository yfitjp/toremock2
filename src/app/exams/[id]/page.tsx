'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import Link from 'next/link'; // Linkを追加
import LoadingSpinner from '@/app/components/LoadingSpinner'; // ローディングスピナーを追加
import { getExam, Exam } from '@/app/lib/exams'; // getExam と Exam 型をインポート

// ExamInfo 型定義は不要なので削除
// interface ExamInfo { ... }

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth(); // loading は認証状態のローディング
  const { showToast } = useToast();
  const [exam, setExam] = useState<Exam | null>(null); // Exam 型を使用
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

  // 試験タイプに応じたラベル (take/page.tsx から流用)
  const examTypeLabel = {
    'TOEIC': 'TOEIC® TEST',
    'TOEFL': 'TOEFL iBT® TEST',
    'EIKEN': '英検®'
  }[exam.type || 'TOEIC'] || '模試';


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 試験タイトルと概要 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
        <div className="flex items-center mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            {examTypeLabel}
          </span>
          {exam.isFree && (
            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              無料
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {exam.description || 'この模試は、あなたの英語スキルを測定するために設計されています。'}
        </p>
      </div>

      {/* 注意事項 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-yellow-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">受験にあたっての注意事項</h2>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg mb-6">
          <div className="flex items-center">
             <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <span className="font-medium text-yellow-800 dark:text-yellow-300">重要:</span>
          </div>
          <ul className="ml-7 mt-2 list-disc text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>制限時間は <strong>{exam.duration || '指定なし'}分</strong> です。時間内に全ての問題に回答してください。</li>
            <li>試験開始後はタイマーが作動します。中断した場合でもタイマーは停止しません。</li>
            <li>一度提出した回答は修正できません。</li>
            {exam.type === 'TOEFL' || exam.type === 'IELTS' || exam.type === 'EIKEN' ? ( // 例: 特定の試験タイプで追加注意
              <li>スピーキング・ライティングセクションでは、マイク・キーボードが必要になります。事前に動作確認を行ってください。</li>
            ) : null}
            {exam.type === 'TOEIC' && ( // 例: TOEICの場合の注意
              <li>リスニングセクションとリーディングセクションに分かれています。</li>
            )}
            <li>リスニング問題が含まれる場合は、ヘッドフォンまたはイヤホンの使用を強く推奨します。静かな環境で受験してください。</li>
            <li>試験中にブラウザを閉じたり、他のページに移動したりすると、解答状況が失われる可能性があります。</li>
            <li>安定したインターネット接続環境で受験してください。</li>
            <li>準備ができたら下の「受験を開始する」ボタンをクリックしてください。</li>
          </ul>
        </div>

        {/* 受験開始ボタン */}
        <div className="mt-8 text-center">
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
      </div>

       {/* 必要であれば他の模試詳細情報や関連情報へのリンクなどをここに追加 */}
       {/* 例: 関連する学習資料へのリンクなど */}
       {/* <div className="mt-8 border-t pt-6">
         <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">関連資料</h3>
         </div> */}
    </div>
  );
} 