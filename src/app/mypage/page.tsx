'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getFreeExams, Exam } from '@/app/lib/exams';
import { getUserPurchases, Purchase } from '@/app/lib/purchases';
import { getUserExamAttempts, ExamAttempt } from '@/app/lib/exams';
import { formatTimestamp } from '@/app/lib/firestore';
import { auth } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// マイページで表示する模試情報の型
interface UserExam {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  type: string;
  completed: boolean;
  isFree: boolean;
  score?: number;
  completedAt?: any;
  purchaseDate?: any;
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userExams, setUserExams] = useState<UserExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  useEffect(() => {
    // NextAuthのセッションがない場合はログインページにリダイレクト
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    // Firebaseの認証状態を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status !== 'authenticated' && !firebaseUser) return;

      try {
        setLoading(true);
        const userId = firebaseUser?.uid || (session?.user as any)?.id;
        
        if (!userId) {
          setError('ユーザー情報が取得できませんでした。');
          setLoading(false);
          return;
        }

        // 無料模試を取得
        const freeExams = await getFreeExams();
        
        // ユーザーの購入情報を取得
        const purchases = await getUserPurchases(userId);
        
        // ユーザーの模試回答履歴を取得
        const attempts = await getUserExamAttempts(userId);
        
        // 無料模試と購入済み模試を結合
        const userExamsData: UserExam[] = [];
        
        // 無料模試を追加
        for (const exam of freeExams) {
          const examAttempts = attempts.filter(a => a.examId === exam.id);
          const latestAttempt = examAttempts.length > 0 ? examAttempts[0] : null;
          
          userExamsData.push({
            id: exam.id,
            title: exam.title,
            description: exam.description,
            duration: exam.duration,
            difficulty: exam.difficulty,
            type: exam.type,
            completed: examAttempts.length > 0,
            isFree: true,
            score: latestAttempt?.score,
            completedAt: latestAttempt?.createdAt,
          });
        }
        
        // 購入済み模試を追加
        for (const purchase of purchases) {
          if (purchase.status !== 'completed') continue;
          
          // 既に追加済みの模試はスキップ
          if (userExamsData.some(e => e.id === purchase.examId)) continue;
          
          // 模試情報を取得
          const examData = await getExam(purchase.examId);
          if (!examData) continue;
          
          const examAttempts = attempts.filter(a => a.examId === purchase.examId);
          const latestAttempt = examAttempts.length > 0 ? examAttempts[0] : null;
          
          userExamsData.push({
            id: examData.id,
            title: examData.title,
            description: examData.description,
            duration: examData.duration,
            difficulty: examData.difficulty,
            type: examData.type,
            completed: examAttempts.length > 0,
            isFree: false,
            score: latestAttempt?.score,
            completedAt: latestAttempt?.createdAt,
            purchaseDate: purchase.createdAt,
          });
        }
        
        setUserExams(userExamsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('データの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, firebaseUser]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">マイページ</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">プロフィール情報</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">あなたのアカウント情報です。</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">名前</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {session?.user?.name || firebaseUser?.displayName || '未設定'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {session?.user?.email || firebaseUser?.email || '未設定'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">登録日</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {firebaseUser?.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString('ja-JP') : '不明'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">利用可能な模試</h2>
          
          {userExams.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500">利用可能な模試はありません。</p>
              <Link
                href="/exams"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                模試を探す
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userExams.map((exam) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                      {exam.isFree && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          無料
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{exam.description}</p>
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="text-sm text-gray-500 mb-1">
                        {exam.type}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {exam.difficulty}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      所要時間: {exam.duration}分
                    </div>
                    {exam.purchaseDate && (
                      <div className="mt-2 text-xs text-gray-400">
                        購入日: {formatTimestamp(exam.purchaseDate)}
                      </div>
                    )}
                    <div className="mt-6">
                      {exam.completed ? (
                        <div className="text-center">
                          <p className="text-sm text-gray-900">スコア: {exam.score}点</p>
                          <p className="text-xs text-gray-500 mt-1">
                            受験日: {formatTimestamp(exam.completedAt)}
                          </p>
                          <Link
                            href={`/exams/${exam.id}/take`}
                            className="mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            再受験する
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/exams/${exam.id}/take`}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          受験する
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// 特定の模試を取得する関数（lib/exams.tsから取得できない場合のフォールバック）
async function getExam(examId: string): Promise<Exam | null> {
  try {
    // Firebaseから模試データを取得
    const { getDocument } = await import('@/app/lib/firestore');
    const { COLLECTIONS } = await import('@/app/lib/firestore');
    return await getDocument<Exam>(COLLECTIONS.EXAMS, examId);
  } catch (error) {
    console.error(`Error getting exam with ID ${examId}:`, error);
    return null;
  }
} 