import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// 型定義を追加
interface RecentActivity {
  id: string;
  type: string;
  title: string;
  score?: number;
  date: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '認証が必要です。' },
        { status: 401 }
      );
    }

    // ユーザーの取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません。' },
        { status: 404 }
      );
    }

    // 模擬的なダッシュボードデータ
    const dashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      stats: {
        totalExams: 5,
        completedExams: 3,
        averageScore: 85,
      },
      recentActivity: [
        {
          id: '1',
          type: 'exam_completed',
          title: 'TOEIC® L&R 模試 Vol.1',
          score: 850,
          date: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'exam_purchased',
          title: 'TOEIC® L&R 模試 Vol.2',
          date: new Date(Date.now() - 86400000).toISOString(), // 1日前
        },
      ] as RecentActivity[],
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { message: 'ダッシュボードデータの取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 