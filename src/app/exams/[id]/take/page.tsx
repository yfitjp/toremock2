'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExamForm from './ExamForm';
import { useAuth } from '@/app/hooks/useAuth';
import { getExamData } from '@/app/lib/firestore';

// ダミーの問題データ（Firestoreからデータが取得できない場合のフォールバック）
const dummyExam = {
  id: 'default-free-exam',
  title: 'TOEIC® L&R 模試 Vol.1',
  questions: [
    {
      id: '1',
      text: '問題1: "The company is looking for a new marketing director" の意味として最も適切なものを選びなさい。',
      options: [
        '会社は新しいマーケティングディレクターを探している。',
        '会社は新しいマーケティング戦略を検討している。',
        'マーケティングディレクターは会社を探している。',
        '新しいマーケティングディレクターが会社を見ている。'
      ],
      correctAnswer: 0
    },
    {
      id: '2',
      text: '問題2: "Please submit your report by Friday" の意味として最も適切なものを選びなさい。',
      options: [
        '金曜日までにレポートを提出してください。',
        '金曜日にレポートを受け取ってください。',
        'レポートは金曜日に作成されました。',
        'レポートを金曜日に確認します。'
      ],
      correctAnswer: 0
    },
    {
      id: '3',
      text: '問題3: "The meeting has been postponed until next week" の意味として最も適切なものを選びなさい。',
      options: [
        '会議は来週まで延期されました。',
        '会議は来週から始まります。',
        '来週の会議は中止されました。',
        '会議は来週も続きます。'
      ],
      correctAnswer: 0
    },
    {
      id: '4',
      text: '問題4: "She has been working for this company for ten years" の意味として最も適切なものを選びなさい。',
      options: [
        '彼女はこの会社で10年間働いています。',
        '彼女はこの会社で10年後に働く予定です。',
        '彼女は10年前にこの会社で働いていました。',
        '彼女は10年間この会社を経営しています。'
      ],
      correctAnswer: 0
    },
    {
      id: '5',
      text: '問題5: "The new product will be launched next month" の意味として最も適切なものを選びなさい。',
      options: [
        '新製品は来月発売される予定です。',
        '新製品は来月製造される予定です。',
        '来月は新製品の宣伝を行います。',
        '新製品の開発は来月から始まります。'
      ],
      correctAnswer: 0
    }
  ]
};

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [examData, setExamData] = useState<any>(null);
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
        const data = await getExamData(params.id);
        
        if (data) {
          console.log('Fetched exam data:', data);
          setExamData(data);
        } else {
          console.warn('Exam data not found, using dummy data');
          setExamData(dummyExam);
        }
      } catch (err) {
        console.error('Error fetching exam data:', err);
        setError('模試データの取得中にエラーが発生しました。');
        setExamData(dummyExam);
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
      <div className="flex justify-center items-center min-h-screen">
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{examData?.title || 'テスト'}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        以下の問題に回答してください。制限時間は{examData?.timeLimit || 60}分です。
      </p>
      
      <ExamForm examId={params.id} questions={examData?.questions || dummyExam.questions} />
    </div>
  );
} 