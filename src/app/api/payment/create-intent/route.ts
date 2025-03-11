import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    { message: '決済システムは現在開発中です' },
    { status: 503 }
  );
} 