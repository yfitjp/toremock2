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

    return NextResponse.json({
      purchases: user.purchases,
    });
  } catch (error) {
    console.error('Purchases fetch error:', error);
    return NextResponse.json(
      { message: '購入履歴の取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 