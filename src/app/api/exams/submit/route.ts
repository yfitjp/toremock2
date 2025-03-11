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

    const { examId, answers, notes, timeSpent } = await request.json();

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

    // 模試の取得と採点
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { message: '模試が見つかりません。' },
        { status: 404 }
      );
    }

    // 正解数のカウント
    let correctCount = 0;
    const questionResults = exam.questions.map((question) => {
      const isCorrect = answers[question.id] === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: question.id,
        selectedAnswer: answers[question.id],
        isCorrect,
        note: notes?.[question.id] || '',
      };
    });

    // スコアの計算（100点満点）
    const score = Math.round((correctCount / exam.questions.length) * 100);

    // 受験記録の作成
    const attempt = await prisma.examAttempt.create({
      data: {
        userId: user.id,
        examId: exam.id,
        score,
        timeSpent,
        answers: questionResults,
      },
    });

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