'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { addDocument } from '@/app/lib/firestore';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number;
}

interface ExamFormProps {
  examId: string;
  questions: Question[];
}

export default function ExamForm({ examId, questions }: ExamFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60分（秒単位）
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 残り時間のカウントダウン
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 回答の選択
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // 次の問題へ
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // 前の問題へ
  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // 回答の提出
  const handleSubmit = async () => {
    if (!user) {
      setError('ログインが必要です。');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 正解数を計算
      let correctCount = 0;
      const totalQuestions = questions.length;
      
      for (const question of questions) {
        if (question.correctAnswer !== undefined && answers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      }
      
      // スコアを計算（100点満点）
      const score = Math.round((correctCount / totalQuestions) * 100);
      
      // 回答データをFirestoreに保存
      await addDocument('exam_attempts', {
        userId: user.uid,
        examId: examId,
        answers: answers,
        score: score,
        completedAt: new Date(),
      });

      // 結果ページへリダイレクト
      router.push(`/exams/${examId}/result?score=${score}`);
    } catch (err) {
      console.error('Error submitting exam:', err);
      setError('回答の提出中にエラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  // 残り時間のフォーマット
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // 現在の問題
  const currentQuestionData = questions[currentQuestion];

  if (!currentQuestionData) {
    return <div>問題が見つかりません。</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          問題 {currentQuestion + 1} / {questions.length}
        </div>
        <div className="text-lg font-medium text-red-600 dark:text-red-400">
          残り時間: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">{currentQuestionData.text}</h2>
        <div className="space-y-3">
          {currentQuestionData.options.map((option, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestionData.id] === index
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => handleAnswerSelect(currentQuestionData.id, index)}
            >
              <label className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  className="mt-1 mr-2"
                  checked={answers[currentQuestionData.id] === index}
                  onChange={() => handleAnswerSelect(currentQuestionData.id, index)}
                />
                <span className="dark:text-gray-200">{option}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestion === 0
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          前の問題
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            次の問題
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md ${
              isSubmitting
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSubmitting ? '提出中...' : '回答を提出する'}
          </button>
        )}
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                answers[questions[index].id] !== undefined
                  ? 'bg-green-500 text-white'
                  : currentQuestion === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 