import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '認証が必要です。' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        purchases: {
          include: {
            exam: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません。' },
        { status: 404 }
      );
    }

    // 購入済みの模試数
    const purchasedExams = user.purchases.length;

    // 受験履歴（今後実装）
    const examHistory = [];

    // 学習時間（今後実装）
    const studyTime = 0;

    return NextResponse.json({
      purchasedExams,
      examHistory,
      studyTime,
      recentPurchases: user.purchases.slice(0, 5), // 最新5件
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { message: 'データの取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 