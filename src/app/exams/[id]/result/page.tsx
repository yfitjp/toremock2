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
import { Timestamp, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // searchParams をフックとして呼び出す
  const { user, loading: authLoading } = useAuth();

  const examId = params?.id as string;
  const attemptIdFromQuery = searchParams.get('attemptId');

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [exam, setExam] = useState<ExamData | null>(null);
  const [sections, setSections] = useState<Record<string, SectionAttempt> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttemptData = async (attemptId: string) => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const attemptDocRef = doc(db, 'exam_attempts', attemptId);
        const attemptSnap = await getDoc(attemptDocRef);

        if (attemptSnap.exists()) {
          const rawData = attemptSnap.data();
          if (rawData.userId === user.uid) {
            setAttempt({ id: attemptSnap.id, ...rawData } as ExamAttempt);

            if (rawData.examId) {
              const examData = await getExam(rawData.examId);
              setExam(examData);
            } else if (rawData.examTitle) {
              // examId がない場合でも、タイトルがあれば表示できるようにフォールバック
              setExam({ id: 'unknown', title: rawData.examTitle, type: 'unknown', isFree: true, structure:[] } as ExamData);
            }

            const sectionsRef = collection(db, 'exam_attempts', attemptId, 'sections');
            const sectionsSnap = await getDocs(sectionsRef);
            const sectionsData: Record<string, SectionAttempt> = {};
            sectionsSnap.forEach(doc => {
              sectionsData[doc.id] = doc.data() as SectionAttempt;
            });
            setSections(sectionsData);
          } else {
            setError('You do not have permission to view this exam attempt.');
          }
        } else {
          setError('Exam attempt not found.');
        }
      } catch (err) {
        console.error("Error fetching exam result:", err);
        setError('Failed to load exam result.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && attemptIdFromQuery) {
      fetchAttemptData(attemptIdFromQuery);
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, attemptIdFromQuery, authLoading]);

  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8"><p className="text-red-500">{error}</p></div>;
  }

  if (!attempt || !exam || !sections) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">Loading exam result data...</p>
        <div className="mt-8">
            <Link href="/exams" className="text-blue-600 hover:text-blue-800">
              Return to Exams
            </Link>
        </div>
      </div>
    );
  }

  const examTitleToDisplay = exam?.title || attempt.examTitle || 'Exam Result';
 
  let totalAttemptedScore = 0;
  let totalPossibleScore = 0;

  exam.structure.forEach(sectionDetail => {
    const sectionAttempt = sections[sectionDetail.title];
    if (sectionAttempt && sectionAttempt.score !== undefined) {
      if (sectionDetail.type === 'reading' || sectionDetail.type === 'listening') {
         totalAttemptedScore += sectionAttempt.score; // Assuming score is a percentage 0-100
         totalPossibleScore += 100; 
      }
      // Add logic for other section types (writing, speaking) if their scores contribute differently
    }
  });
  
  const displayScore = attempt.overallScore ?? (totalPossibleScore > 0 ? Math.round((totalAttemptedScore / totalPossibleScore) * 100) : 0) ;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{examTitleToDisplay}</h1>
        <p className="text-gray-600">Attempt ID: {attempt.id}</p>
        {attempt.completedAt && (
          <p className="text-sm text-gray-500">
            Completed on: {new Date(attempt.completedAt.seconds * 1000).toLocaleString()}
          </p>
        )}
      </header>

      <section className="mb-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overall Performance</h2>
        <div className="text-5xl font-bold text-center text-blue-600 mb-4">{displayScore}%</div> 
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Section Breakdown</h2>
        {exam.structure.map((sectionDetail, index) => {
          const sectionAttemptData = sections[sectionDetail.title];
          // セクションデータがない場合は何も表示しないか、「未受験」などと表示
          if (!sectionAttemptData) {
            return (
              <div key={index} className="mb-6 p-6 bg-white shadow-md rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{sectionDetail.title}</h3>
                <p className="text-gray-500">No attempt data for this section.</p>
              </div>
            );
          }

          return (
            <div key={index} className="mb-6 p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{sectionDetail.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Status: <span className="font-medium text-gray-700">{sectionAttemptData.status}</span></p>
                  {sectionAttemptData.score !== undefined && (
                    <p className="text-gray-600">Score: <span className="font-medium text-green-600">{sectionAttemptData.score}%</span></p>
                  )}
                </div>
                {sectionAttemptData.feedback && (
                  <div className="md:col-span-2 mt-2 pt-3 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 mb-1">Feedback:</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{sectionAttemptData.feedback}</p>
                  </div>
                )}
                 {(sectionAttemptData.positive_points && sectionAttemptData.positive_points.length > 0) && (
                  <div className="md:col-span-2 mt-2 pt-3 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-green-700 mb-1">Positive Points:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {sectionAttemptData.positive_points.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  </div>
                )}
                {(sectionAttemptData.areas_for_improvement && sectionAttemptData.areas_for_improvement.length > 0) && (
                  <div className="md:col-span-2 mt-2 pt-3 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-red-700 mb-1">Areas for Improvement:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {sectionAttemptData.areas_for_improvement.map((area, i) => <li key={i}>{area}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-12 text-center">
        <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
} 