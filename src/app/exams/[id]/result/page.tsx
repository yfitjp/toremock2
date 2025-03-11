'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  feedback: string;
}

export default function ExamResultPage() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const [result, setResult] = useState<ExamResult>({
    score: score ? parseInt(score) : 0,
    totalQuestions: 5,
    correctAnswers: score ? Math.round(parseInt(score) / 20) : 0,
    timeSpent: 120,
    feedback: ''
  });

  useEffect(() => {
    // スコアに基づいてフィードバックを設定
    if (result.score >= 800) {
      setResult(prev => ({ ...prev, feedback: '素晴らしい結果です！TOEIC® L&Rテストで高得点を目指せる実力がついています。' }));
    } else if (result.score >= 600) {
      setResult(prev => ({ ...prev, feedback: '良い結果です。弱点を克服することで、さらにスコアを伸ばすことができます。' }));
    } else {
      setResult(prev => ({ ...prev, feedback: '基礎力を固めることで、スコアを大幅に向上させることができます。' }));
    }
  }, [result.score]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg p-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">模試結果</h1>
            
            <div className="mb-8">
              <div className="text-6xl font-bold text-blue-600 mb-4">
                {result.score}
              </div>
              <div className="text-xl text-gray-900">点</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-900 font-medium">正解数</div>
                <div className="text-2xl font-bold text-gray-900">{result.correctAnswers}/{result.totalQuestions}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-900 font-medium">所要時間</div>
                <div className="text-2xl font-bold text-gray-900">{result.timeSpent}分</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <p className="text-blue-900">{result.feedback}</p>
            </div>

            <div className="space-y-4">
              <Link
                href="/mypage"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                マイページへ戻る
              </Link>
              <Link
                href="/exams"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
              >
                他の模試を受験する
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 