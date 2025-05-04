"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserExamAttemptsByExam = exports.getUserExamAttempts = exports.getExamQuestions = exports.getExamsByType = exports.getFreeExams = exports.getExam = exports.getAllExams = void 0;
const firestore_1 = require("./firestore");
const firestore_2 = require("firebase/firestore");
// 模試の型定義
/*
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  type: string;
  isFree: boolean;
  questions?: Question[];
  createdAt?: Date;
  updatedAt?: Date;
}
*/
// 問題の型定義
/*
export interface Question {
  id: string;
  examId: string;
  content: string;
  options: string[];
  correctAnswer: number;
  order: number;
  sectionType?: 'reading' | 'listening' | 'writing' | 'speaking'; // セクションタイプ
  questionType?: 'multiple-choice' | 'text-input' | 'speaking' | 'writing'; // 問題タイプ
  imageUrl?: string; // 問題画像のURL
  audioUrl?: string; // 音声ファイルのURL
  createdAt: any;
  updatedAt: any;
}
*/
// 模試の回答結果の型定義
/*
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
*/
// すべての模試を取得
const getAllExams = async () => {
    try {
        // Firestoreから模試データを取得
        const exams = await (0, firestore_1.getCollection)(firestore_1.COLLECTIONS.EXAMS, [(0, firestore_2.orderBy)('createdAt', 'desc')]);
        if (!exams || exams.length === 0) {
            console.warn('No exams found in Firestore');
            return [];
        }
        return exams;
    }
    catch (error) {
        console.error('Error getting all exams:', error);
        throw new Error('模試データの取得に失敗しました');
    }
};
exports.getAllExams = getAllExams;
// 特定の模試を取得
const getExam = async (examId) => {
    try {
        const exam = await (0, firestore_1.getDocument)(firestore_1.COLLECTIONS.EXAMS, examId);
        if (!exam) {
            console.warn(`No exam found with ID ${examId}`);
            return null;
        }
        return exam;
    }
    catch (error) {
        console.error(`Error getting exam with ID ${examId}:`, error);
        throw new Error('模試データの取得に失敗しました');
    }
};
exports.getExam = getExam;
// 無料の模試を取得
const getFreeExams = async () => {
    try {
        const exams = await (0, firestore_1.queryDocuments)(firestore_1.COLLECTIONS.EXAMS, [(0, firestore_2.where)('isFree', '==', true)]);
        if (!exams || exams.length === 0) {
            console.warn('No free exams found in Firestore');
            return [];
        }
        return exams;
    }
    catch (error) {
        console.error('Error getting free exams:', error);
        throw new Error('無料模試データの取得に失敗しました');
    }
};
exports.getFreeExams = getFreeExams;
// 特定のタイプの模試を取得
const getExamsByType = async (type) => {
    try {
        return await (0, firestore_1.queryDocuments)(firestore_1.COLLECTIONS.EXAMS, [(0, firestore_2.where)('type', '==', type), (0, firestore_2.orderBy)('createdAt', 'desc')]);
    }
    catch (error) {
        console.error(`Error getting exams of type ${type}:`, error);
        throw error;
    }
};
exports.getExamsByType = getExamsByType;
// 模試の問題を取得
const getExamQuestions = async (examId) => {
    try {
        return await (0, firestore_1.queryDocuments)(firestore_1.COLLECTIONS.QUESTIONS, [(0, firestore_2.where)('examId', '==', examId), (0, firestore_2.orderBy)('order', 'asc')]);
    }
    catch (error) {
        console.error(`Error getting questions for exam ${examId}:`, error);
        throw error;
    }
};
exports.getExamQuestions = getExamQuestions;
// 模試の回答結果を保存 (新しい設計では不要になる可能性が高いのでコメントアウト)
/*
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
    
    // 回答データが存在することを確認 (このチェックは新しい型では不要)
    // if (!attemptData.answers || Object.keys(attemptData.answers).length === 0) {
    //   console.warn('No answers provided in attempt data');
    // }
    
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
*/
// ユーザーの模試受験履歴を取得
const getUserExamAttempts = async (userId) => {
    try {
        return await (0, firestore_1.queryDocuments)(firestore_1.COLLECTIONS.EXAM_ATTEMPTS, [(0, firestore_2.where)('userId', '==', userId), (0, firestore_2.orderBy)('createdAt', 'desc')]);
    }
    catch (error) {
        console.error(`Error getting exam attempts for user ${userId}:`, error);
        throw error;
    }
};
exports.getUserExamAttempts = getUserExamAttempts;
// 特定の模試のユーザー回答履歴を取得
const getUserExamAttemptsByExam = async (userId, examId) => {
    try {
        const constraints = [
            (0, firestore_2.where)('userId', '==', userId),
            (0, firestore_2.where)('examId', '==', examId),
            (0, firestore_2.orderBy)('createdAt', 'desc')
        ];
        return await (0, firestore_1.getCollection)(firestore_1.COLLECTIONS.EXAM_ATTEMPTS, constraints);
    }
    catch (error) {
        console.error(`Error getting exam attempts for user ${userId} and exam ${examId}:`, error);
        throw error;
    }
};
exports.getUserExamAttemptsByExam = getUserExamAttemptsByExam;
