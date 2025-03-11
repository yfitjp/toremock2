'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  content: string;
  choices: string[];
  order: number;
}

interface ExamFormProps {
  examId: string;
  title: string;
  questions: Question[];
  duration: number;
}

export default function ExamForm({ examId, title, questions, duration }: ExamFormProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(duration * 60); // 秒単位
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // タイマー処理
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 時間表示のフォーマット
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 解答の更新
  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // メモの更新
  const handleNoteChange = (questionId: string, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 解答の提出
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId,
          answers,
          notes,
          timeSpent: duration * 60 - timeLeft,
        }),
      });

      if (!response.ok) {
        throw new Error('提出に失敗しました');
      }

      const result = await response.json();
      router.push(`/exams/${examId}/result?attemptId=${result.attemptId}`);
    } catch (error) {
      console.error('Submit error:', error);
      alert('解答の提出中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 試験終了の確認
  const handleEndExam = () => {
    if (window.confirm('試験を終了してよろしいですか？\n終了すると現在の解答が自動的に提出されます。')) {
      handleSubmit();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {title}
              </h1>
              <p className="text-sm text-gray-500">
                残り時間: <span id="timer">{formatTime(timeLeft)}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleEndExam}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              試験を終了
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg">
            {/* 問題一覧 */}
            <div className="divide-y divide-gray-200">
              {questions.map((question, index) => (
                <div key={question.id} className="p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      問題 {index + 1}
                    </h2>
                    <p className="mt-2 text-gray-700">{question.content}</p>
                  </div>

                  {/* 選択肢 */}
                  <div className="space-y-3">
                    {question.choices.map((choice, choiceIndex) => (
                      <label key={choiceIndex} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={choiceIndex}
                            checked={answers[question.id] === choiceIndex}
                            onChange={() => handleAnswerChange(question.id, choiceIndex)}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <span className="font-medium text-gray-700">
                            {String.fromCharCode(65 + choiceIndex)}. {choice}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* メモ欄 */}
                  <div className="mt-4">
                    <label htmlFor={`note-${question.id}`} className="block text-sm font-medium text-gray-700">
                      メモ
                    </label>
                    <textarea
                      id={`note-${question.id}`}
                      value={notes[question.id] || ''}
                      onChange={(e) => handleNoteChange(question.id, e.target.value)}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="この問題に関するメモを書く..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 送信ボタン */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? '送信中...' : '解答を提出'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 