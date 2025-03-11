import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 開発環境でのみ実行可能
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { message: '本番環境では実行できません' },
        { status: 403 }
      );
    }

    // テストユーザーが既に存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'テストユーザーは既に存在します', userId: existingUser.id },
        { status: 200 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash('password123', 10);

    // テストユーザーの作成
    const user = await prisma.user.create({
      data: {
        name: 'テストユーザー',
        email: 'test@example.com',
        password: hashedPassword,
      }
    });

    // テスト用の模試データを作成
    const exam = await prisma.exam.create({
      data: {
        title: 'TOEIC® L&R 模試 Vol.1',
        description: 'TOEIC® L&Rテストの模擬試験です。本番さながらの環境で受験できます。',
        price: 0,
        duration: 120,
        type: 'TOEIC',
        difficulty: '中級',
        isFree: true,
      }
    });

    // テストユーザーに無料模試を購入済みとして登録
    await prisma.purchase.create({
      data: {
        userId: user.id,
        examId: exam.id,
        status: 'completed',
      }
    });

    return NextResponse.json(
      { message: 'テストデータが作成されました', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('シードエラー:', error);
    return NextResponse.json(
      { message: 'テストデータの作成中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 