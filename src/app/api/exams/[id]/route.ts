import { NextResponse } from 'next/server';
import { auth, db } from '@/app/lib/firebase-admin';
import { Question } from '@/app/types/exam';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 認証ヘッダーからトークンを取得
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse('認証が必要です', { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 模試データの取得
    const examRef = db.collection('exams').doc(params.id);
    const examDoc = await examRef.get();

    if (!examDoc.exists) {
      return new NextResponse('模試が見つかりません', { status: 404 });
    }

    const examData = examDoc.data();
    if (!examData) {
      return new NextResponse('模試データが不正です', { status: 400 });
    }

    // 購入状態の確認
    const purchaseQuery = await db.collection('purchases')
      .where('userId', '==', userId)
      .where('examId', '==', params.id)
      .where('status', '==', 'completed')
      .get();

    const hasPurchased = !purchaseQuery.empty;

    // 問題データの取得
    const questionsRef = examRef.collection('questions');
    const questionsSnapshot = await questionsRef.get();
    const questions = questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Question[];

    // 購入していない場合は問題の詳細を除外
    const responseData = {
      ...examData,
      questions: hasPurchased ? questions : questions.map(q => ({
        id: q.id,
        questionNumber: q.questionNumber,
        // 購入していない場合は問題の詳細を除外
        question: hasPurchased ? q.question : '購入後に表示されます',
        options: hasPurchased ? q.options : [],
        correctAnswer: hasPurchased ? q.correctAnswer : null,
        explanation: hasPurchased ? q.explanation : null,
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('模試データ取得エラー:', error);
    return new NextResponse(
      error instanceof Error ? error.message : '内部サーバーエラー',
      { status: 500 }
    );
  }
} 