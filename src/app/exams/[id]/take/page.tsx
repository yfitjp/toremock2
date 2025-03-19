'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExamForm from './ExamForm';
import { useAuth } from '@/app/hooks/useAuth';
import { getExam, getExamQuestions, Question as FirestoreQuestion } from '@/app/lib/exams';

// ExamFormに渡すQuestion型定義
interface ExamQuestion {
  id: string;
  content?: string;
  questionNumber?: number;
  options: string[];
  correctAnswer: number;
  imageUrl?: string;
  audioUrl?: string;
  questionType?: 'multiple-choice' | 'text-input' | 'speaking' | 'writing';
  sectionType?: 'reading' | 'listening' | 'writing' | 'speaking';
}

interface ExamData {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  type: string;
  questions: ExamQuestion[];
}

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 認証状態の確認
    if (!loading) {
      if (!user) {
        // 未ログインの場合はログインページにリダイレクト
        router.push('/auth/signin');
      } else {
        // ログイン済みの場合は権限チェック（ここでは簡易的に全ユーザーに権限を付与）
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchExamData = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        // 模試の基本情報を取得
        const examInfo = await getExam(params.id);
        
        if (!examInfo) {
          setError('模試情報が見つかりません。');
          setIsLoading(false);
          return;
        }
        
        // 模試の問題を取得
        const questions = await getExamQuestions(params.id);
        
        if (!questions || questions.length === 0) {
          setError('問題が登録されていません。');
          setIsLoading(false);
          return;
        }
        
        // 全データを組み合わせて設定（型を合わせるための変換）
        const formattedQuestions: ExamQuestion[] = questions.map((q, index) => ({
          id: q.id,
          content: q.content || '',  // Firestoreから取得したQuestionはcontentフィールドを持つ
          questionNumber: index + 1,  // 問題番号を設定
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          // 以下のフィールドはFirestoreのQuestionから取得、または仮のデフォルト値を設定
          questionType: q.questionType || 'multiple-choice', 
          sectionType: q.sectionType || 'reading'
          // 現在のFirestore設計ではimageUrlとaudioUrlは含まれていない
        }));
        
        setExamData({
          ...examInfo,
          questions: formattedQuestions
        });
        
      } catch (err) {
        console.error('模試データの取得中にエラーが発生しました:', err);
        setError('模試データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) {
      fetchExamData();
    }
  }, [params.id, isAuthorized]);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          この模試を受験する権限がありません。
        </div>
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

  if (!examData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          模試データを読み込めませんでした。
        </div>
      </div>
    );
  }

  // 試験タイプに応じたタイトルや説明を設定
  const examTypeLabel = {
    'TOEIC': 'TOEIC® TEST',
    'TOEFL': 'TOEFL iBT® TEST',
    'EIKEN': '英検®'
  }[examData.type || 'TOEIC'] || '模試';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{examData.title || '模試'}</h1>
        <div className="flex items-center mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            {examTypeLabel}
          </span>
        </div>
        <p className="text-gray-600 mb-4">
          {examData.description || '以下の問題に回答してください。'}
        </p>
        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium">注意事項:</span>
          </div>
          <ul className="ml-7 mt-2 list-disc text-sm text-gray-700">
            <li>制限時間は{examData.duration || 60}分です。時間内に全ての問題に回答してください。</li>
            <li>1度提出した回答は修正できません。回答を確認してから「回答を提出する」ボタンをクリックしてください。</li>
            <li>リスニング問題では、ヘッドフォンまたはイヤホンの使用をお勧めします。</li>
            <li>試験中に他のページへ移動すると、進捗が失われる可能性があります。</li>
          </ul>
        </div>
      </div>
      
      {examData.questions && examData.questions.length > 0 && (
        <ExamForm examId={params.id} questions={examData.questions} />
      )}
    </div>
  );
} 