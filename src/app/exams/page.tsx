'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  type: string;
  difficulty: string;
}

const dummyExams: Exam[] = [
  {
    id: '1',
    title: 'TOEIC® L&R 模試 Vol.1',
    description: 'TOEIC® L&Rテストの模擬試験です。本番さながらの環境で受験できます。',
    duration: 120,
    price: 2500,
    type: 'TOEIC® L&R',
    difficulty: '中級',
  },
  {
    id: '2',
    title: 'TOEIC® L&R 模試 Vol.2',
    description: 'TOEIC® L&Rテストの模擬試験です。最新の出題傾向に対応しています。',
    duration: 120,
    price: 2500,
    type: 'TOEIC® L&R',
    difficulty: '中級',
  },
  {
    id: '3',
    title: 'TOEIC® S&W 模試 Vol.1',
    description: 'TOEIC® S&Wテストの模擬試験です。スピーキングとライティングの実践的な問題に挑戦できます。',
    duration: 80,
    price: 3000,
    type: 'TOEIC® S&W',
    difficulty: '中級',
  },
];

export default function ExamsPage() {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-center mb-8">
                  模試一覧
                </h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {dummyExams.map((exam) => (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                        <p className="mt-2 text-sm text-gray-500">{exam.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {exam.type}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {exam.difficulty}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            所要時間: {exam.duration}分
                          </div>
                          <div className="text-lg font-medium text-gray-900">
                            ¥{exam.price.toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-6">
                          <Link
                            href={`/exams/${exam.id}/purchase`}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            模試を購入
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
} 