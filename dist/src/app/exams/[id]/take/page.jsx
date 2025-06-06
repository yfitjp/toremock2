'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExamPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const ExamForm_1 = __importDefault(require("./ExamForm"));
const InstructionsScreen_1 = __importDefault(require("./InstructionsScreen"));
const BreakScreen_1 = __importDefault(require("./BreakScreen"));
const useAuth_1 = require("@/app/hooks/useAuth");
const exams_1 = require("@/app/lib/exams");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("@/app/lib/firebase");
const LoadingSpinner_1 = __importDefault(require("@/app/components/LoadingSpinner"));
const link_1 = __importDefault(require("next/link"));
function ExamPage({ params }) {
    const router = (0, navigation_1.useRouter)();
    const { user, loading: authLoading } = (0, useAuth_1.useAuth)();
    const [examDefinition, setExamDefinition] = (0, react_1.useState)(null);
    const [allQuestions, setAllQuestions] = (0, react_1.useState)([]);
    const [attemptId, setAttemptId] = (0, react_1.useState)(null);
    const [attemptData, setAttemptData] = (0, react_1.useState)(null);
    const [currentStructureIndex, setCurrentStructureIndex] = (0, react_1.useState)(0);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // ページ離脱防止の警告
    (0, react_1.useEffect)(() => {
        const handleBeforeUnload = (event) => {
            // 試験が完了していない場合のみ警告
            if (attemptData?.status !== 'completed') {
                event.preventDefault();
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [attemptData?.status]);
    // クライアントサイドナビゲーションに対する離脱警告
    (0, react_1.useEffect)(() => {
        if (attemptData?.status === 'completed')
            return; // 試験完了後は何もしない
        const confirmMessage = '試験を中断してページを移動しますか？\n解答状況は保存されません。';
        // --- リンククリックに対する警告 ---
        const handleAnchorClick = (event) => {
            const targetElement = event.target;
            const anchor = targetElement.closest('a');
            // ページ内リンク(#)や外部リンク(_blank)は対象外
            // router.pushなどで遷移する場合は検知できない
            if (anchor && anchor.href && !anchor.href.startsWith('#') && anchor.target !== '_blank') {
                // 同一オリジンへの遷移かチェック (より安全に)
                const targetUrl = new URL(anchor.href, window.location.origin);
                if (targetUrl.origin === window.location.origin) {
                    if (!window.confirm(confirmMessage)) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
        };
        // --- ブラウザの戻る/進む操作に対する警告 ---
        const handleBeforePopState = () => {
            if (attemptData?.status !== 'completed') {
                if (!window.confirm(confirmMessage)) {
                    // 遷移をキャンセルするために history API を使う
                    // 注意: これでも一瞬遷移先のコンテンツが見えることがある
                    window.history.pushState(null, '', window.location.href);
                    return false; // Next.js Router の動作をキャンセルする意図 (Pages Router用だが念のため)
                }
            }
            return true; // 遷移を許可
        };
        // Next.js App Router では router.events が使えないため、popstate を使う
        // popstate は実際に履歴が変わった*後*に発火するため、ハンドリングが難しい
        // 代わりに beforepopstate を試す (ブラウザによっては未サポートの可能性あり)
        // または、より複雑な状態管理が必要になる場合も
        window.addEventListener('beforepopstate', handleBeforePopState);
        // クリックイベントの監視
        document.addEventListener('click', handleAnchorClick, true);
        return () => {
            document.removeEventListener('click', handleAnchorClick, true);
            window.removeEventListener('beforepopstate', handleBeforePopState);
        };
    }, [attemptData?.status]);
    // 初期化処理: 模試定義、問題、受験記録の読み込み/作成
    (0, react_1.useEffect)(() => {
        const initializeExam = async () => {
            if (authLoading || !user)
                return;
            setIsLoading(true);
            setError(null);
            try {
                // 1. 模試定義の取得
                const examDef = await (0, exams_1.getExam)(params.id);
                if (!examDef || !examDef.structure) {
                    throw new Error('模試の構成情報が見つかりません。');
                }
                setExamDefinition(examDef);
                // 2. 全問題の取得
                const questions = await (0, exams_1.getExamQuestions)(params.id);
                if (!questions || questions.length === 0) {
                    throw new Error('模試の問題が見つかりません。');
                }
                setAllQuestions(questions);
                // 3. 進行中の受験記録を探す
                const attemptsRef = (0, firestore_1.collection)(firebase_1.db, 'exam_attempts');
                const qInProgress = (0, firestore_1.query)(attemptsRef, (0, firestore_1.where)('userId', '==', user.uid), (0, firestore_1.where)('examId', '==', params.id), (0, firestore_1.where)('status', '==', 'in-progress'), (0, firestore_1.orderBy)('startedAt', 'desc'), (0, firestore_1.limit)(1));
                const inProgressSnapshot = await (0, firestore_1.getDocs)(qInProgress);
                if (!inProgressSnapshot.empty) {
                    // 進行中の記録があれば再開
                    const existingAttemptDoc = inProgressSnapshot.docs[0];
                    const existingAttemptData = { id: existingAttemptDoc.id, ...existingAttemptDoc.data() };
                    setAttemptId(existingAttemptDoc.id);
                    setAttemptData(existingAttemptData);
                    setCurrentStructureIndex(existingAttemptData.currentStructureIndex || 0);
                    console.log('進行中の受験記録を再開:', existingAttemptDoc.id);
                }
                else {
                    // 進行中の記録がない場合、完了済みの記録を探す
                    const qCompleted = (0, firestore_1.query)(attemptsRef, (0, firestore_1.where)('userId', '==', user.uid), (0, firestore_1.where)('examId', '==', params.id), (0, firestore_1.where)('status', '==', 'completed'), (0, firestore_1.limit)(1) // 完了済みが複数あっても、1つ見つかれば十分
                    );
                    const completedSnapshot = await (0, firestore_1.getDocs)(qCompleted);
                    if (!completedSnapshot.empty) {
                        // 完了済みの記録が見つかった場合、エラー表示
                        console.log('この模試は既に受験済みです。', completedSnapshot.docs[0].id);
                        // 結果ページへのリンクを表示するなどの対応も可能
                        // const completedAttemptId = completedSnapshot.docs[0].id;
                        // setError(`この模試は既に受験済みです。結果を見る: /exams/${params.id}/results/${completedAttemptId}`); 
                        setError('この模試は既に受験済みです。再度受験することはできません。');
                        setIsLoading(false); // ローディング終了
                        return; // これ以上処理を進めない
                    }
                    else {
                        // 進行中でも完了済みでもない場合、新規作成
                        console.log('新しい受験記録を作成します。');
                        const initialSections = {};
                        examDef.structure.forEach((section) => {
                            initialSections[section.title] = { status: 'pending' };
                        });
                        const newAttemptData = {
                            userId: user.uid,
                            examId: params.id,
                            examTitle: examDef.title,
                            startedAt: (0, firestore_1.serverTimestamp)(),
                            status: 'in-progress',
                            currentStructureIndex: 0,
                            sections: initialSections,
                        };
                        const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'exam_attempts'), newAttemptData);
                        setAttemptId(docRef.id);
                        setAttemptData({ id: docRef.id, ...newAttemptData, startedAt: firestore_1.Timestamp.now() });
                        setCurrentStructureIndex(0);
                        console.log('新規受験記録を作成しました:', docRef.id);
                    }
                }
            }
            catch (err) {
                console.error('試験初期化エラー:', err);
                setError(err.message || '試験の準備中にエラーが発生しました。');
            }
            finally {
                // 完了済みチェックで早期 return する場合があるので、ここでの setIsLoading(false) は削除し、
                // 正常に初期化が完了した場合のみ最後に設定する
                // setIsLoading(false);
                if (!error) { // エラーが発生していない場合のみローディングを解除
                    setIsLoading(false);
                }
            }
        };
        initializeExam();
    }, [params.id, user, authLoading, error]); // error を依存配列に追加
    if (authLoading || isLoading) {
        return (<div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner_1.default />
      </div>);
    }
    if (!user) {
        return (<div className="container mx-auto px-4 py-8">
        <p>ログインが必要です。</p> {/* リダイレクトされるはず */}
      </div>);
    }
    if (error) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>);
    }
    if (!examDefinition) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          模試データを読み込んでいます... (または、予期せぬエラーが発生しました)
        </div>
      </div>);
    }
    // 試験タイプに応じたタイトルや説明を設定
    const examTypeLabel = examDefinition ? {
        'TOEIC': 'TOEIC® TEST',
        'TOEFL': 'TOEFL iBT® TEST',
        'EIKEN': '英検®'
    }[examDefinition.type || 'TOEIC'] || '模試' : '模試';
    // --- 現在のセクション情報と問題リストを導出 --- 
    const currentSectionInfo = examDefinition?.structure?.[currentStructureIndex];
    const currentSectionQuestions = currentSectionInfo
        ? allQuestions.filter(q => q.sectionTitle === currentSectionInfo.title).sort((a, b) => a.order - b.order)
        : [];
    const currentSectionAttemptData = currentSectionInfo
        ? attemptData?.sections?.[currentSectionInfo.title]
        : undefined;
    // --- コールバック関数 --- 
    // Firestore の attempt ドキュメントを更新するヘルパー関数
    const updateAttemptInFirestore = async (dataToUpdate) => {
        if (!attemptId)
            return;
        try {
            const attemptRef = (0, firestore_1.doc)(firebase_1.db, 'exam_attempts', attemptId);
            await (0, firestore_1.updateDoc)(attemptRef, {
                ...dataToUpdate,
                updatedAt: (0, firestore_1.serverTimestamp)(), // 常に更新日時をセット
            });
        }
        catch (error) {
            console.error("Error updating exam attempt:", error);
            // ここでエラーをユーザーに通知することも検討
            setError('受験状況の保存に失敗しました。');
        }
    };
    // Instructions / Break 画面から呼ばれる: 次のセクションへ進む
    const handleNext = async () => {
        if (!examDefinition || !attemptData)
            return;
        const nextIndex = currentStructureIndex + 1;
        if (nextIndex < examDefinition.structure.length) {
            const updateData = {
                currentStructureIndex: nextIndex,
            };
            // 現在のセクションがinstructions/breakの場合、status: 'skipped'などを記録しても良い
            // const currentSectionTitle = examDefinition.structure[currentStructureIndex].title;
            // updateData[`sections.${currentSectionTitle}.status`] = 'skipped'; 
            await updateAttemptInFirestore(updateData);
            setCurrentStructureIndex(nextIndex); // ローカル State も更新
        }
        else {
            // 通常ここには来ないはず (最後のセクションはExamFormからSubmitされる)
            console.warn('Trying to move past the last section from handleNext');
        }
    };
    // ExamForm から呼ばれる: セクションの解答を提出し、次に進む
    const handleSectionSubmit = async (submittedAnswers) => {
        if (!examDefinition || !attemptData || !attemptId)
            return;
        const currentSectionInfo = examDefinition.structure[currentStructureIndex];
        if (!currentSectionInfo)
            return;
        console.log(`Submitting section ${currentSectionInfo.title}`);
        setIsLoading(true); // 処理中の表示
        try {
            // スコア計算 (可能な場合)
            let sectionScore = undefined;
            if ('reading listening'.includes(currentSectionInfo.type)) { // 例: 選択問題ベースのセクション
                const sectionQuestions = allQuestions.filter(q => q.sectionTitle === currentSectionInfo.title);
                let correctCount = 0;
                let totalScoreable = 0;
                sectionQuestions.forEach(q => {
                    if (q.correctAnswer !== undefined && q.questionType === 'multiple-choice') {
                        totalScoreable++;
                        if (submittedAnswers[q.id] === q.correctAnswer) {
                            correctCount++;
                        }
                    }
                });
                sectionScore = totalScoreable > 0 ? Math.round((correctCount / totalScoreable) * 100) : 0;
                console.log(`Section Score (${currentSectionInfo.title}): ${sectionScore}%`);
            }
            // Firestore 更新データ準備
            const sectionUpdateKey = `sections.${currentSectionInfo.title}`;
            const updateData = {
                [`${sectionUpdateKey}.answers`]: submittedAnswers,
                [`${sectionUpdateKey}.status`]: 'completed',
                [`${sectionUpdateKey}.completedAt`]: (0, firestore_1.serverTimestamp)(),
            };
            if (sectionScore !== undefined) {
                updateData[`${sectionUpdateKey}.score`] = sectionScore;
            }
            const nextIndex = currentStructureIndex + 1;
            let isLastSection = false;
            let overallScore = undefined; // 全体スコア変数
            if (nextIndex >= examDefinition.structure.length) {
                // 最後のセクションの場合
                isLastSection = true;
                updateData['status'] = 'completed';
                updateData['completedAt'] = (0, firestore_1.serverTimestamp)();
                updateData['currentStructureIndex'] = nextIndex; // 完了を示すためにインデックスを進める
                // --- 全体スコアの計算 --- 
                // ローカルの最新のセクション状態 (更新前のデータと今回の更新データをマージ)
                const updatedSectionsForScore = {
                    ...attemptData.sections,
                    [currentSectionInfo.title]: {
                        ...(attemptData.sections[currentSectionInfo.title] || {}),
                        answers: submittedAnswers,
                        status: 'completed',
                        score: sectionScore, // 計算した今回のスコアを使用
                        completedAt: (0, firestore_1.serverTimestamp)() // 仮の時刻
                    }
                };
                let totalScore = 0;
                let scoreCount = 0;
                Object.values(updatedSectionsForScore).forEach(sec => {
                    if (typeof sec.score === 'number') {
                        totalScore += sec.score;
                        scoreCount++;
                    }
                });
                if (scoreCount > 0) {
                    overallScore = Math.round(totalScore / scoreCount);
                    updateData['overallScore'] = overallScore; // 計算結果を更新データに追加
                    console.log('Overall Score Calculated:', overallScore);
                }
                else {
                    console.log('Could not calculate overall score.');
                }
                // --- 全体スコア計算ここまで ---
            }
            else {
                updateData['currentStructureIndex'] = nextIndex;
            }
            // Firestore 更新実行
            await updateAttemptInFirestore(updateData);
            // ローカル State 更新
            setAttemptData(prev => {
                if (!prev)
                    return null;
                const updatedSections = {
                    ...prev.sections,
                    [currentSectionInfo.title]: {
                        ...(prev.sections[currentSectionInfo.title] || {}),
                        answers: submittedAnswers,
                        status: 'completed',
                        score: sectionScore,
                        completedAt: firestore_1.Timestamp.now() // ローカルでは現在の時刻で仮反映
                    }
                };
                const updatedAttempt = {
                    ...prev,
                    sections: updatedSections,
                    currentStructureIndex: nextIndex,
                    status: isLastSection ? 'completed' : prev.status,
                    completedAt: isLastSection ? firestore_1.Timestamp.now() : prev.completedAt,
                    overallScore: isLastSection ? overallScore : prev.overallScore // 計算した全体スコアも反映
                };
                return updatedAttempt;
            });
            // 最後のセクションでなければ、次のセクションへ
            if (!isLastSection) {
                setCurrentStructureIndex(nextIndex);
            }
            else {
                console.log('Exam Completed! Redirecting to results...');
                // 結果ページへ自動リダイレクト (コメント解除)
                router.push(`/exams/${params.id}/results/${attemptId}`);
            }
        }
        catch (err) {
            console.error("Error submitting section:", err);
            setError(err.message || 'セクションの提出中にエラーが発生しました。');
        }
        finally {
            setIsLoading(false);
        }
    };
    // --- レンダリングロジック --- 
    return (<div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* --- 現在のセクションに応じたコンポーネント表示 --- */} 
      {currentSectionInfo?.type === 'instructions' && (<InstructionsScreen_1.default title={currentSectionInfo.title} instructions={currentSectionInfo.instructions} onNext={handleNext} // handleNext を後で定義
        />)}

      {currentSectionInfo?.type === 'break' && (<BreakScreen_1.default title={currentSectionInfo.title} duration={currentSectionInfo.duration} onNext={handleNext} // handleNext を後で定義
        />)}

      {currentSectionInfo && ('reading listening writing speaking'.includes(currentSectionInfo.type)) && (<ExamForm_1.default examId={params.id} sectionInfo={currentSectionInfo} questions={currentSectionQuestions} initialAttemptData={currentSectionAttemptData} onSubmit={handleSectionSubmit} examType={examDefinition?.type || ''} // examType を渡す (examDefinitionがnullの場合も考慮)
        />)}
      
      {/* 完了メッセージや結果ページへのリンク（オプション） */} 
      {attemptData?.status === 'completed' && (<div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
           <h2 className="text-xl font-bold text-green-800 mb-4">試験完了！</h2>
           <p className="text-green-700 mb-4">お疲れ様でした。結果を確認しましょう。</p>
           <link_1.default href={`/exams/${params.id}/results/${attemptId}`} /* 結果ページのパスは要調整 */ className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
             結果を見る
           </link_1.default>
        </div>)}
    </div>);
}
