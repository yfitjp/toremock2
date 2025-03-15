import { NextResponse } from 'next/server';
import { seedExams } from '@/app/lib/seed-exams';

export async function GET() {
  try {
    await seedExams();
    return NextResponse.json({ message: 'Successfully seeded exam data' });
  } catch (error) {
    console.error('Error in seed API:', error);
    return NextResponse.json({ error: 'Failed to seed exam data' }, { status: 500 });
  }
} 