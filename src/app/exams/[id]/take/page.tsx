'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    writeBatch,
    setDoc
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
import { FirebaseError } from 'firebase/app';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptIdFromQuery = searchParams.get('attemptId');
  const { user, loading: authLoading } = useAuth();
  const [examDefinition, setExamDefinition] = useState<FirestoreExamData | null>(null);
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [attemptData, setAttemptData] = useState<ExamAttempt | null>(null);
  const [currentStructureIndex, setCurrentStructureIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<ExamSection | null>(null);
  const [nextSectionTitle, setNextSectionTitle] = useState<string | null>(null);
  const [timeLeftInSection, setTimeLeftInSection] = useState<number | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const fetchData = async () => {
      if (!user || !params.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // 1. 模試定義の取得
        const examDef = await getExam(params.id); 
        if (!examDef || !examDef.structure) {
          throw new Error('模試の構成情報が見つかりません。');
        }
        setExamDefinition(examDef);

        // 2. 全問題の取得
        const q = query(collection(db, 'questions'), where('examId', '==', params.id));
        const querySnapshot = await getDocs(q);
        const fetchedQuestions: Question[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          fetchedQuestions.push({ id: doc.id, ...doc.data() } as Question);
        });
        if (fetchedQuestions.length === 0) console.warn('No questions found for this exam.');
        
        const questionsBySection: Record<string, Question[]> = {};
        fetchedQuestions.forEach(q => {
          if (!questionsBySection[q.sectionTitle]) {
            questionsBySection[q.sectionTitle] = [];
          }
          questionsBySection[q.sectionTitle].push(q);
        });
        setQuestions(questionsBySection); // fetchedQuestions の代わりに questionsBySection をセット

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

    if (user && params.id) {
      fetchData();
    } else if (!authLoading) { // userがnullかつauthLoadingも終わっている場合はエラーかリダイレクト
      setIsLoading(false);
      // router.push('/login'); // 必要ならログインページへ
    }
  }, [user, params.id, attemptIdFromQuery, router, authLoading]);

  // currentSection, nextSectionTitle, timeLeftInSection の設定とisLoadingの最終処理
  useEffect(() => {
    if (examDefinition && attemptData) {
      if (currentStructureIndex < examDefinition.structure.length) {
        const section = examDefinition.structure[currentStructureIndex];
        setCurrentSection(section);
        if (section?.duration) {
          setTimeLeftInSection(section.duration);
        }
        const nextTitle = currentStructureIndex + 1 < examDefinition.structure.length ? examDefinition.structure[currentStructureIndex + 1]?.title : null;
        setNextSectionTitle(nextTitle);
        setIsLoading(false); // ここで最終的にローディングを解除
      } else if (attemptData.status === 'completed'){
        setIsLoading(false); // 完了済みの場合もローディング解除
        router.push(`/exams/${params.id}/result?attemptId=${attemptData.id}`);
      } else {
        // currentStructureIndex が範囲外だが未完了の場合 (通常はありえないが)
        setIsLoading(false);
        setError("試験の進行状態が無効です。");
      }
    }
  }, [currentStructureIndex, examDefinition, attemptData, router, params.id]);

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

  // currentSection が null の場合はローディングなどを表示 (useEffectでセットされるのを待つ)
  if (!currentSection) {
    // examDefinition や attemptData があっても currentSection がまだセットされていない初期状態
    // isLoading が false になってここに到達する場合、何らかの初期化問題の可能性
    return <div className="flex justify-center items-center h-screen">Initializing section...</div>;
  }
  
  // questionsForCurrentSection は ExamForm に渡すためにここで定義
  // この時点で currentSection は null ではないはず
  const questionsForCurrentForm = useMemo(() => {
    // .sort() は元の配列を変更する可能性があるため、スプレッド構文でコピーしてからソートする
    return [...(questions[currentSection.title] || [])].sort((a: Question, b: Question) => a.order - b.order);
  }, [questions, currentSection.title]);

  // 試験タイプに応じたタイトルや説明を設定
  const examTypeLabel = examDefinition ? {
    'TOEIC': 'TOEIC® TEST',
    'TOEFL': 'TOEFL iBT® TEST',
    'EIKEN': '英検®'
  }[examDefinition.type || 'TOEIC'] || '模試' : '模試';

  // --- コールバック関数 --- 

  // Firestore の attempt ドキュメントを更新するヘルパー関数
  const updateAttemptInFirestore = useCallback(async (dataToUpdate: Partial<ExamAttempt>) => {
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
  }, [attemptId]); // attemptId のみ依存

  // Instructions / Break / Speaking準備 画面から呼ばれる: 次のセクションへ進む
  const handleNext = useCallback(async () => {
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
  }, [examDefinition, attemptData, currentStructureIndex, updateAttemptInFirestore]); // 依存関係を明示

  // ExamForm から呼ばれる: セクションの解答を提出し、次に進む
  const handleSectionSubmit = useCallback(async (submittedAnswers: Record<string, number | string | Blob>) => {
    if (!user || !examDefinition || !currentSection || !attemptData || !attemptData.id || isSubmitting) {
      console.warn('[Page] handleSectionSubmit called with invalid state');
      return;
    }
    console.log(`[Page] handleSectionSubmit for section: ${currentSection.title}`, submittedAnswers);
    setIsSubmitting(true);

    const attemptDocRef = doc(db, 'exam_attempts', attemptData.id);
    const sectionTitle = currentSection.title;
    const sectionType = currentSection.type;

    const newSectionAttemptData: Partial<SectionAttempt> = {
      status: 'completed',
      completedAt: serverTimestamp() as Timestamp,
    };

    const textOrNumberAnswers: Record<string, string | number> = {};
    let audioBlobToUpload: Blob | null = null;
    let audioAnswerKey: string | null = null;

    for (const key in submittedAnswers) {
      const answer = submittedAnswers[key];
      if (answer instanceof Blob) {
        audioBlobToUpload = answer;
        audioAnswerKey = key;
        textOrNumberAnswers[key] = 'audio_pending_upload';
      } else {
        textOrNumberAnswers[key] = answer;
      }
    }
    newSectionAttemptData.answers = textOrNumberAnswers;

    const questionsForThisSection = questions[sectionTitle]?.sort((a: Question, b: Question) => a.order - b.order) || [];

    if (sectionType === 'writing' && questionsForThisSection.length > 0) {
      const writingQuestion = questionsForThisSection[0];
      const userAnswer = textOrNumberAnswers[writingQuestion.id] as string;
      const prompt = writingQuestion.content;

      if (userAnswer && userAnswer.trim().length > 0) {
        try {
          const response = await fetch('/api/grade-writing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ essay: userAnswer, prompt }),
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({error: "Failed to parse error response"}));
            throw new Error(errorData.error || `Failed to grade writing: ${response.statusText}`);
          }
          const gradingResult = await response.json();
          newSectionAttemptData.score = gradingResult.score;
          newSectionAttemptData.feedback = gradingResult.feedback;
          newSectionAttemptData.positive_points = gradingResult.positive_points;
          newSectionAttemptData.areas_for_improvement = gradingResult.areas_for_improvement;
        } catch (err) {
          console.error("[Page] Error during AI grading:", err);
          setError(err instanceof Error ? err.message : 'Unknown error during AI grading');
          newSectionAttemptData.feedback = "Error during AI grading.";
        }
      } else {
        console.log("[Page] Writing answer empty, skipping grading.");
      }
    } else if (sectionType === 'reading' || sectionType === 'listening') {
      let correctCount = 0;
      let totalScoreable = 0;
      questionsForThisSection.forEach((q: Question) => {
        if (q.correctAnswer !== undefined && q.questionType === 'multiple-choice' && textOrNumberAnswers[q.id] !== undefined) {
          totalScoreable++;
          if (textOrNumberAnswers[q.id] === q.correctAnswer) {
            correctCount++;
          }
        }
      });
      if (totalScoreable > 0) {
        newSectionAttemptData.score = Math.round((correctCount / totalScoreable) * 100);
      }
      console.log(`[Page] Score for ${sectionType} ${sectionTitle}: ${newSectionAttemptData.score}`);
    }
    // TODO: Speakingセクションの処理 (音声アップロードと採点)

    const nextActualIndex = currentStructureIndex + 1;
    try {
      const updateData: Record<string, any> = {
        [`sections.${sectionTitle}`]: newSectionAttemptData,
        currentStructureIndex: nextActualIndex,
        updatedAt: serverTimestamp()
      };

      if (nextActualIndex >= examDefinition.structure.length) {
        updateData['status'] = 'completed';
        updateData['completedAt'] = serverTimestamp();
      }

      await updateDoc(attemptDocRef, updateData);

      setAttemptData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sections: {
            ...prev.sections,
            [sectionTitle]: {
              ...(prev.sections[sectionTitle] || {}),
              ...newSectionAttemptData,
              completedAt: Timestamp.now()
            } as SectionAttempt
          },
          currentStructureIndex: nextActualIndex,
          status: (nextActualIndex >= examDefinition.structure.length) ? 'completed' : prev.status,
          completedAt: (nextActualIndex >= examDefinition.structure.length) ? Timestamp.now() : prev.completedAt
        };
      });

      if (nextActualIndex < examDefinition.structure.length) {
        setCurrentStructureIndex(nextActualIndex);
        const newCurrentSection = examDefinition.structure[nextActualIndex];
        setCurrentSection(newCurrentSection);
        if (newCurrentSection.duration) setTimeLeftInSection(newCurrentSection.duration);
        const newNextSectionTitle = nextActualIndex + 1 < examDefinition.structure.length ? examDefinition.structure[nextActualIndex + 1]?.title : null;
        setNextSectionTitle(newNextSectionTitle);
      } else {
        router.push(`/exams/${examDefinition.id}/result?attemptId=${attemptData.id}`);
      }
    } catch (err) {
      console.error("[Page] Error submitting section to Firestore:", err);
      setError(err instanceof Error ? err.message : 'Unknown error submitting section');
    } finally {
      setIsSubmitting(false);
    }
  }, [user, examDefinition, currentSection, attemptData, questions, router, isSubmitting, updateAttemptInFirestore]); // 依存関係を明示

  const handleSkipSection = async () => {
    if (!user || !examDefinition || !currentSection || !attemptData || !attemptData.id || isSubmitting) return;
    console.log(`[Page] Skipping section: ${currentSection.title}`);
    setIsSubmitting(true);
    setShowSkipConfirm(false);

    const attemptDocRef = doc(db, 'exam_attempts', attemptData.id);
    const sectionTitle = currentSection.title;
    const nextIdx = currentStructureIndex + 1;

    try {
      const updateData: Record<string, any> = {
        [`sections.${sectionTitle}.status`]: 'skipped',
        [`sections.${sectionTitle}.completedAt`]: serverTimestamp(),
        currentStructureIndex: nextIdx,
        updatedAt: serverTimestamp()
      };
       if (nextIdx >= examDefinition.structure.length) {
        updateData['status'] = 'completed'; // 最後なら試験自体も完了
        updateData['completedAt'] = serverTimestamp();
      }
      await updateDoc(attemptDocRef, updateData);

      setAttemptData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sections: {
            ...prev.sections,
            [sectionTitle]: {
              ...(prev.sections[sectionTitle] || {}),
              status: 'skipped',
              completedAt: Timestamp.now()
            } as SectionAttempt
          },
          currentStructureIndex: nextIdx,
          status: (nextIdx >= examDefinition.structure.length) ? 'completed' : prev.status,
          completedAt: (nextIdx >= examDefinition.structure.length) ? Timestamp.now() : prev.completedAt
        };
      });
      
      setCurrentStructureIndex(nextIdx);
      if (nextIdx < examDefinition.structure.length) {
        // moveToNextSection(); // インデックス更新後に直接次のセクション情報を設定
        const newCurrentSection = examDefinition.structure[nextIdx];
        setCurrentSection(newCurrentSection);
        if (newCurrentSection.duration) setTimeLeftInSection(newCurrentSection.duration);
        const newNextSectionTitle = nextIdx + 1 < examDefinition.structure.length ? examDefinition.structure[nextIdx + 1]?.title : null;
        setNextSectionTitle(newNextSectionTitle);
      } else {
        router.push(`/exams/${examDefinition.id}/result?attemptId=${attemptData.id}`);
      }
    } catch (err) {
      console.error("[Page] Error skipping section:", err);
      setError(err instanceof Error ? err.message : 'Error skipping section');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- レンダリングロジック --- 
  
  // セクションタイプに応じた判定フラグ
  // const isInstructions = currentSection.type === 'instructions';
  // const isBreak = currentSection.type === 'break';
  // // isAudioPlaybackOnly, isImageDisplayOnly フラグを使用
  // const isAudioOnly = currentSection.isAudioPlaybackOnly && currentSection.audioUrl;
  // const isImageOnly = currentSection.isImageDisplayOnly && currentSection.imageUrl;
  // const isSpeaking = currentSection.type === 'speaking';
  // const isReading = currentSection.type === 'reading';
  // const isListening = currentSection.type === 'listening';
  // const isWriting = currentSection.type === 'writing';

  // const questionsForThisSection = questionsForCurrentSection; // エイリアス (既存の変数名を使用)
  // const hasSpeakingQuestion = questionsForThisSection.some(q => q.questionType === 'speaking');
  // const isSpeakingPreparation = isSpeaking && !hasSpeakingQuestion;
  // // ExamForm を表示する条件 (Speaking準備以外で、問題が存在するセクション)
  // const shouldShowExamForm = 
  //   !isInstructions && 
  //   !isBreak && 
  //   !isAudioOnly && 
  //   !isImageOnly && 
  //   !isSpeakingPreparation && 
  //   (isReading || isListening || isWriting || isSpeaking);

  const sectionRenderType = currentSection.type;
  const hasQuestions = questionsForCurrentForm.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* --- 現在のセクションに応じたコンポーネント表示 --- */} 

      {sectionRenderType === 'instructions' && (
        <InstructionsScreen 
          title={currentSection.title}
          instructions={currentSection.instructions}
          duration={currentSection.duration} 
          onNext={handleNext}
        />
      )}

      {sectionRenderType === 'break' && (
        <BreakScreen 
          title={currentSection.title} 
          duration={currentSection.duration || 300} 
          onNext={handleNext}
        />
      )}

      {sectionRenderType === 'speaking' && !hasQuestions && currentSection.isImageDisplayOnly && currentSection.imageUrl && (
        <ImageDisplayScreen 
          title={currentSection.title}
          imageUrl={currentSection.imageUrl}
          onNext={handleNext}
        />
      )}

      {sectionRenderType === 'speaking' && !hasQuestions && currentSection.isAudioPlaybackOnly && currentSection.audioUrl && (
        <AudioPlaybackScreen 
          title={currentSection.title}
          audioUrl={currentSection.audioUrl}
          duration={currentSection.duration}
          onNext={handleNext}
        />
      )}
      
      {sectionRenderType === 'speaking' && !hasQuestions && !(currentSection.isImageDisplayOnly && currentSection.imageUrl) && !(currentSection.isAudioPlaybackOnly && currentSection.audioUrl) && (
        // Speaking preparation that is not image/audio only (e.g. just instructions & timer)
        <InstructionsScreen 
          title={currentSection.title}
          instructions={currentSection.instructions}
          duration={currentSection.duration} 
          onNext={handleNext} 
        />
      )}
      
      {sectionRenderType === 'speaking' && hasQuestions && (
        <ExamForm
          examId={params.id}
          sectionInfo={currentSection}
          questions={questionsForCurrentForm}
          initialAttemptData={attemptData?.sections[currentSection.title]}
          onSubmit={handleSectionSubmit}
          examType={examDefinition.type} 
        />
      )}

      {(sectionRenderType === 'reading' || sectionRenderType === 'listening' || sectionRenderType === 'writing') && (
        <>
          {!hasQuestions && currentSection.isImageDisplayOnly && currentSection.imageUrl && (
            <ImageDisplayScreen 
              title={currentSection.title}
              imageUrl={currentSection.imageUrl}
              onNext={handleNext}
            />
          )}
          {!hasQuestions && currentSection.isAudioPlaybackOnly && currentSection.audioUrl && (
            <AudioPlaybackScreen 
              title={currentSection.title}
              audioUrl={currentSection.audioUrl}
              duration={currentSection.duration}
              onNext={handleNext}
            />
          )}
          {hasQuestions && (
            <ExamForm
              examId={params.id}
              sectionInfo={currentSection}
              questions={questionsForCurrentForm}
              initialAttemptData={attemptData?.sections[currentSection.title]}
              onSubmit={handleSectionSubmit}
              examType={examDefinition.type} 
            />
          )}
          {/* If type is R/L/W but no questions AND not image/audio only (e.g. just instructions for a writing task start) */}
          {!hasQuestions && 
           !(currentSection.isImageDisplayOnly && currentSection.imageUrl) && 
           !(currentSection.isAudioPlaybackOnly && currentSection.audioUrl) &&
           currentSection.instructions && (
            <InstructionsScreen
              title={currentSection.title}
              instructions={currentSection.instructions}
              duration={currentSection.duration}
              onNext={handleNext}
            />
          )}
        </>
      )}
      
      {/* Fallback or Loading/Error display if no component matches (optional) */} 
      {![
        'instructions', 
        'break', 
        'speaking', 
        'reading', 
        'listening', 
        'writing'
      ].includes(sectionRenderType) && (
        <div>Loading section or unknown section type... ({sectionRenderType})</div>
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