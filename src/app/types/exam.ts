export interface Question {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
} 