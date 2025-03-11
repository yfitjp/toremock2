import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '認証が必要です。' },
        { status: 401 }
      );
    }

    const { examId, paymentIntentId } = await request.json();

    if (!examId) {
      return NextResponse.json(
        { message: '模試IDが必要です。' },
        { status: 400 }
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

    // 模試の取得
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      return NextResponse.json(
        { message: '模試が見つかりません。' },
        { status: 404 }
      );
    }

    // 既に購入済みかチェック
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        examId: exam.id,
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { message: 'この模試は既に購入済みです。' },
        { status: 400 }
      );
    }

    // 購入記録の作成（実際のデータベースに合わせて修正が必要）
    const purchase = {
      id: `purchase-${Date.now()}`,
      userId: user.id,
      examId: exam.id,
      paymentIntentId: paymentIntentId || `pi_${Date.now()}`,
      price: exam.price || 0,
      createdAt: new Date(),
    };

    return NextResponse.json({
      message: '購入が完了しました。',
      purchase: {
        id: purchase.id,
        examId: purchase.examId,
        createdAt: purchase.createdAt,
      },
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { message: '購入処理中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 