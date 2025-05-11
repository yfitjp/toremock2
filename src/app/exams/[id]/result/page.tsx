'use client';

import { useEffect, useState } from 'react';
import {
  useParams,
  useRouter,
  useSearchParams // searchParams を使うのでインポート
} from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getExam } from '@/app/lib/exams';
import { ExamAttempt, ExamData, SectionAttempt } from '@/app/lib/firestoreTypes';
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
        if (!attemptId && !authLoading && !isLoading) { // isLoading をチェックして無限ループを防ぐ
            // user がまだロードされていないか、attemptIdがない場合
            if (!authLoading && !user) setError("User not authenticated. Please log in.");
            else if (!attemptId) setError("Attempt ID not found in URL.");
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
            setError('You do not have permission to view this exam attempt.');
            setAttempt(null);
          }
        } else {
          setError('Exam attempt not found.');
        }
      } catch (err: any) {
        console.error('Error fetching exam result:', err);
        setError(err.message || 'Failed to fetch exam result.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
        fetchResult();
    }
  }, [attemptId, user, authLoading, examId, isLoading]); // isLoading を依存配列に追加

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
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <div className="mt-8 text-center">
            <Link href="/exams" className="text-blue-600 hover:text-blue-800">
                &larr; Go back to exams list
            </Link>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">No exam attempt data found.</p>
        <div className="mt-8">
            <Link href="/exams" className="text-blue-600 hover:text-blue-800">
                &larr; Go back to exams list
            </Link>
        </div>
      </div>
    );
  }

  const examTitleToDisplay = exam?.title || attempt.examTitle || 'Exam Result';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{examTitleToDisplay}</h1>
      <p className="text-lg text-gray-600 mb-6">Result for your attempt on {attempt.completedAt?.toDate().toLocaleDateString()}</p>
      
      <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-3 text-gray-700">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <span className="font-medium text-gray-600">Status:</span> 
            <span className={`ml-2 font-semibold ${attempt.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
              {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
            </span>
          </div>
          {attempt.startedAt && (
            <div><span className="font-medium text-gray-600">Started:</span> {attempt.startedAt?.toDate().toLocaleString()}</div>
          )}
          {attempt.completedAt && (
            <div><span className="font-medium text-gray-600">Completed:</span> {attempt.completedAt?.toDate().toLocaleString()}</div>
          )}
          {attempt.overallScore !== undefined && (
            <div className="md:col-span-2 mt-2">
                <span className="font-medium text-gray-600">Overall Score:</span> 
                <span className="ml-2 text-3xl font-bold text-blue-600">{attempt.overallScore}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-3 text-gray-700">Section Details</h2>
        <div className="space-y-6">
          {Object.entries(attempt.sections || {}).map(([sectionTitle, sectionData]) => {
            const typedSectionData = sectionData as SectionAttempt; // 型アサーション
            return (
            <div key={sectionTitle} className="p-4 bg-gray-50 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{sectionTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div>
                    <span className="font-medium text-gray-600">Status:</span> 
                    <span className={`ml-1 ${typedSectionData.status === 'completed' ? 'text-green-700' : 'text-gray-600'}`}>
                        {typedSectionData.status}
                    </span>
                </div>
                {typedSectionData.score !== undefined ? (
                  <div>
                    <span className="font-medium text-gray-600">Score:</span> 
                    <span className="ml-1 font-semibold text-lg text-blue-700">{typedSectionData.score}%</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-medium text-gray-600">Score:</span> 
                    <span className="ml-1 text-gray-500">N/A</span>
                  </div>
                )}
              </div>
              
              {typedSectionData.feedback && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-600 mb-1">Feedback:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{typedSectionData.feedback}</p>
                </div>
              )}
              {typedSectionData.positive_points && typedSectionData.positive_points.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-md font-semibold text-gray-600 mb-1">Positive Points:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {typedSectionData.positive_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {typedSectionData.areas_for_improvement && typedSectionData.areas_for_improvement.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-md font-semibold text-gray-600 mb-1">Areas for Improvement:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {typedSectionData.areas_for_improvement.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) })}
        </div>
      </div>

      <div className="mt-10 text-center">
          <Link href="/exams" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150">
            &larr; Back to Exams List
          </Link>
      </div>
    </div>
  );
} 