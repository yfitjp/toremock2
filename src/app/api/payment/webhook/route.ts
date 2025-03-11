import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 支払いシステムは現在開発中です
    return NextResponse.json(
      { message: '支払いシステムは現在開発中です' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Webhook処理エラー:', error);
    return NextResponse.json(
      { message: 'Webhook処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 