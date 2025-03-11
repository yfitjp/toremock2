import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '認証が必要です。' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const examId = formData.get('examId') as string;

    if (!examId) {
      return NextResponse.json(
        { message: '模試IDが必要です。' },
        { status: 400 }
      );
    }

    // ユーザーの取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        purchases: {
          where: { examId },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません。' },
        { status: 404 }
      );
    }

    // 既に購入済みかチェック
    if (user.purchases.length > 0) {
      return NextResponse.json(
        { message: 'この模試は既に購入済みです。' },
        { status: 400 }
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

    // 購入レコードの作成
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        examId: exam.id,
        amount: exam.price,
      },
    });

    return NextResponse.json({
      message: '購入が完了しました。',
      purchase,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { message: '購入処理中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 