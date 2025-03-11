'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface ExamFormProps {
  examId: string;
  questions: Question[];
}

export default function ExamForm({ examId, questions }: ExamFormProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60分（秒単位）
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // handleSubmit関数をuseCallbackでメモ化
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 実際のアプリケーションではAPIを呼び出して回答を送信します
      // const response = await fetch(`/api/exams/${examId}/submit`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ answers }),
      // });
      
      // if (!response.ok) throw new Error('回答の送信に失敗しました');
      
      // 模擬的な処理（実際はAPIからのレスポンスを使用）
      setTimeout(() => {
        setIsFinished(true);
        // 結果ページへリダイレクト
        router.push(`/exams/${examId}/result?score=${calculateScore()}`);
      }, 1000);
    } catch (err) {
      console.error('Error submitting answers:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, examId, isSubmitting, router]);

  // タイマー処理
  useEffect(() => {
    if (timeLeft <= 0 || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  // 時間切れの場合、自動的に提出
  useEffect(() => {
    if (timeLeft <= 0 && !isFinished) {
      handleSubmit();
    }
  }, [timeLeft, isFinished, handleSubmit]);

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // 模擬的なスコア計算（実際はサーバーサイドで計算）
  const calculateScore = () => {
    // 簡易的な採点（正解は常に最初の選択肢と仮定）
    const correctAnswers = Object.entries(answers).filter(
      ([_, answer]) => answer === 0
    ).length;
    
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isFinished) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">結果を計算中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-500">
          問題 {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="text-sm font-medium text-gray-500">
          残り時間: <span className={timeLeft < 300 ? 'text-red-500' : ''}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.text}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={`question-${currentQuestion.id}-option-${index}`}
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={answers[currentQuestion.id] === index}
                  onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={`question-${currentQuestion.id}-option-${index}`}
                  className="font-medium text-gray-700"
                >
                  {option}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          前の問題
        </button>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            次の問題
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? '送信中...' : '回答を提出する'}
          </button>
        )}
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium ${
                answers[q.id] !== undefined
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
              } ${currentQuestionIndex === index ? 'ring-2 ring-blue-500' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 