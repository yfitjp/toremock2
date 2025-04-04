'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getExam, getUserExamAttemptsByExam, ExamAttempt, Exam } from '@/app/lib/exams';
import Link from 'next/link';

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const examId = params.id as string;
  const score = searchParams.get('score');
  
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 認証チェック
    if (authLoading) return;

    if (!user) {
      // 未認証の場合はログインページにリダイレクト
      router.push(`/auth/signin?callbackUrl=/exams/${examId}/result?score=${score}`);
      return;
    }

    const fetchExamData = async () => {
      try {
        setLoading(true);
        // console.log('Fetching exam data for ID:', examId);
        
        // デフォルトの模試データ
        let examData: Exam = {
          id: 'default-free-exam',
          title: 'TOEIC® L&R 模試 Vol.1',
          description: 'TOEIC® L&Rテストの模擬試験です。本番さながらの環境で受験できます。',
          duration: 120,
          price: 0,
          type: 'TOEIC',
          isFree: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Firestoreから模試データを取得（エラー時はデフォルトデータを使用）
        try {
          const fetchedExam = await getExam(examId);
          if (fetchedExam) {
            examData = {
              ...fetchedExam,
              createdAt: fetchedExam.createdAt || new Date(),
              updatedAt: fetchedExam.updatedAt || new Date()
            };
            // console.log('Fetched exam data:', fetchedExam);
          }
        } catch (err) {
          console.error('Error fetching exam:', err);
          // デフォルトデータを使用するのでエラーは無視
        }
        
        setExam(examData);
        
        // ユーザーの回答履歴を取得
        if (user && user.uid) {
          try {
            console.log('Fetching user attempt history for user:', user.uid, 'and exam:', examId);
            const attempts = await getUserExamAttemptsByExam(user.uid, examId);
            console.log('User attempts:', attempts);
            
            if (attempts && attempts.length > 0) {
              // 最新の回答を使用
              setAttempt(attempts[0]);
              console.log('Using latest attempt:', attempts[0]);
            } else {
              console.log('No attempts found, using score from URL parameter');
            }
          } catch (err) {
            console.error('Error fetching user attempts:', err);
            // エラーがあっても続行
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchExamData:', err);
        setError('試験データの取得中にエラーが発生しました。');
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId, router, authLoading, user, score]);

  // スコアに基づいてフィードバックを生成
  const getFeedback = (score: number) => {
    if (score >= 90) return '素晴らしい結果です！高いレベルの理解を示しています。';
    if (score >= 70) return '良い結果です。いくつかの分野でさらなる学習が必要かもしれません。';
    if (score >= 50) return '基本的な理解はありますが、さらなる学習が必要です。';
    return '基礎からの復習をお勧めします。';
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          試験情報の取得に失敗しました。
        </div>
      </div>
    );
  }

  // スコアの取得（優先順位: 1.回答データ 2.URLパラメータ 3.デフォルト値）
  const scoreValue = attempt?.score !== undefined ? attempt.score : 
                    parseInt(score || '0', 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">模試結果</h1>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{exam.title}</h2>
            
            <div className="mb-8 text-center">
              <div className="inline-block rounded-full bg-blue-100 p-4 mb-4">
                <div className="text-5xl font-bold text-blue-600">{scoreValue}<span className="text-2xl">点</span></div>
              </div>
              
              <p className="text-gray-600">{getFeedback(scoreValue)}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">試験情報</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">カテゴリ</p>
                    <p className="font-medium">{exam.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">所要時間</p>
                    <p className="font-medium">{exam.duration}分</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">受験日</p>
                    <p className="font-medium">
                      {attempt?.createdAt ? 
                        (typeof attempt.createdAt.toDate === 'function' ? 
                          new Date(attempt.createdAt.toDate()).toLocaleDateString() : 
                          attempt.createdAt instanceof Date ? 
                            attempt.createdAt.toLocaleDateString() : 
                            new Date().toLocaleDateString()) : 
                        new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/exams/${examId}/take`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors"
              >
                再受験する
              </Link>
              <Link
                href="/mypage"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-center hover:bg-gray-300 transition-colors"
              >
                マイページに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 