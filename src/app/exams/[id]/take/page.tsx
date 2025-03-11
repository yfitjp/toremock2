'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ExamForm from './ExamForm';

// 模擬的な問題データ
const dummyQuestions = [
  {
    id: 1,
    text: 'Which of the following is NOT a valid JavaScript data type?',
    options: ['Float', 'Boolean', 'String', 'Object'],
  },
  {
    id: 2,
    text: 'What does the "DOM" stand for in web development?',
    options: [
      'Document Object Model',
      'Data Object Model',
      'Document Oriented Model',
      'Digital Object Model',
    ],
  },
  {
    id: 3,
    text: 'Which HTML tag is used to create a hyperlink?',
    options: ['<a>', '<link>', '<href>', '<url>'],
  },
  {
    id: 4,
    text: 'In CSS, what property is used to change the text color?',
    options: ['color', 'text-color', 'font-color', 'text-style'],
  },
  {
    id: 5,
    text: 'Which of the following is a JavaScript framework?',
    options: ['React', 'HTML', 'CSS', 'SQL'],
  },
];

export default function TakeExamPage() {
  const params = useParams();
  const examId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<{ title: string } | null>(null);

  useEffect(() => {
    // 模擬的なデータ取得
    // 実際のアプリケーションではAPIからデータを取得します
    setTimeout(() => {
      setExam({
        title: 'TOEIC® L&R 模試 Vol.1',
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          試験情報の取得に失敗しました。
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
        <p className="text-gray-600">
          以下の問題に回答してください。時間内に全ての問題を解答するようにしてください。
        </p>
      </div>
      
      <ExamForm examId={examId} questions={dummyQuestions} />
    </div>
  );
} 