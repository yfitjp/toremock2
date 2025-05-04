'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExamResultPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const useAuth_1 = require("@/app/hooks/useAuth");
const exams_1 = require("@/app/lib/exams");
const link_1 = __importDefault(require("next/link"));
const firestore_1 = require("firebase/firestore");
function ExamResultPage() {
    const params = (0, navigation_1.useParams)();
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const { user, loading: authLoading } = (0, useAuth_1.useAuth)();
    const [attempt, setAttempt] = (0, react_1.useState)(null);
    const [exam, setExam] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const attemptId = params?.attemptId || searchParams?.get('attemptId');
    const examId = params?.id;
    (0, react_1.useEffect)(() => {
        if (!attemptId || !user)
            return;
        const fetchResult = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // ここで Firestore から attemptId に紐づくデータを取得するロジックが必要
                // 例: 
                // const attemptData = await getExamAttemptById(attemptId, user.uid);
                // setAttempt(attemptData);
                // 同時に、examId から試験情報も取得する (オプション)
                if (examId) {
                    const examData = await (0, exams_1.getExam)(examId);
                    setExam(examData);
                }
                else {
                    // attempt データに examTitle が含まれていればそれを使う
                    // setExam({ title: attemptData.examTitle, ... }); // 仮のデータ構造
                }
                // --- 以下はダミーデータのプレースホルダー --- 
                console.warn("fetchResult: Firestore からの結果取得ロジックを実装する必要があります。");
                // ダミーデータ（あとで Firestore から取得する）
                const dummyAttempt = {
                    id: attemptId,
                    userId: user.uid,
                    examId: examId || 'unknown-exam',
                    examTitle: exam?.title || '模試タイトル',
                    startedAt: firestore_1.Timestamp.now(),
                    completedAt: firestore_1.Timestamp.now(),
                    status: 'completed',
                    currentStructureIndex: 5, // 仮
                    sections: {
                        'Reading Section 1': { status: 'completed', score: 80 },
                        'Listening Section 1': { status: 'completed', score: 75 },
                        // ... 他のセクションデータ
                    },
                    overallScore: 78
                };
                setAttempt(dummyAttempt);
                // --- ダミーデータここまで --- 
            }
            catch (err) {
                console.error('結果取得エラー:', err);
                setError(err.message || '試験結果の取得に失敗しました。');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchResult();
    }, [attemptId, user, examId, exam?.title]);
    if (authLoading || isLoading) {
        return (<div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>);
    }
    if (error) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>);
    }
    if (!attempt) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          試験結果が見つかりません。
        </div>
      </div>);
    }
    return (<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">試験結果: {attempt.examTitle}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">概要</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-medium text-gray-600">受験日:</span> {attempt.completedAt?.toDate().toLocaleDateString()}</div>
          <div><span className="font-medium text-gray-600">ステータス:</span> {attempt.status === 'completed' ? '完了' : '進行中'}</div>
          {attempt.overallScore !== undefined && (<div><span className="font-medium text-gray-600">総合スコア:</span> <span className="text-2xl font-bold text-blue-600">{attempt.overallScore}%</span></div>)}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">セクション別スコア</h2>
        <div className="space-y-4">
          {Object.entries(attempt.sections || {}).map(([title, sectionAttempt]) => (<div key={title} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium text-gray-800">{title}</span>
              {sectionAttempt.score !== undefined ? (<span className="text-lg font-semibold text-green-600">{sectionAttempt.score}%</span>) : (<span className="text-sm text-gray-500">{sectionAttempt.status === 'completed' ? '採点対象外' : sectionAttempt.status}</span>)}
            </div>))}
        </div>
      </div>

      <div className="mt-8 text-center">
          <link_1.default href="/exams" className="text-blue-600 hover:text-blue-800">
            &larr; 模試一覧に戻る
          </link_1.default>
      </div>
    </div>);
}
