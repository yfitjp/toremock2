'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

const dummyExam: Exam = {
  id: '1',
  title: 'TOEIC® L&R 模試 Vol.1',
  description: 'TOEIC® L&Rテストの模擬試験です。本番さながらの環境で受験できます。',
  duration: 120,
  questions: [
    {
      id: '1',
      text: 'What is the main topic of the conversation?',
      options: [
        'A business meeting',
        'A vacation plan',
        'A project deadline',
        'A client presentation'
      ],
      correctAnswer: 0
    },
    {
      id: '2',
      text: 'What time is the meeting scheduled for?',
      options: [
        '9:00 AM',
        '10:00 AM',
        '2:00 PM',
        '3:00 PM'
      ],
      correctAnswer: 2
    },
    {
      id: '3',
      text: 'Who will be attending the meeting?',
      options: [
        'Only the sales team',
        'Only the marketing team',
        'Both sales and marketing teams',
        'The entire company'
      ],
      correctAnswer: 2
    },
    {
      id: '4',
      text: 'What is the purpose of the meeting?',
      options: [
        'To discuss new product features',
        'To review quarterly results',
        'To plan the next marketing campaign',
        'To train new employees'
      ],
      correctAnswer: 1
    },
    {
      id: '5',
      text: 'What materials should be prepared for the meeting?',
      options: [
        'Sales reports only',
        'Marketing materials only',
        'Both sales reports and marketing materials',
        'No materials needed'
      ],
      correctAnswer: 2
    }
  ]
};

export default function TakeExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(dummyExam.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answerIndex;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < dummyExam.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // ここで結果を計算して結果ページに遷移
    const score = calculateScore();
    router.push(`/exams/${params.id}/result?score=${score}`);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === dummyExam.questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / dummyExam.questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{dummyExam.title}</h1>
              <div className="text-xl font-semibold text-blue-600">
                残り時間: {formatTime(timeLeft)}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  問題 {currentQuestion + 1} / {dummyExam.questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  進捗: {Math.round(((currentQuestion + 1) / dummyExam.questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${((currentQuestion + 1) / dummyExam.questions.length) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {dummyExam.questions[currentQuestion].text}
              </h2>
              <div className="space-y-4">
                {dummyExam.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                前の問題
              </button>
              {currentQuestion === dummyExam.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  結果を見る
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  次の問題
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 