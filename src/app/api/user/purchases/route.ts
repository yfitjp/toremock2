import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// 型定義を追加
interface Purchase {
  id: string;
  examId: string;
  examTitle: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired';
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

    // 模擬的な購入データ
    const purchases: Purchase[] = [
      {
        id: '1',
        examId: '1',
        examTitle: 'TOEIC® L&R 模試 Vol.1',
        purchaseDate: '2023-05-15',
        expiryDate: '2024-05-15',
        status: 'active',
      },
      {
        id: '2',
        examId: '2',
        examTitle: 'TOEIC® L&R 模試 Vol.2',
        purchaseDate: '2023-04-10',
        expiryDate: '2024-04-10',
        status: 'active',
      },
    ];

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Purchases error:', error);
    return NextResponse.json(
      { message: '購入履歴の取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 