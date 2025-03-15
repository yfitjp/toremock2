import { COLLECTIONS, getCollection, getDocument, addDocument, updateDocument, queryDocuments, setDocument } from './firestore';
import { where, orderBy, limit } from 'firebase/firestore';

// 模試の型定義
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  type: string;
  difficulty: string;
  isFree: boolean;
  questions?: Question[];
  createdAt?: Date;
  updatedAt?: Date;
}

// 問題の型定義
export interface Question {
  id: string;
  examId: string;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  order: number;
  createdAt: any;
  updatedAt: any;
}

// 模試の回答結果の型定義
export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  score: number;
  timeSpent: number;
  answers: Record<string, number>;
  createdAt: any;
  updatedAt: any;
}

// デフォルトの模試データ
export const DEFAULT_EXAMS = [
  {
    id: 'toeic-exam-1',
    title: 'TOEIC® L&R 模試 Vol.1',
    description: 'TOEIC® L&Rテストの模擬試験です。リスニングとリーディングの両方をカバーしています。',
    duration: 120,
    price: 0,
    type: 'TOEIC',
    difficulty: '中級',
    isFree: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'toeic-exam-2',
    title: 'TOEIC® L&R 模試 Vol.2',
    description: 'TOEIC® L&Rテストの模擬試験です。ビジネス英語に焦点を当てています。',
    duration: 120,
    price: 1200,
    type: 'TOEIC',
    difficulty: '上級',
    isFree: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// すべての模試を取得
export const getAllExams = async (): Promise<Exam[]> => {
  try {
    // Firestoreから模試データを取得
    const exams = await getCollection<Exam>(COLLECTIONS.EXAMS, [orderBy('createdAt', 'desc')]);
    
    // 重複を排除するためにMapを使用
    const uniqueExamsMap = new Map<string, Exam>();
    
    // Firestoreから取得した模試を追加
    exams.forEach(exam => {
      if (!uniqueExamsMap.has(exam.id)) {
        uniqueExamsMap.set(exam.id, exam);
      }
    });
    
    // Firestoreに模試がない場合はデフォルトの模試を使用
    if (uniqueExamsMap.size === 0) {
      DEFAULT_EXAMS.forEach(exam => {
        uniqueExamsMap.set(exam.id, exam);
      });
    }
    
    // 結果を配列に変換して返す
    return Array.from(uniqueExamsMap.values());
  } catch (error) {
    console.error('Error getting all exams:', error);
    // エラーが発生した場合はデフォルトの模試を返す
    return DEFAULT_EXAMS;
  }
};

// 特定の模試を取得
export const getExam = async (examId: string): Promise<Exam | null> => {
  try {
    return await getDocument<Exam>(COLLECTIONS.EXAMS, examId);
  } catch (error) {
    console.error(`Error getting exam with ID ${examId}:`, error);
    throw error;
  }
};

// 無料の模試を取得
export const getFreeExams = async (): Promise<Exam[]> => {
  try {
    const exams = await queryDocuments<Exam>(
      COLLECTIONS.EXAMS,
      [where('isFree', '==', true)]
    );
    
    // 重複を排除するためにMapを使用
    const uniqueExamsMap = new Map<string, Exam>();
    
    exams.forEach(exam => {
      if (!uniqueExamsMap.has(exam.id)) {
        uniqueExamsMap.set(exam.id, exam);
      }
    });
    
    // Firestoreに模試がない場合はデフォルトの模試を使用
    if (uniqueExamsMap.size === 0) {
      DEFAULT_EXAMS.forEach(exam => {
        uniqueExamsMap.set(exam.id, exam);
      });
    }
    
    // 結果を配列に変換して返す
    return Array.from(uniqueExamsMap.values());
  } catch (error) {
    console.error('Error getting free exams:', error);
    // エラーが発生した場合はデフォルトの無料模試を返す
    return DEFAULT_EXAMS.filter(exam => exam.isFree);
  }
};

// 特定のタイプの模試を取得
export const getExamsByType = async (type: string): Promise<Exam[]> => {
  try {
    return await queryDocuments<Exam>(
      COLLECTIONS.EXAMS,
      [where('type', '==', type), orderBy('createdAt', 'desc')]
    );
  } catch (error) {
    console.error(`Error getting exams of type ${type}:`, error);
    throw error;
  }
};

// 模試の問題を取得
export const getExamQuestions = async (examId: string): Promise<Question[]> => {
  try {
    return await queryDocuments<Question>(
      COLLECTIONS.QUESTIONS,
      [where('examId', '==', examId), orderBy('order', 'asc')]
    );
  } catch (error) {
    console.error(`Error getting questions for exam ${examId}:`, error);
    throw error;
  }
};

// 模試の回答結果を保存
export const saveExamAttempt = async (attemptData: Omit<ExamAttempt, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('Saving exam attempt to Firestore:', {
      collection: COLLECTIONS.EXAM_ATTEMPTS,
      data: attemptData
    });
    
    // examIdが文字列であることを確認
    if (typeof attemptData.examId !== 'string') {
      console.error('Invalid examId format:', attemptData.examId);
      throw new Error('Invalid examId format');
    }
    
    // userIdが文字列であることを確認
    if (typeof attemptData.userId !== 'string') {
      console.error('Invalid userId format:', attemptData.userId);
      throw new Error('Invalid userId format');
    }
    
    // 回答データが存在することを確認
    if (!attemptData.answers || Object.keys(attemptData.answers).length === 0) {
      console.warn('No answers provided in attempt data');
    }
    
    const docId = await addDocument<Omit<ExamAttempt, 'id' | 'createdAt' | 'updatedAt'>>(
      COLLECTIONS.EXAM_ATTEMPTS,
      attemptData
    );
    
    console.log('Exam attempt saved with document ID:', docId);
    return docId;
  } catch (error) {
    console.error('Error saving exam attempt:', error);
    throw error;
  }
};

// ユーザーの模試受験履歴を取得
export const getUserExamAttempts = async (userId: string): Promise<ExamAttempt[]> => {
  try {
    return await queryDocuments<ExamAttempt>(
      COLLECTIONS.EXAM_ATTEMPTS,
      [where('userId', '==', userId), orderBy('createdAt', 'desc')]
    );
  } catch (error) {
    console.error(`Error getting exam attempts for user ${userId}:`, error);
    throw error;
  }
};

// 特定の模試のユーザー回答履歴を取得
export const getUserExamAttemptsByExam = async (userId: string, examId: string): Promise<ExamAttempt[]> => {
  try {
    const constraints = [
      where('userId', '==', userId),
      where('examId', '==', examId),
      orderBy('createdAt', 'desc')
    ];
    
    return await getCollection<ExamAttempt>(COLLECTIONS.EXAM_ATTEMPTS, constraints);
  } catch (error) {
    console.error(`Error getting exam attempts for user ${userId} and exam ${examId}:`, error);
    throw error;
  }
}; 