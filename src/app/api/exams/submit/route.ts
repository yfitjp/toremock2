import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth';

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

    const { examId, answers, timeSpent } = await request.json();

    if (!examId || !answers) {
      return NextResponse.json(
        { message: '必要なデータが不足しています。' },
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

    // 模擬的な採点処理（実際のデータベースに合わせて修正が必要）
    // 正解数のカウント（ここでは仮に全問正解とする）
    const correctCount = Object.keys(answers).length;
    const score = 100; // 仮のスコア

    // 受験記録の作成（実際のデータベースに合わせて修正が必要）
    const attempt = {
      id: `attempt-${Date.now()}`,
      userId: user.id,
      examId: examId,
      score: score,
      timeSpent: timeSpent || 0,
      createdAt: new Date(),
    };

    return NextResponse.json({
      message: '解答を受け付けました。',
      attemptId: attempt.id,
      score,
    });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { message: '解答の提出中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 