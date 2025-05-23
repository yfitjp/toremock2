'use client';

import { useEffect, useState } from 'react';
import {
  useParams,
  useRouter,
  useSearchParams // searchParams を使うのでインポート
} from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getExam } from '@/app/lib/exams';
import { ExamAttempt, ExamData, SectionAttempt, SectionType } from '@/app/lib/firestoreTypes';
import Link from 'next/link';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // searchParams をフックとして呼び出す
  const { user, loading: authLoading } = useAuth();

  const examId = params?.id as string;
  const attemptId = searchParams.get('attemptId'); // クエリパラメータから attemptId を取得

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [exam, setExam] = useState<ExamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!attemptId || !user) {
        setIsLoading(false); 
        if (!authLoading) { 
            if (!user) setError("ユーザーが認証されていません。ログインしてください。");
            else if (!attemptId) setError("URLに試行IDが見つかりません。");
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const attemptRef = doc(db, 'exam_attempts', attemptId);
        const attemptSnap = await getDoc(attemptRef);

        if (attemptSnap.exists()) {
          const attemptData = attemptSnap.data() as ExamAttempt;
          if (attemptData.userId === user.uid) {
            setAttempt({ id: attemptSnap.id, ...attemptData });

            if (attemptData.examId) {
              const examData = await getExam(attemptData.examId);
              setExam(examData);
            } else if (attemptData.examTitle) {
              setExam({ id: 'unknown', title: attemptData.examTitle, type: 'unknown', isFree: true, structure:[] });
            }
          } else {
            setError('この試験の試行結果を閲覧する権限がありません。');
            setAttempt(null);
          }
        } else {
          setError('試験の試行が見つかりません。');
        }
      } catch (err: any) {
        console.error('Error fetching exam result:', err);
        setError(err.message || '試験結果の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
        fetchResult();
    }
  }, [attemptId, user, authLoading, examId]); // isLoading を依存配列から削除

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">エラー:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <div className="mt-8 text-center">
            <Link href="/exams" className="text-blue-600 hover:text-blue-800">
                &larr; 試験一覧に戻る
            </Link>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">試験の試行データが見つかりません。</p>
        <div className="mt-8">
            <Link href="/exams" className="text-blue-600 hover:text-blue-800">
                &larr; 試験一覧に戻る
            </Link>
        </div>
      </div>
    );
  }

  const examTitleToDisplay = exam?.title || attempt.examTitle || '試験結果';

  const sectionOrder: SectionType[] = ['reading', 'listening', 'speaking', 'writing'];

  const displaySections = Object.entries(attempt.sections || {})
    .map(([sectionTitle, sectionData]) => ({
      title: sectionTitle,
      data: sectionData as SectionAttempt,
    }))
    .filter(({ data }) => (data.answers && Object.keys(data.answers).length > 0) || data.score !== undefined)
    .sort((a, b) => {
      const indexA = sectionOrder.indexOf(a.data.type);
      const indexB = sectionOrder.indexOf(b.data.type);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  // パート別スコアと総合スコアの計算
  const calculateScores = () => {
    const partScores: { [key in SectionType]?: number } = {};
    let totalCalculatedScore = 0;

    sectionOrder.forEach(partType => {
      const sectionsForPart = Object.values(attempt.sections || {})
        .filter(section => section.type === partType && section.score !== undefined);

      if (sectionsForPart.length > 0) {
        const averageScore = sectionsForPart.reduce((sum, section) => sum + (section.score || 0), 0) / sectionsForPart.length;
        const partScore = Math.round(averageScore * 0.3); // 100点満点を30点満点に換算し四捨五入
        partScores[partType] = partScore;
        totalCalculatedScore += partScore;
      } else {
        partScores[partType] = 0; // スコアがない場合は0点として扱う
      }
    });

    return { partScores, totalCalculatedScore };
  };

  const { partScores, totalCalculatedScore } = calculateScores();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{examTitleToDisplay}</h1>
      <p className="text-lg text-gray-600 mb-6">{attempt.completedAt?.toDate().toLocaleDateString()} の試行結果</p>
      
      <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-3 text-gray-700">概要</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <span className="font-medium text-gray-600">ステータス:</span> 
            <span className={`ml-2 font-semibold ${attempt.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
              {attempt.status === 'completed' ? '完了' : attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
            </span>
          </div>
          {attempt.startedAt && (
            <div><span className="font-medium text-gray-600">開始日時:</span> {attempt.startedAt?.toDate().toLocaleString()}</div>
          )}
          {attempt.completedAt && (
            <div><span className="font-medium text-gray-600">完了日時:</span> {attempt.completedAt?.toDate().toLocaleString()}</div>
          )}
          {/* 新しいスコア表示 */}
          <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
            <p className="text-xl font-semibold text-gray-700 mb-2">
              あなたのスコア： <span className="text-3xl font-bold text-blue-600">{totalCalculatedScore}</span>/120
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-md">
              {sectionOrder.map(partType => (
                <div key={partType}>
                  <span className="capitalize">{partType}</span>: 
                  <span className="font-semibold ml-1">{partScores[partType] !== undefined ? partScores[partType] : 'N/A'}/30</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-3 text-gray-700">セクション詳細</h2>
        <div className="space-y-6">
          {displaySections.map(({ title: sectionTitle, data: typedSectionData }) => (
            <div key={sectionTitle} className="p-4 bg-gray-50 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{sectionTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div>
                    <span className="font-medium text-gray-600">ステータス:</span> 
                    <span className={`ml-1 ${typedSectionData.status === 'completed' ? 'text-green-700' : 'text-gray-600'}`}>
                        {typedSectionData.status === 'completed' ? '完了' : typedSectionData.status}
                    </span>
                </div>
                {typedSectionData.score !== undefined ? (
                  <div>
                    <span className="font-medium text-gray-600">スコア:</span> 
                    <span className="ml-1 font-semibold text-lg text-blue-700">{typedSectionData.score}%</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-medium text-gray-600">スコア:</span> 
                    <span className="ml-1 text-gray-500">なし</span>
                  </div>
                )}
              </div>
              
              {/* 回答表示セクション */}
              {((typedSectionData.answers && Object.keys(typedSectionData.answers).length > 0) || typedSectionData.transcribedText) && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-600 mb-2">あなたの回答:</h4>
                  {typedSectionData.transcribedText && (
                    <div className="mb-3 p-2 bg-gray-100 rounded">
                      <h5 className="text-sm font-semibold text-gray-500 mb-1">音声認識結果:</h5>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{typedSectionData.transcribedText}</p>
                    </div>
                  )}
                  {typedSectionData.answers && Object.entries(typedSectionData.answers).length > 0 && (
                    <dl className="space-y-2 text-sm text-gray-800">
                      {Object.entries(typedSectionData.answers).map(([questionId, answer], index) => (
                        <div key={questionId} className="p-2 bg-gray-100 rounded">
                          <dt className="font-semibold text-gray-500">{index + 1}:</dt>
                          <dd className="ml-2 mt-1 whitespace-pre-wrap">
                            {typeof answer === 'number'
                              ? String.fromCharCode(65 + answer) // 0=A, 1=B, 2=C, 3=D
                              : answer}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              )}

              {typedSectionData.feedback && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-600 mb-1">フィードバック:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{typedSectionData.feedback}</p>
                </div>
              )}
              {typedSectionData.positive_points && typedSectionData.positive_points.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-md font-semibold text-gray-600 mb-1">良かった点:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {typedSectionData.positive_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {typedSectionData.areas_for_improvement && typedSectionData.areas_for_improvement.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-md font-semibold text-gray-600 mb-1">改善点:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {typedSectionData.areas_for_improvement.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
          <Link href="/exams" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150">
            &larr; 試験一覧に戻る
          </Link>
      </div>
    </div>
  );
} 