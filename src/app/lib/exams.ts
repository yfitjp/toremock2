import { COLLECTIONS, getCollection, getDocument, addDocument, updateDocument, queryDocuments } from './firestore';
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
  createdAt: any;
  updatedAt: any;
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

// すべての模試を取得
export const getAllExams = async (): Promise<Exam[]> => {
  try {
    return await getCollection<Exam>(COLLECTIONS.EXAMS, [orderBy('createdAt', 'desc')]);
  } catch (error) {
    console.error('Error getting all exams:', error);
    throw error;
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
    return await queryDocuments<Exam>(
      COLLECTIONS.EXAMS,
      'isFree',
      '==',
      true,
      'createdAt',
      'desc'
    );
  } catch (error) {
    console.error('Error getting free exams:', error);
    throw error;
  }
};

// 特定のタイプの模試を取得
export const getExamsByType = async (type: string): Promise<Exam[]> => {
  try {
    return await queryDocuments<Exam>(
      COLLECTIONS.EXAMS,
      'type',
      '==',
      type,
      'createdAt',
      'desc'
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
      'examId',
      '==',
      examId,
      'order',
      'asc'
    );
  } catch (error) {
    console.error(`Error getting questions for exam ${examId}:`, error);
    throw error;
  }
};

// 模試の回答結果を保存
export const saveExamAttempt = async (attemptData: Omit<ExamAttempt, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    return await addDocument<Omit<ExamAttempt, 'id' | 'createdAt' | 'updatedAt'>>(
      COLLECTIONS.EXAM_ATTEMPTS,
      attemptData
    );
  } catch (error) {
    console.error('Error saving exam attempt:', error);
    throw error;
  }
};

// ユーザーの模試回答履歴を取得
export const getUserExamAttempts = async (userId: string): Promise<ExamAttempt[]> => {
  try {
    return await queryDocuments<ExamAttempt>(
      COLLECTIONS.EXAM_ATTEMPTS,
      'userId',
      '==',
      userId,
      'createdAt',
      'desc'
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