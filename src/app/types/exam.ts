export interface Question {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  imageUrl?: string; // 問題画像のURL（Firebase Storage）
  audioUrl?: string; // 音声ファイルのURL（Firebase Storage）
  questionType: 'multiple-choice' | 'text-input' | 'speaking' | 'writing'; // 問題タイプ
  sectionType: 'reading' | 'listening' | 'writing' | 'speaking'; // セクションタイプ
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string; // 'TOEIC', 'TOEFL', 'EIKEN' などの模試タイプ
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
} 