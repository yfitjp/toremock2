"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const firebase_admin_1 = require("@/app/lib/firebase-admin");
async function GET(req, { params }) {
    try {
        // 認証ヘッダーからトークンを取得
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return new server_1.NextResponse('認証が必要です', { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await firebase_admin_1.auth.verifyIdToken(idToken);
        const userId = decodedToken.uid;
        // 模試データの取得
        const examRef = firebase_admin_1.db.collection('exams').doc(params.id);
        const examDoc = await examRef.get();
        if (!examDoc.exists) {
            return new server_1.NextResponse('模試が見つかりません', { status: 404 });
        }
        const examData = examDoc.data();
        if (!examData) {
            return new server_1.NextResponse('模試データが不正です', { status: 400 });
        }
        // 購入状態の確認
        const purchaseQuery = await firebase_admin_1.db.collection('purchases')
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
        }));
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
                sectionType: hasPurchased ? q.sectionType : null,
                questionType: hasPurchased ? q.questionType : null,
            })),
        };
        return server_1.NextResponse.json(responseData);
    }
    catch (error) {
        console.error('模試データ取得エラー:', error);
        return new server_1.NextResponse(error instanceof Error ? error.message : '内部サーバーエラー', { status: 500 });
    }
}
