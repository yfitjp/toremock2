import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: '認証されていません' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: '名前は必須です' },
        { status: 400 }
      );
    }

    // ユーザーIDを取得
    const userId = session.user.id;

    // ユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name }
    });

    // パスワードを除外したユーザー情報を返す
    const userWithoutPassword = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    return NextResponse.json(
      { message: 'プロフィールが更新されました', user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    return NextResponse.json(
      { message: 'プロフィールの更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 