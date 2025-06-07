import type { Metadata } from 'next';
import ExamList from '@/app/components/ExamList';

export const metadata: Metadata = {
  title: '模試一覧',
  description: 'TOEIC®、TOEFL®、英検®など、ToreMockで受験できる模試の一覧です。あなたのレベルや目標に合った模試を見つけて、実力を試してみましょう。',
};

export default function ExamsPage() {
  return (
    <ExamList />
  );
} 