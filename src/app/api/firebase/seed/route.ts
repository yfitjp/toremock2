import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { COLLECTIONS } from '@/app/lib/firestore';

// サンプル模試データ
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
    description: '実践的なTOEIC® L&R模擬試験です。最新の出題傾向に対応しています。',
    duration: 120,
    price: 1500,
    type: 'TOEIC',
    difficulty: '中級',
    isFree: false,
  },
  {
    title: '英検準1級 模試',
    description: '英検準1級の模擬試験です。本番と同じ形式で実力を測定できます。',
    duration: 90,
    price: 2000,
    type: '英検',
    difficulty: '上級',
    isFree: false,
  }
];

// サンプル問題を作成する関数
const createSampleQuestions = async (examId: string) => {
  const batch = writeBatch(db);
  
  const sampleQuestions = [
    {
      content: 'Which of the following is NOT a valid JavaScript data type?',
      options: ['Float', 'Boolean', 'String', 'Object'],
      correctAnswer: 0,
      explanation: 'Float is not a valid JavaScript data type. The valid numeric type in JavaScript is Number.',
      order: 1,
    },
    {
      content: 'What does the "DOM" stand for in web development?',
      options: [
        'Document Object Model',
        'Data Object Model',
        'Document Oriented Model',
        'Digital Object Model',
      ],
      correctAnswer: 0,
      explanation: 'DOM stands for Document Object Model, which is a programming interface for web documents.',
      order: 2,
    },
    {
      content: 'Which HTML tag is used to create a hyperlink?',
      options: ['<a>', '<link>', '<href>', '<url>'],
      correctAnswer: 0,
      explanation: 'The <a> tag is used to create hyperlinks in HTML.',
      order: 3,
    },
    {
      content: 'In CSS, what property is used to change the text color?',
      options: ['color', 'text-color', 'font-color', 'text-style'],
      correctAnswer: 0,
      explanation: 'The "color" property is used to change the text color in CSS.',
      order: 4,
    },
    {
      content: 'Which of the following is a JavaScript framework?',
      options: ['React', 'HTML', 'CSS', 'SQL'],
      correctAnswer: 0,
      explanation: 'React is a JavaScript framework/library for building user interfaces.',
      order: 5,
    }
  ];

  for (const question of sampleQuestions) {
    const questionRef = doc(collection(db, COLLECTIONS.QUESTIONS));
    batch.set(questionRef, {
      ...question,
      examId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
};

export async function GET() {
  // 開発環境でのみ実行可能
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'This API is only available in development mode' }, { status: 403 });
  }

  try {
    // 既存の無料模試を確認
    const examsRef = collection(db, COLLECTIONS.EXAMS);
    const freeExamsQuery = query(examsRef, where('isFree', '==', true));
    const freeExamsSnapshot = await getDocs(freeExamsQuery);
    
    // バッチ処理の準備
    const batch = writeBatch(db);
    
    // サンプル模試の作成
    for (const exam of sampleExams) {
      // 無料模試が既に存在する場合はスキップ
      if (exam.isFree && !freeExamsSnapshot.empty) {
        continue;
      }
      
      const examRef = doc(collection(db, COLLECTIONS.EXAMS));
      batch.set(examRef, {
        ...exam,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    
    // バッチ処理の実行
    await batch.commit();
    
    // 無料模試のIDを取得して問題を作成
    const updatedFreeExamsQuery = query(examsRef, where('isFree', '==', true));
    const updatedFreeExamsSnapshot = await getDocs(updatedFreeExamsQuery);
    
    if (!updatedFreeExamsSnapshot.empty) {
      const freeExam = updatedFreeExamsSnapshot.docs[0];
      await createSampleQuestions(freeExam.id);
    }

    return NextResponse.json({ success: true, message: 'Sample data created successfully' });
  } catch (error) {
    console.error('Error creating sample data:', error);
    return NextResponse.json({ error: 'Failed to create sample data' }, { status: 500 });
  }
} 