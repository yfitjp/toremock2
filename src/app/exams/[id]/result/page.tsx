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
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const exam = await getExam(id);

  if (!exam) {
    return {
      title: '模試の結果',
    };
  }

  // 結果ページなので、robotsタグでnoindexを指定
  return {
    title: `結果: ${exam.title}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

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
      const typeOrder = sectionOrder; // sectionOrder を使用
      const indexA = typeOrder.indexOf(a.data.type);
      const indexB = typeOrder.indexOf(b.data.type);

      // まず SectionType でソート
      if (indexA !== indexB) {
        if (indexA === -1) return 1; // typeOrder にないものは後方へ
        if (indexB === -1) return -1; // typeOrder にないものは後方へ
        return indexA - indexB;
      }

      // 同じ SectionType の場合、completedAt でソート (昇順)
      // completedAt が Timestamp オブジェクトであることを想定
      // completedAt が存在しない場合は後方に (実際には完了済みセクションには存在するはず)
      const timeA = a.data.completedAt?.toMillis() || Number.MAX_SAFE_INTEGER;
      const timeB = b.data.completedAt?.toMillis() || Number.MAX_SAFE_INTEGER;

      return timeA - timeB;
    });

  // パート別スコアと総合スコアの計算ロジックを削除し、attempt から直接取得するように変更
  // const calculateScores = () => {
  //   const partScores: { [key in SectionType]?: number } = {};
  //   let totalCalculatedScore = 0;

  //   sectionOrder.forEach(partType => {
  //     const sectionsForPart = Object.values(attempt.sections || {})
  //       .filter(section => section.type === partType && section.score !== undefined);

  //     if (sectionsForPart.length > 0) {
  //       const averageScore = sectionsForPart.reduce((sum, section) => sum + (section.score || 0), 0) / sectionsForPart.length;
  //       const partScore = Math.round(averageScore * 0.3); // 100点満点を30点満点に換算し四捨五入
  //       partScores[partType] = partScore;
  //       totalCalculatedScore += partScore;
  //     } else {
  //       partScores[partType] = 0; // スコアがない場合は0点として扱う
  //     }
  //   });

  //   return { partScores, totalCalculatedScore };
  // };

  // const { partScores, totalCalculatedScore } = calculateScores();

  // Firestore から取得したスコアを使用
  const partScores: { [key in 'reading' | 'listening' | 'speaking' | 'writing']?: number } = {
    reading: attempt.readingScore,
    listening: attempt.listeningScore,
    speaking: attempt.speakingScore,
    writing: attempt.writingScore,
  };
  const totalCalculatedScore = attempt.totalScore;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{examTitleToDisplay}</h1>
      <p className="text-lg text-gray-600 mb-6">{attempt.completedAt?.toDate().toLocaleDateString()} の試行結果</p>
      
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-blue-400">スコア概要</h2>
        <div className="text-center mb-6">
          <p className="text-lg font-medium opacity-90">総合スコア</p>
          <p className="text-6xl font-bold my-2">
            {totalCalculatedScore !== undefined ? totalCalculatedScore : 'N/A'}
            <span className="text-3xl opacity-80">/120</span>
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {sectionOrder.map(partType => (
            <div key={partType} className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-lg shadow">
              <p className="text-sm font-medium capitalize opacity-90">{partType}</p>
              <p className="text-2xl font-bold">
                {partScores[partType as keyof typeof partScores] !== undefined ? partScores[partType as keyof typeof partScores] : 'N/A'}
                <span className="text-sm opacity-80">/30</span>
              </p>
            </div>
          ))}
        </div>
        {attempt.startedAt && attempt.completedAt && (
          <div className="mt-6 pt-4 border-t border-blue-400 border-opacity-50 text-xs opacity-80 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <p><span className="font-semibold">開始:</span> {attempt.startedAt?.toDate().toLocaleString()}</p>
            <p><span className="font-semibold">完了:</span> {attempt.completedAt?.toDate().toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-3 text-blue-700">セクション詳細</h2>
        <div className="space-y-8">
          {displaySections.map(({ title: sectionTitle, data: typedSectionData }) => (
            <div key={sectionTitle} className="p-5 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">{sectionTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-3">
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
              {((typedSectionData.answers && Object.keys(typedSectionData.answers).length > 0) || typedSectionData.transcribedText || typedSectionData.revisedEssay || typedSectionData.revisedTranscribedText) && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-600 mb-2">あなたの回答:</h4>
                  
                  {/* Speakingの文字起こしと添削結果 */}
                  {typedSectionData.type === 'speaking' && typedSectionData.transcribedText && (
                    <div className="mb-3 p-3 bg-gray-100 rounded-lg shadow-sm">
                      <h5 className="text-sm font-semibold text-gray-500 mb-1">あなたのスピーチ:</h5>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{typedSectionData.transcribedText}</p>
                    </div>
                  )}
                  {typedSectionData.type === 'speaking' && typedSectionData.revisedTranscribedText && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                      <h5 className="text-sm font-semibold text-green-700 mb-1">AIによる添削結果 (スピーキング):</h5>
                      <p className="text-sm text-green-800 whitespace-pre-wrap">{typedSectionData.revisedTranscribedText}</p>
                    </div>
                  )}

                  {/* Writingのエッセイと添削結果 */}
                  {typedSectionData.type === 'writing' && typedSectionData.answers && Object.keys(typedSectionData.answers).length > 0 && (
                     Object.entries(typedSectionData.answers).map(([questionId, answer]) => (
                        <div key={`${questionId}-original`} className="mb-3 p-3 bg-gray-100 rounded-lg shadow-sm">
                            <h5 className="text-sm font-semibold text-gray-500 mb-1">あなたのエッセイ:</h5>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{String(answer)}</p>
                        </div>
                    ))
                  )}
                  {typedSectionData.type === 'writing' && typedSectionData.revisedEssay && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                        <h5 className="text-sm font-semibold text-green-700 mb-1">AIによる添削結果 (ライティング):</h5>
                        <p className="text-sm text-green-800 whitespace-pre-wrap">{typedSectionData.revisedEssay}</p>
                    </div>
                  )}

                  {/* Reading/Listening の選択式問題の回答 (既存ロジックを少し調整) */}
                  { (typedSectionData.type === 'reading' || typedSectionData.type === 'listening') && typedSectionData.answers && Object.keys(typedSectionData.answers).length > 0 && (
                    <dl className="space-y-1 text-sm text-gray-800">
                      {Object.entries(typedSectionData.answers).map(([questionId, answer], index) => (
                          <div key={questionId} className="p-2 bg-gray-100 rounded">
                            <span className="font-semibold text-gray-500">
                              {`${index + 1}: `}
                            </span>
                            <span className="ml-1 whitespace-pre-wrap">
                              {typeof answer === 'number' ? 
                                (answer === -1 ? '未回答' : String.fromCharCode(65 + answer)) 
                                : String(answer)
                              }
                            </span>
                          </div>
                        )
                      )}
                    </dl>
                  )}
                   {/* Speakingの録音音声再生 (既存のanswersループから独立して表示) */}
                   {typedSectionData.type === 'speaking' && typedSectionData.answers && Object.entries(typedSectionData.answers).map(([questionId, answer]) => {
                        if (typeof answer === 'string' && (answer.startsWith('http') || answer.startsWith('blob:'))) {
                            return (
                                <div key={`${questionId}-audio`} className="mt-2 p-2 bg-gray-100 rounded-lg shadow-sm">
                                    <h5 className="text-sm font-semibold text-gray-500 mb-1">録音音声:</h5>
                                    <audio controls src={answer} className="w-full max-w-xs" />
                                </div>
                            );
                        }
                        return null;
                    })}
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

      <div className="mt-12 text-center">
          <Link href="/exams" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
            &larr; 試験一覧に戻る
          </Link>
      </div>
    </div>
  );
} 