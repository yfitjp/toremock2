'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExamForm from './ExamForm';
import InstructionsScreen from './InstructionsScreen';
import BreakScreen from './BreakScreen';
import AudioPlaybackScreen from './AudioPlaybackScreen';
import ImageDisplayScreen from './ImageDisplayScreen';
import { useAuth } from '@/app/hooks/useAuth';
import { getExam, getExamQuestions } from '@/app/lib/exams';
import { hasActiveSubscription } from '@/app/lib/subscriptions';
import { checkExamPurchase } from '@/app/lib/purchases';
import { 
    addDoc, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit, 
    serverTimestamp, 
    updateDoc, 
    Timestamp, 
    WriteBatch,
    writeBatch
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { 
    ExamData as FirestoreExamData, 
    Question, 
    ExamAttempt, 
    SectionAttempt, 
    ExamSection 
} from '@/app/lib/firestoreTypes';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Link from 'next/link';

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [examDefinition, setExamDefinition] = useState<FirestoreExamData | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [attemptData, setAttemptData] = useState<ExamAttempt | null>(null);
  const [currentStructureIndex, setCurrentStructureIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ページ離脱防止の警告
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
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
  useEffect(() => {
    if (attemptData?.status === 'completed') return; // 試験完了後は何もしない

    const confirmMessage = '試験を中断してページを移動しますか？\n解答状況は保存されません。';

    // --- リンククリックに対する警告 ---
    const handleAnchorClick = (event: MouseEvent) => {
      const targetElement = event.target as Element;
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
  useEffect(() => {
    const initializeExam = async () => {
      if (authLoading || !user) return;
      setIsLoading(true);
      setError(null);
      try {
        // 1. 模試定義の取得
        const examDef = await getExam(params.id); 
        if (!examDef || !examDef.structure) {
          throw new Error('模試の構成情報が見つかりません。');
        }
        setExamDefinition(examDef);

        // 2. 全問題の取得
        const questions = await getExamQuestions(params.id);
        if (!questions || questions.length === 0) {
          throw new Error('模試の問題が見つかりません。');
        }
        setAllQuestions(questions);

        // 3. 進行中の受験記録を探す
        const attemptsRef = collection(db, 'exam_attempts');
        const qInProgress = query(
          attemptsRef,
          where('userId', '==', user.uid),
          where('examId', '==', params.id),
          where('status', '==', 'in-progress'),
          orderBy('startedAt', 'desc'),
          limit(1)
        );
        const inProgressSnapshot = await getDocs(qInProgress);

        if (!inProgressSnapshot.empty) {
          // 進行中の記録があれば再開
          const existingAttemptDoc = inProgressSnapshot.docs[0];
          const existingAttemptData = { id: existingAttemptDoc.id, ...existingAttemptDoc.data() } as ExamAttempt;
          setAttemptId(existingAttemptDoc.id);
          setAttemptData(existingAttemptData);
          setCurrentStructureIndex(existingAttemptData.currentStructureIndex || 0);
          console.log('進行中の受験記録を再開:', existingAttemptDoc.id);
        } else {
          // 進行中の記録がない場合、完了済みの記録を探す
          const qCompleted = query(
            attemptsRef,
            where('userId', '==', user.uid),
            where('examId', '==', params.id),
            where('status', '==', 'completed'),
            limit(1) // 完了済みが複数あっても、1つ見つかれば十分
          );
          const completedSnapshot = await getDocs(qCompleted);

          if (!completedSnapshot.empty) {
            // 完了済みの記録が見つかった場合、エラー表示
            console.log('この模試は既に受験済みです。', completedSnapshot.docs[0].id);
            // 結果ページへのリンクを表示するなどの対応も可能
            // const completedAttemptId = completedSnapshot.docs[0].id;
            // setError(`この模試は既に受験済みです。結果を見る: /exams/${params.id}/results/${completedAttemptId}`); 
            setError('この模試は既に受験済みです。再度受験することはできません。');
            setIsLoading(false); // ローディング終了
            return; // これ以上処理を進めない
          } else {
            // 進行中でも完了済みでもない場合、新規作成
            console.log('新しい受験記録を作成します。');
            const initialSections: Record<string, SectionAttempt> = {};
            examDef.structure.forEach((section: ExamSection) => { 
              initialSections[section.title] = { status: 'pending' };
            });
            const newAttemptData: Omit<ExamAttempt, 'id'> = {
              userId: user.uid,
              examId: params.id,
              examTitle: examDef.title, 
              startedAt: serverTimestamp() as Timestamp,
              status: 'in-progress',
              currentStructureIndex: 0,
              sections: initialSections,
            };
            const docRef = await addDoc(collection(db, 'exam_attempts'), newAttemptData);
            setAttemptId(docRef.id);
            setAttemptData({ id: docRef.id, ...newAttemptData, startedAt: Timestamp.now() });
            setCurrentStructureIndex(0);
            console.log('新規受験記録を作成しました:', docRef.id);
          }
        }

      } catch (err: any) {
        console.error('試験初期化エラー:', err);
        setError(err.message || '試験の準備中にエラーが発生しました。');
      } finally {
        // 完了済みチェックで早期 return する場合があるので、ここでの setIsLoading(false) は削除し、
        // 正常に初期化が完了した場合のみ最後に設定する
        // setIsLoading(false); 
        // if (!error) { // エラーが発生していない場合のみローディングを解除
        //      setIsLoading(false);
        //  }
        setIsLoading(false); // 修正: エラーの有無に関わらずローディングを解除
      }
    };
    initializeExam();
  }, [params.id, user, authLoading]); // 修正: error を依存配列から削除

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>ログインが必要です。</p> { /* リダイレクトされるはず */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!examDefinition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          模試データを読み込んでいます... (または、予期せぬエラーが発生しました)
        </div>
      </div>
    );
  }

  // 試験タイプに応じたタイトルや説明を設定
  const examTypeLabel = examDefinition ? {
    'TOEIC': 'TOEIC® TEST',
    'TOEFL': 'TOEFL iBT® TEST',
    'EIKEN': '英検®'
  }[examDefinition.type || 'TOEIC'] || '模試' : '模試';

  // --- 現在のセクション情報と問題リストを導出 --- 
  const currentSection = examDefinition.structure[currentStructureIndex];
  const questionsForCurrentSection = allQuestions.filter(
    (q) => q.sectionTitle === currentSection.title
  ).sort((a, b) => a.order - b.order);

  // --- コールバック関数 --- 

  // Firestore の attempt ドキュメントを更新するヘルパー関数
  const updateAttemptInFirestore = async (dataToUpdate: Partial<ExamAttempt>) => {
    if (!attemptId) return;
    try {
      const attemptRef = doc(db, 'exam_attempts', attemptId);
      await updateDoc(attemptRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(), // 常に更新日時をセット
      });
    } catch (error) {
      console.error("Error updating exam attempt:", error);
      // ここでエラーをユーザーに通知することも検討
      setError('受験状況の保存に失敗しました。'); 
    }
  };

  // Instructions / Break / Speaking準備 画面から呼ばれる: 次のセクションへ進む
  const handleNext = async () => {
    if (!examDefinition || !attemptData) return;

    const nextIndex = currentStructureIndex + 1;
    if (nextIndex < examDefinition.structure.length) {
      const updateData: Partial<ExamAttempt> = {
        currentStructureIndex: nextIndex,
      };
      
      // 必要であれば、現在のセクションのステータスも更新
      const currentSectionTitle = examDefinition.structure[currentStructureIndex].title;
      const currentSectionStatus = attemptData.sections[currentSectionTitle]?.status;
      if (currentSectionStatus === 'pending' || currentSectionStatus === undefined) {
         // 準備画面などを通過した場合も 'skipped' または 'completed' にする（要件による）
         // updateData[`sections.${currentSectionTitle}.status`] = 'completed'; 
         // updateData[`sections.${currentSectionTitle}.completedAt`] = serverTimestamp();
      }
      
      await updateAttemptInFirestore(updateData);
      setCurrentStructureIndex(nextIndex); // ローカル State も更新
      setAttemptData(prev => prev ? { ...prev, currentStructureIndex: nextIndex } : null);
    } else {
      console.warn('Trying to move past the last section from handleNext');
    } 
  };

  // ExamForm から呼ばれる: セクションの解答を提出し、次に進む
  const handleSectionSubmit = async (submittedAnswers: Record<string, number | string>) => {
    if (!examDefinition || !attemptData || !attemptId) return;

    const currentSectionInfo = examDefinition.structure[currentStructureIndex];
    if (!currentSectionInfo) return;

    console.log(`[Page] Submitting section ${currentSectionInfo.title}`);
    setIsLoading(true); 

    try {
      const sectionUpdateKey = `sections.${currentSectionInfo.title}`;
      const updateData: Record<string, any> = {
        [`${sectionUpdateKey}.answers`]: submittedAnswers,
        [`${sectionUpdateKey}.status`]: 'completed',
        [`${sectionUpdateKey}.completedAt`]: serverTimestamp(),
      };
      
      let sectionScore: number | undefined = undefined;

      const questionsForThisSection = allQuestions.filter(q => q.sectionTitle === currentSectionInfo.title);
      const currentQuestionDataForGrading = questionsForThisSection.length > 0 ? questionsForThisSection[0] : undefined;

      // --- セクションタイプに応じた採点処理 --- 
      if (currentSectionInfo.type === 'writing' && currentQuestionDataForGrading && submittedAnswers[currentQuestionDataForGrading.id]) {
        try {
          const essayText = submittedAnswers[currentQuestionDataForGrading.id] as string;
          const essayPrompt = currentQuestionDataForGrading.content || 'N/A'; 

          console.log('[Page] Submitting essay to /api/grade-writing:', { essayText, essayPrompt });

          const gradingResponse = await fetch('/api/grade-writing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ essayText, essayPrompt }),
          });

          if (!gradingResponse.ok) {
            const errorData = await gradingResponse.json().catch(() => ({ error: 'Failed to parse error JSON' }));
            console.error('[Page] Grading API call failed:', gradingResponse.status, errorData);
            throw new Error(`Grading API failed with status ${gradingResponse.status}: ${errorData.error || 'Unknown error from grading API'}`);
          }

          const gradingResult = await gradingResponse.json();
          console.log('[Page] Grading Result from API:', gradingResult);

          if (typeof gradingResult.score === 'number') {
            updateData[`${sectionUpdateKey}.score`] = gradingResult.score;
            sectionScore = gradingResult.score;
          }
          if (gradingResult.feedback) {
            updateData[`${sectionUpdateKey}.feedback`] = gradingResult.feedback;
          }
          if (gradingResult.positive_points) {
            updateData[`${sectionUpdateKey}.positive_points`] = gradingResult.positive_points;
          }
          if (gradingResult.areas_for_improvement) {
            updateData[`${sectionUpdateKey}.areas_for_improvement`] = gradingResult.areas_for_improvement;
          }

        } catch (gradingError: any) {
          console.error('[Page] Failed to get or process grading from API:', gradingError);
          updateData[`${sectionUpdateKey}.feedback`] = `Automated grading failed: ${gradingError.message || 'Unknown error'}`;
          updateData[`${sectionUpdateKey}.score`] = undefined;
          sectionScore = undefined;
        }
      } else if (currentSectionInfo.type === 'speaking') {
          // Speaking セクションの処理
          console.log('[Page] Speaking section submitted with answers:', submittedAnswers);
          // TODO: 音声ファイルを Storage にアップロードし、URL を answers に保存する処理を後で追加
          // 現時点では submittedAnswers (仮のID文字列) をそのまま保存
          updateData[`${sectionUpdateKey}.score`] = undefined; // 採点は後で実装
          sectionScore = undefined;
      } else if (currentSectionInfo.type === 'reading' || currentSectionInfo.type === 'listening') {
        // 既存の選択問題のスコアリングロジック - 変更なし
        let correctCount = 0;
        let totalScoreable = 0;
        questionsForThisSection.forEach(q => {
          if (q.correctAnswer !== undefined && q.questionType === 'multiple-choice' && submittedAnswers[q.id] !== undefined) {
            totalScoreable++;
            if (submittedAnswers[q.id] === q.correctAnswer) {
              correctCount++;
            }
          }
        });
        if (totalScoreable > 0) {
            sectionScore = Math.round((correctCount / totalScoreable) * 100);
            updateData[`${sectionUpdateKey}.score`] = sectionScore;
        } else {
            updateData[`${sectionUpdateKey}.score`] = undefined;
            sectionScore = undefined;
        }
        console.log(`[Page] Section Score (${currentSectionInfo.title}): ${sectionScore !== undefined ? sectionScore + '%' : 'N/A'}`);
      }
      // --- 採点処理ここまで ---

      // --- 次のステップへの遷移処理 --- 
      const nextIndex = currentStructureIndex + 1;
      let isLastSection = false;
      let overallScore: number | undefined = undefined; 

      if (nextIndex >= examDefinition.structure.length) {
        // 最後のセクションの場合
        isLastSection = true;
        updateData['status'] = 'completed';
        updateData['completedAt'] = serverTimestamp();
        updateData['currentStructureIndex'] = nextIndex; 
        
        // --- 全体スコアの計算 --- 
        const updatedSectionsForScore = { 
            ...attemptData.sections, 
            [currentSectionInfo.title]: {
                ...(attemptData.sections[currentSectionInfo.title] || {}),
                answers: submittedAnswers,
                status: 'completed', 
                score: sectionScore, 
                completedAt: serverTimestamp()
            } as SectionAttempt
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
           updateData['overallScore'] = overallScore; 
           console.log('Overall Score Calculated:', overallScore);
        } else {
           console.log('Could not calculate overall score.');
        }
        // --- 全体スコア計算ここまで ---
      } else {
        updateData['currentStructureIndex'] = nextIndex;
      }

      // Firestore 更新実行
      await updateAttemptInFirestore(updateData);

      // ローカル State 更新
      setAttemptData(prev => {
          if (!prev) return null;
          const updatedSections = { 
              ...prev.sections, 
              [currentSectionInfo.title]: {
                  ...(prev.sections[currentSectionInfo.title] || {}),
                  answers: submittedAnswers,
                  status: 'completed', 
                  score: sectionScore,
                  // feedback なども更新データに含まれていれば反映させる (現状のコードにはないが将来的には)
                  completedAt: Timestamp.now()
              } as SectionAttempt
          };
          const updatedAttempt = { 
              ...prev, 
              sections: updatedSections,
              currentStructureIndex: nextIndex,
              status: isLastSection ? 'completed' : prev.status,
              completedAt: isLastSection ? Timestamp.now() : prev.completedAt,
              overallScore: isLastSection ? overallScore : prev.overallScore 
          } as ExamAttempt;
          return updatedAttempt;
      });

      // 遷移処理
      if (!isLastSection) {
          setCurrentStructureIndex(nextIndex);
       } else {
           console.log('Exam Completed! Redirecting to results...');
           console.log(`Redirecting to: /exams/${params.id}/result?attemptId=${attemptId}`);
           router.push(`/exams/${params.id}/result?attemptId=${attemptId}`);
       }

    } catch (err: any) {
      console.error("Error submitting section:", err);
      setError(err.message || 'セクションの提出中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // --- レンダリングロジック --- 
  
  // セクションタイプに応じた判定フラグ
  const isInstructions = currentSection.type === 'instructions';
  const isBreak = currentSection.type === 'break';
  // isAudioPlaybackOnly, isImageDisplayOnly フラグを使用
  const isAudioOnly = currentSection.isAudioPlaybackOnly && currentSection.audioUrl;
  const isImageOnly = currentSection.isImageDisplayOnly && currentSection.imageUrl;
  const isSpeaking = currentSection.type === 'speaking';
  const isReading = currentSection.type === 'reading';
  const isListening = currentSection.type === 'listening';
  const isWriting = currentSection.type === 'writing';

  const questionsForThisSection = questionsForCurrentSection; // エイリアス (既存の変数名を使用)
  const hasSpeakingQuestion = questionsForThisSection.some(q => q.questionType === 'speaking');
  const isSpeakingPreparation = isSpeaking && !hasSpeakingQuestion;
  // ExamForm を表示する条件 (Speaking準備以外で、問題が存在するセクション)
  const shouldShowExamForm = 
    !isInstructions && 
    !isBreak && 
    !isAudioOnly && 
    !isImageOnly && 
    !isSpeakingPreparation && 
    (isReading || isListening || isWriting || isSpeaking);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* --- 現在のセクションに応じたコンポーネント表示 --- */} 

      {isInstructions && (
        <InstructionsScreen 
          title={currentSection.title}
          instructions={currentSection.instructions}
          duration={currentSection.duration} 
          onNext={handleNext}
        />
      )}

      {isBreak && (
        <BreakScreen 
          title={currentSection.title} 
          duration={currentSection.duration || 300} 
          onNext={handleNext} // onComplete -> onNext に修正
        />
      )}

      {isAudioOnly && (
        <AudioPlaybackScreen 
          title={currentSection.title}
          audioUrl={currentSection.audioUrl || ''}
          // duration は AudioPlaybackScreen が受け取るので渡しても良い
          duration={currentSection.duration} 
          onNext={handleNext} // onComplete -> onNext に修正
        />
      )}

      {isImageOnly && (
        <ImageDisplayScreen 
          title={currentSection.title}
          imageUrl={currentSection.imageUrl || ''}
          // duration は ImageDisplayScreen が受け取らないので削除
          // 必要であれば ImageDisplayScreen を改修
          onNext={handleNext} // onComplete -> onNext に修正
        />
      )}

      {/* Speaking Preparation Section */} 
      {isSpeakingPreparation && (
        <InstructionsScreen 
          title={currentSection.title}
          instructions={currentSection.instructions}
          duration={currentSection.duration} 
          onNext={handleNext} 
        />
      )}

      {/* Speaking Response Section or other form-based sections */} 
      {shouldShowExamForm && (
        <ExamForm
          examId={params.id}
          sectionInfo={currentSection}
          questions={questionsForThisSection}
          initialAttemptData={attemptData?.sections[currentSection.title]}
          onSubmit={handleSectionSubmit}
          examType={examDefinition.type} 
        />
      )}
      
      {/* Fallback or Loading/Error display if no component matches (optional) */} 
      {!isInstructions && !isBreak && !isAudioOnly && !isImageOnly && !isSpeakingPreparation && !shouldShowExamForm && (
        <div>Loading section or unknown section type...</div>
      )}

      {/* Debug Info (Optional) */} 
      {/* 
      <pre className="mt-8 p-4 bg-gray-100 rounded text-xs overflow-auto">
        {JSON.stringify({ 
          currentStructureIndex, 
          currentSection, 
          isSpeakingPreparation, 
          attemptId, 
          attemptData 
        }, null, 2)}
      </pre>
      */} 
    </div>
  );
}