import { NextResponse } from 'next/server';
import { COLLECTIONS, addDocument, setDocument } from '@/app/lib/firestore';
import { serverTimestamp } from 'firebase/firestore';

// サンプルの模試データ
const sampleExams = [
  {
    title: 'TOEIC® L&R 模試 Vol.1',
    description: 'TOEIC® L&Rテストの模擬試験です。本番さながらの環境で受験できます。',
    duration: 120,
    price: 0,
    type: 'TOEIC',
    difficulty: '中級',
    isFree: true,
  },
  {
    title: 'TOEIC® L&R 模試 Vol.2',
    description: 'TOEIC® L&Rテストの模擬試験です。最新の出題傾向に対応しています。',
    duration: 120,
    price: 2500,
    type: 'TOEIC',
    difficulty: '中級',
    isFree: false,
  },
  {
    title: 'TOEIC® L&R 模試 Vol.3',
    description: 'TOEIC® L&Rテストの模擬試験です。ビジネス場面に特化した問題が多く含まれています。',
    duration: 120,
    price: 2500,
    type: 'TOEIC',
    difficulty: '上級',
    isFree: false,
  },
];

// サンプルの問題データ（簡略化）
const createSampleQuestions = (examId: string) => {
  const questions = [];
  
  for (let i = 1; i <= 5; i++) {
    questions.push({
      examId,
      content: `サンプル問題 ${i}`,
      options: [
        `選択肢 A - 問題 ${i}`,
        `選択肢 B - 問題 ${i}`,
        `選択肢 C - 問題 ${i}`,
        `選択肢 D - 問題 ${i}`,
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `この問題の解説です。正解は選択肢 ${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]} です。`,
      order: i,
    });
  }
  
  return questions;
};

export async function GET() {
  try {
    // 開発環境でのみ実行可能
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { message: '本番環境では実行できません' },
        { status: 403 }
      );
    }

    const results = {
      exams: [] as string[],
      questions: [] as string[],
    };

    // 模試データを追加
    for (const exam of sampleExams) {
      const examId = await addDocument(COLLECTIONS.EXAMS, {
        ...exam,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      results.exams.push(examId);
      
      // 各模試の問題を追加
      const questions = createSampleQuestions(examId);
      for (const question of questions) {
        const questionId = await addDocument(COLLECTIONS.QUESTIONS, {
          ...question,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        results.questions.push(questionId);
      }
    }

    return NextResponse.json(
      { 
        message: 'サンプルデータが作成されました',
        results
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('シードエラー:', error);
    return NextResponse.json(
      { message: 'サンプルデータの作成中にエラーが発生しました', error: String(error) },
      { status: 500 }
    );
  }
} 