'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExamForm from './ExamForm';
import { useAuth } from '@/app/hooks/useAuth';
import { getExam, getExamQuestions, Question as FirestoreQuestion, Exam } from '@/app/lib/exams';
import { hasActiveSubscription } from '@/app/lib/subscriptions';
import { checkExamPurchase } from '@/app/lib/purchases';

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
  const { user, loading: authLoading } = useAuth();
  const [examInfo, setExamInfo] = useState<Exam | null>(null);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. 認証と権限チェック
  useEffect(() => {
    const checkAuthorization = async () => {
      if (authLoading) return; // 認証情報読み込み中は待機

      if (!user) {
        router.push('/auth/signin?redirect=/exams/' + params.id + '/take'); // リダイレクト先を指定
        return;
      }

      setIsLoading(true); // 権限チェック開始
      setError(null); // エラーをリセット

      try {
        // まず模試情報を取得 (無料かどうかの確認のため)
        const currentExamInfo = await getExam(params.id);
        if (!currentExamInfo) {
          setError('模試情報が見つかりません。');
          setIsLoading(false);
          return;
        }
        setExamInfo(currentExamInfo); // 模試情報を保存

        // 無料模試なら即座に権限OK
        if (currentExamInfo.isFree) {
          setIsAuthorized(true);
          // ローディングは fetchExamData 側で解除するのでここでは何もしない
          return;
        }

        // 有料模試の場合、サブスクリプションと購入状態を確認
        const hasSubscription = await hasActiveSubscription(user.uid);
        const isPurchased = await checkExamPurchase(user.uid, params.id);

        if (hasSubscription || isPurchased) {
          setIsAuthorized(true);
        } else {
          setError('この模試を受験する権限がありません。購入またはサブスクリプションが必要です。');
          // 必要であれば購入ページなどにリダイレクト
          // router.push(`/exams/${params.id}/purchase`);
        }
      } catch (err) {
        console.error('権限チェックまたは模試情報取得エラー:', err);
        // FirebaseError の場合、より具体的なメッセージを表示することも検討
        if (err instanceof Error && 'code' in err && err.code === 'permission-denied') {
             setError('データのアクセス権限がありません。Firestoreのセキュリティルールを確認してください。');
        } else {
             setError('権限の確認中にエラーが発生しました。');
        }
      } finally {
        // isAuthorized が false の場合のみローディングを完了させる
        // isAuthorized が true の場合は fetchExamData がローディングを管理する
         if (!isAuthorized) {
            setIsLoading(false);
         }
      }
    };

    checkAuthorization();
    // isAuthorized の変更で再実行しないようにする
  }, [user, authLoading, params.id, router]);

  // 2. 権限があり、模試情報が取得できたら問題データを取得
  useEffect(() => {
    const fetchExamData = async () => {
      // isAuthorized が true で、examInfo がセットされたら実行
      // isLoading は checkAuthorization で true に設定されているか、
      // 無料模試の場合はまだ true のままのはず

      try {
        const questions = await getExamQuestions(params.id);

        if (!questions || questions.length === 0) {
          setError('問題が登録されていません。');
          setIsLoading(false); // エラー時はローディング解除
          return;
        }

        console.log('取得した問題データ:', questions);

        const formattedQuestions: ExamQuestion[] = questions.map((q, index) => {
           let imageUrl = q.imageUrl;
           // デバッグ用: 各問題のimageUrlをログ出力
           if (q.imageUrl) {
             console.log(`問題${index+1} 画像URL:`, q.imageUrl);
           }
           
           // Firebase Storage URLの修正
           if (imageUrl && imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
             console.log('Firebase Storage URL確認済み:', imageUrl);
           }

          return {
            id: q.id,
            content: q.content || '',
            questionNumber: index + 1,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            questionType: q.questionType || 'multiple-choice',
            sectionType: q.sectionType || 'reading',
            imageUrl: imageUrl,
            audioUrl: q.audioUrl
          };
        });

        setExamData({
          id: examInfo!.id, // examInfo は non-null であることが保証される
          title: examInfo!.title,
          description: examInfo!.description,
          duration: examInfo!.duration,
          type: examInfo!.type,
          questions: formattedQuestions
        });
        setError(null); // エラーがなければリセット

      } catch (err) {
        console.error('問題データの取得中にエラーが発生しました:', err);
         if (err instanceof Error && 'code' in err && err.code === 'permission-denied') {
             setError('問題データへのアクセス権限がありません。Firestoreのセキュリティルールを確認してください。');
        } else {
            setError('問題データの取得中にエラーが発生しました。');
        }
      } finally {
        setIsLoading(false); // データ取得（成功または失敗）後にローディング完了
      }
    };

    // isAuthorized が true になり、examInfo もセットされたら実行
    if (isAuthorized && examInfo) {
        fetchExamData();
    }
    // fetchExamData を isAuthorized と examInfo の変更時にのみ実行させる
  }, [isAuthorized, examInfo, params.id]); // 依存配列を修正

  if (authLoading || isLoading) {
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
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          模試データを読み込んでいます... (または、予期せぬエラーが発生しました)
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
        <ExamForm examId={params.id} questions={examData.questions} examType={examData.type} />
      )}
    </div>
  );
} 