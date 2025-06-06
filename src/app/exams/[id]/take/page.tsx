'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { initializeApp, setLogLevel } from 'firebase/app';
import { app } from '@/app/lib/firebase';
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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '@/app/lib/firebase';
import { 
    ExamData as FirestoreExamData, 
    Question, 
    ExamAttempt, 
    SectionAttempt, 
    ExamSection,
    SectionType
} from '@/app/lib/firestoreTypes';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export default function ExamPage({ params }: { params: { id: string } }) {
  // Firebase SDKのログレベルをデバッグに設定
  setLogLevel('debug'); 
  console.log('%c[ExamPage] Firebase log level set to debug.', 'color: orange; font-weight: bold;');

  console.log('%c[ExamPage] Component RENDERED', 'color: blue; font-weight: bold;');
  // console.log('%c[ExamPage] Component Start', 'color: magenta; font-weight: bold;', { params });

  const router = useRouter();
  // console.log('%c[ExamPage] after useRouter', 'color: magenta;');
  const searchParams = useSearchParams();
  // console.log('%c[ExamPage] after useSearchParams', 'color: magenta;');
  const attemptIdFromQuery = searchParams.get('attemptId');
  // console.log('%c[ExamPage] after get attemptIdFromQuery', 'color: magenta;', { attemptIdFromQuery });
  const { user, loading: authLoading } = useAuth();
  // console.log('%c[ExamPage] after useAuth', 'color: magenta;', { user, authLoading });
  
  const [examDefinition, setExamDefinition] = useState<FirestoreExamData | null>(null);
  // console.log('%c[ExamPage] after useState examDefinition', 'color: magenta;', { examDefinition });
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  // console.log('%c[ExamPage] after useState questions', 'color: magenta;', { questions });
  const [attemptId, setAttemptId] = useState<string | null>(null);
  // console.log('%c[ExamPage] after useState attemptId', 'color: magenta;', { attemptId });
  const [attemptData, setAttemptData] = useState<ExamAttempt | null>(null);
  // console.log('%c[ExamPage] after useState attemptData', 'color: magenta;', { attemptData });
  const [currentStructureIndex, setCurrentStructureIndex] = useState<number>(0);
  // console.log('%c[ExamPage] after useState currentStructureIndex', 'color: magenta;', { currentStructureIndex });
  const [isLoading, setIsLoading] = useState(true);
  // console.log('%c[ExamPage] after useState isLoading', 'color: magenta;', { isLoading });
  const [error, setError] = useState<string | null>(null);
  // console.log('%c[ExamPage] after useState error', 'color: magenta;', { error });
  const [currentSection, setCurrentSection] = useState<ExamSection | null>(null);
  // console.log('%c[ExamPage] after useState currentSection', 'color: magenta;', { currentSection });
  const [nextSectionTitle, setNextSectionTitle] = useState<string | null>(null);
  // console.log('%c[ExamPage] after useState nextSectionTitle', 'color: magenta;', { nextSectionTitle });
  const [timeLeftInSection, setTimeLeftInSection] = useState<number | null>(null);
  // console.log('%c[ExamPage] after useState timeLeftInSection', 'color: magenta;', { timeLeftInSection });
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  // console.log('%c[ExamPage] after useState showSkipConfirm', 'color: magenta;', { showSkipConfirm });
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  // console.log('%c[ExamPage] after useState showExitConfirm', 'color: magenta;', { showExitConfirm });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log('%c[ExamPage] after useState isSubmitting', 'color: magenta;', { isSubmitting });

  // console.log('%c[ExamPage] Defining all useMemo/useCallback hooks BEFORE early returns', 'color: purple; font-weight: bold;');

  // console.log('%c[ExamPage] Before useMemo questionsForCurrentForm (TEMPORARILY USING EMPTY ARRAY)', 'color: red; font-weight: bold;');
  const questionsForCurrentForm: Question[] = useMemo(() => {
    // console.log('%c[ExamPage] useMemo questionsForCurrentForm - START', 'color: orange;', { questions, currentSection });
    if (!currentSection || !questions[currentSection.title]) {
      // console.log('%c[ExamPage] useMemo questionsForCurrentForm - returning empty array (no currentSection or no questions for section)', 'color: orange;');
      return [];
    }
    const unsortedQuestions = questions[currentSection.title];
    const sorted = [...unsortedQuestions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    // console.log('%c[ExamPage] useMemo questionsForCurrentForm - END (sorted)', 'color: orange;', { sorted });
    return sorted;
  }, [questions, currentSection]);
  // console.log('%c[ExamPage] After useMemo questionsForCurrentForm (USING EMPTY ARRAY)', 'color: red; font-weight: bold;', { questionsForCurrentForm });

  // console.log('%c[ExamPage] Before useCallback updateAttemptInFirestore (testing with empty dependency array)', 'color: orange; font-weight: bold;');
  const updateAttemptInFirestore = useCallback(async (dataToUpdate: Partial<ExamAttempt>) => {
    // console.log('%c[ExamPage] useCallback updateAttemptInFirestore - CALLED', 'color: darkcyan;', { dataToUpdate });
    if (!attemptId) return;
    try {
      const attemptRef = doc(db, 'exam_attempts', attemptId);
      await updateDoc(attemptRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating exam attempt:", error);
      setError('受験状況の保存に失敗しました。'); 
    }
  }, [attemptId]); // 依存配列を [attemptId] に戻す
  // console.log('%c[ExamPage] After useCallback updateAttemptInFirestore', 'color: magenta;');

  // console.log('%c[ExamPage] Before useCallback handleNext', 'color: magenta;');
  const handleNext = useCallback(async () => {
    // console.log('%c[ExamPage] useCallback handleNext - CALLED', 'color: darkcyan;');
    if (!examDefinition || !attemptData) return;

    const nextIndex = currentStructureIndex + 1;
    if (nextIndex < examDefinition.structure.length) {
      const updateData: Partial<ExamAttempt> = {
        currentStructureIndex: nextIndex,
      };
      
      // const currentSectionTitle = examDefinition.structure[currentStructureIndex].title; // これは handleSectionSubmit で行うべき
      // const currentSectionStatus = attemptData.sections[currentSectionTitle]?.status;
      // if (currentSectionStatus === 'pending' || currentSectionStatus === undefined) {
      // }
      
      await updateAttemptInFirestore(updateData);
      setCurrentStructureIndex(nextIndex);
      setAttemptData(prev => prev ? { ...prev, currentStructureIndex: nextIndex } : null);
    } else {
      // console.warn('Trying to move past the last section from handleNext');
    } 
  }, [examDefinition, attemptData, currentStructureIndex, updateAttemptInFirestore]);
  // console.log('%c[ExamPage] After useCallback handleNext', 'color: magenta;');

  // console.log('%c[ExamPage] Before useCallback handleSectionSubmit', 'color: magenta;');
  const handleSectionSubmit = useCallback(async (submittedAnswers: Record<string, number | string | Blob>) => {
    if (!user || !examDefinition || !currentSection || !attemptData || !attemptData.id || isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const attemptDocRef = doc(db, 'exam_attempts', attemptData.id);
    const sectionTitle = currentSection.title;
    const sectionType = currentSection.type;
    const currentSectionAttemptRef = doc(db, 'exam_attempts', attemptData.id, 'sections', sectionTitle);

    // 1. 解答データの準備
    const answersToSaveInFirestore: Record<string, string | number> = {};
    let audioBlobToUpload: Blob | null = null; 
    let audioAnswerKey: string | null = null;   

    for (const key in submittedAnswers) {
      const answer = submittedAnswers[key];
      // Speakingセクションの場合のみBlobをaudioBlobToUploadに割り当て、それ以外は直接answersToSaveInFirestoreに格納
      if (answer instanceof Blob && sectionType === 'speaking') { 
        audioBlobToUpload = answer;
        audioAnswerKey = key;
        answersToSaveInFirestore[key] = 'audio_pending_upload'; // 初期状態
      } else if (!(answer instanceof Blob)) { 
        answersToSaveInFirestore[key] = answer;
      }
    }

    // 2. finalSectionData の初期化
    const finalSectionData: Partial<SectionAttempt> = {
      status: 'completed',
      answers: answersToSaveInFirestore,
      completedAt: serverTimestamp() as Timestamp,
    };

    // 3. 音声処理と文字起こし (Speakingセクションの場合のみ実行)
    if (sectionType === 'speaking' && audioBlobToUpload && audioAnswerKey && user && attemptData?.id && questionsForCurrentForm.find(q => q.id === audioAnswerKey)) {
      const questionId = audioAnswerKey;
      const storage = getStorage(undefined, "gs://toremock.firebasestorage.app");
      
      const fileExtension = '.mp3'; // mic-recorder-to-mp3 はMP3を生成する
      const filePath = `speaking_answers/${user.uid}/${attemptData.id}/${questionId}${fileExtension}`;
      const storageRef = ref(storage, filePath);

      try {
        console.log(`[Page] Uploading audio to: ${filePath}`);
        const uploadTask = await uploadBytesResumable(storageRef, audioBlobToUpload);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        
        finalSectionData.audioStorageUrl = downloadURL;
        if (finalSectionData.answers && finalSectionData.answers[audioAnswerKey] === 'audio_pending_upload') {
            finalSectionData.answers[audioAnswerKey] = downloadURL;
        }
        console.log('[Page] Audio uploaded successfully. URL:', downloadURL);

        try {
          console.log(`[Page] Calling transcribe API with URL: ${downloadURL}`);
          const transcribeResponse = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioUrl: downloadURL }),
          });

          if (!transcribeResponse.ok) {
            const errorData = await transcribeResponse.json().catch(() => ({ error: 'Failed to parse error response from transcribe API' }));
            console.error('[Page] Error from transcribe API:', transcribeResponse.status, errorData);
            finalSectionData.transcribedText = 'transcription_failed';
            finalSectionData.transcriptionError = errorData.error || `API Error: ${transcribeResponse.status}`;
          } else {
            const { transcription } = await transcribeResponse.json();
            console.log('[Page] Transcription received:', transcription);
            finalSectionData.transcribedText = transcription;
            delete finalSectionData.transcriptionError;
          }
        } catch (transcribeError) {
          console.error('[Page] Error calling transcribe API:', transcribeError);
          finalSectionData.transcribedText = 'transcription_error';
          finalSectionData.transcriptionError = transcribeError instanceof Error ? transcribeError.message : String(transcribeError);
        }
      } catch (error) {
        console.error("[Page] Error uploading audio to Firebase Storage:", error);
        if (finalSectionData.answers && finalSectionData.answers[audioAnswerKey]) {
            finalSectionData.answers[audioAnswerKey] = 'audio_upload_failed';
        }
        // ここで finalSectionData.transcriptionError などにも情報を記録できる
      }
    }

    // SpeakingセクションのAI採点 (文字起こし成功後、かつ audioAnswerKey が存在する場合)
    if (sectionType === 'speaking' && 
        finalSectionData.transcribedText && 
        finalSectionData.transcribedText !== 'transcription_failed' && 
        finalSectionData.transcribedText !== 'transcription_error' &&
        audioAnswerKey // audioAnswerKey が音声処理ブロックから引き継がれている必要がある
       ) {
      try {
        const currentQuestion = questionsForCurrentForm.find(q => q.id === audioAnswerKey);
        const speakingTaskPrompt = currentQuestion?.content;
        const modelAnswerForSpeaking = currentQuestion?.modelAnswer;
        const questionContextForSpeaking = currentQuestion?.questionContext;

        if (!speakingTaskPrompt) {
            console.warn(`[Page] Speaking task prompt not found for question ID: ${audioAnswerKey}. Proceeding with general evaluation.`);
        }

        console.log(`[Page] Calling grade-speaking API for section: ${sectionTitle}, Question ID: ${audioAnswerKey}`);
        const gradeResponse = await fetch('/api/grade-speaking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcribedText: finalSectionData.transcribedText,
            speakingPrompt: speakingTaskPrompt || '', 
            modelAnswer: modelAnswerForSpeaking || '',
            questionContext: questionContextForSpeaking || '',
          }),
        });

        if (!gradeResponse.ok) {
          const errorData = await gradeResponse.json().catch(() => ({ error: "Failed to parse error response from grade-speaking API" }));
          console.error('[Page] Error from grade-speaking API:', gradeResponse.status, errorData);
          finalSectionData.feedback = `Automated speaking scoring failed. API Error: ${gradeResponse.status} - ${errorData.error || 'Unknown error'}`;
          // score は設定しないか、エラーを示す値を設定
        } else {
          const gradingResult = await gradeResponse.json();
          console.log('[Page] Speaking grading received:', gradingResult);
          finalSectionData.score = gradingResult.score;
          finalSectionData.feedback = gradingResult.feedback;
          finalSectionData.positive_points = gradingResult.positive_points;
          finalSectionData.areas_for_improvement = gradingResult.areas_for_improvement;
          finalSectionData.revisedTranscribedText = gradingResult.revised_transcription;
        }
      } catch (gradeError) {
        console.error('[Page] Error calling grade-speaking API:', gradeError);
        finalSectionData.feedback = `Automated speaking scoring failed: ${gradeError instanceof Error ? gradeError.message : String(gradeError)}`;
      }
    }

    // 4. スコアリングとフィードバック
    const questionsForThisSection = questions[sectionTitle]?.sort((a: Question, b: Question) => a.order - b.order) || [];

    if (sectionType === 'writing' && questionsForThisSection.length > 0) {
      const writingQuestion = questionsForThisSection[0];
      // finalSectionData.answers から解答を取得しようとします
      const userAnswer = finalSectionData.answers?.[writingQuestion.id] as string; 
      const prompt = writingQuestion.content;
      const modelAnswerForWriting = writingQuestion.modelAnswer;
      const questionContextForWriting = writingQuestion.questionContext;

      // === デバッグログ追加 START ===
      console.log(`[Page DEBUG] Attempting to grade writing for section: ${sectionTitle}, Question ID: ${writingQuestion?.id}`);
      console.log(`[Page DEBUG] Extracted prompt:`, prompt);
      console.log(`[Page DEBUG] finalSectionData.answers object:`, JSON.stringify(finalSectionData.answers, null, 2));
      console.log(`[Page DEBUG] Raw value from finalSectionData.answers['${writingQuestion?.id}']:`, finalSectionData.answers?.[writingQuestion?.id]);
      console.log(`[Page DEBUG] userAnswer variable (type: ${typeof userAnswer}, value): '${userAnswer}'`);
      // === デバッグログ追加 END ===

      if (userAnswer && userAnswer.trim().length > 0) {
        try {
          console.log(`[Page] Calling /api/grade-writing with essay length: ${userAnswer.length} (prompt ${prompt ? "provided" : "missing"})`);
          const response = await fetch('/api/grade-writing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              essay: userAnswer, 
              prompt, 
              modelAnswer: modelAnswerForWriting || '',
              questionContext: questionContextForWriting || ''
            }),
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({error: "Failed to parse error response from grade-writing API"}));
            // APIからのエラーメッセージをより詳細にログ出力
            console.error(`[Page] Error response from /api/grade-writing: Status ${response.status}`, errorData);
            throw new Error(errorData.error || `Failed to grade writing: ${response.statusText}`);
          }
          const gradingResult = await response.json();
          finalSectionData.score = gradingResult.score;
          finalSectionData.feedback = gradingResult.feedback;
          finalSectionData.positive_points = gradingResult.positive_points;
          finalSectionData.areas_for_improvement = gradingResult.areas_for_improvement;
          finalSectionData.revisedEssay = gradingResult.revised_essay;
          console.log('[Page] Writing grading received successfully:', gradingResult);
        } catch (err) {
          console.error("[Page] Error during AI grading (inside try/catch):", err);
          finalSectionData.feedback = `AI grading failed: ${err instanceof Error ? err.message : String(err)}`;
          // エラー発生時はスコアや他のフィードバック項目をリセットまたはエラーを示す値にすることも検討
          finalSectionData.score = undefined; // または 0 や null
          finalSectionData.positive_points = [];
          finalSectionData.areas_for_improvement = ["An error occurred during automated grading."];
        }
      } else {
        // このブロックは、userAnswer がない、または空の場合に実行されます
        console.error(`[Page] AI Grading SKIPPED for writing. Answer was empty, undefined, or whitespace. Question ID: ${writingQuestion?.id}, userAnswer: '${userAnswer}'`);
        finalSectionData.score = 0; // または undefined/null
        finalSectionData.feedback = "AI grading skipped: Your answer was not provided or was empty.";
        finalSectionData.positive_points = [];
        finalSectionData.areas_for_improvement = ["Please provide a response to be graded."];
      }
    } else if (sectionType === 'reading' || sectionType === 'listening') {
      let correctCount = 0;
      let totalScoreable = 0;
      questionsForThisSection.forEach((q: Question) => {
        if (q.correctAnswer !== undefined && q.questionType === 'multiple-choice' && finalSectionData.answers?.[q.id] !== undefined) {
          totalScoreable++;
          if (finalSectionData.answers[q.id] === q.correctAnswer) {
            correctCount++;
          }
        }
      });
      if (totalScoreable > 0) {
        finalSectionData.score = Math.round((correctCount / totalScoreable) * 100);
      }
    }

    // 5. セクションデータのFirestoreへの書き込みとローカルステートの更新
    try {
      console.log(`[Page DEBUG] Preparing to update sections field in ExamAttempt. Attempt ID: '${attemptData?.id}', Section Title: '${sectionTitle}'`);
      if (!attemptData?.id || !sectionTitle) {
        console.error("[Page CRITICAL DEBUG] Aborting section update due to missing attemptId or sectionTitle!", { attemptId: attemptData?.id, sectionTitle });
        setError("致命的なエラー: 受験IDまたはセクションタイトルが見つかりません。");
        setIsSubmitting(false);
        return;
      }

      // 更新するセクションの完全なデータを作成
      // finalSectionData には title や type が含まれていない可能性があるため、ここで明示的に設定
      const completeSectionDataForUpdate: SectionAttempt = {
        ...finalSectionData, // これには answers, status, completedAt, audioStorageUrl, transcribedText などが含まれる
        title: sectionTitle,
        type: sectionType,
        status: 'completed', // status を明示的に指定
        // score や feedback なども finalSectionData から引き継がれる
      };

      // 親ドキュメントの sections フィールドを更新
      const updatePayload: any = {
        [`sections.${sectionTitle}`]: completeSectionDataForUpdate,
        updatedAt: serverTimestamp() as Timestamp,
      };

      const nextActualIndex = currentStructureIndex + 1;
      updatePayload.currentStructureIndex = nextActualIndex;

      if (nextActualIndex >= examDefinition.structure.length) {
        updatePayload.status = 'completed';
        updatePayload.completedAt = serverTimestamp() as Timestamp;

        // 試験完了時にスコアを計算して保存
        const sectionOrder: SectionType[] = ['reading', 'listening', 'speaking', 'writing'];
        const partScores: { [key in SectionType]?: number } = {};
        let totalCalculatedScore = 0;
        
        // 更新されたセクションデータを含む可能性のある attemptData.sections を使用
        const sectionsForScoring = {
          ...attemptData.sections,
          [sectionTitle]: completeSectionDataForUpdate // 現在処理中のセクションの最新データ
        };

        sectionOrder.forEach(partType => {
          const sectionsForPart = Object.values(sectionsForScoring)
            .filter(section => section.type === partType && section.score !== undefined);

          if (sectionsForPart.length > 0) {
            const averageScore = sectionsForPart.reduce((sum, section) => sum + (section.score || 0), 0) / sectionsForPart.length;
            const partScore = Math.round(averageScore * 0.3); // 100点満点を30点満点に換算し四捨五入
            partScores[partType] = partScore;
            totalCalculatedScore += partScore;
          } else {
            partScores[partType] = 0; // スコアがない場合は0点として扱う
          }
        });

        updatePayload.readingScore = partScores['reading'] || 0;
        updatePayload.listeningScore = partScores['listening'] || 0;
        updatePayload.speakingScore = partScores['speaking'] || 0;
        updatePayload.writingScore = partScores['writing'] || 0;
        updatePayload.totalScore = totalCalculatedScore;
      }

      console.log(`[Page DEBUG] Attempting to update ExamAttempt ${attemptDocRef.path} with payload:`, JSON.stringify(updatePayload, null, 2));
      await updateDoc(attemptDocRef, updatePayload);
      console.log('[Page DEBUG] ExamAttempt sections field and other top-level data updated successfully.');

      // ローカルステートの更新
      setAttemptData(prev => {
        if (!prev) return null;
        const updatedSections = {
          ...prev.sections,
          [sectionTitle]: {
            ...(prev.sections?.[sectionTitle] || {}), // 既存のデータを念のためマージ
            ...completeSectionDataForUpdate, // 更新されたデータで上書き
            // completedAt は serverTimestamp() で設定されるため、ローカルでは Timestamp.now() を使うか、
            // Firestore から読み直した値を使うのが理想だが、一旦は completeSectionDataForUpdate の値を使用
            completedAt: completeSectionDataForUpdate.completedAt || Timestamp.now() 
          } as SectionAttempt
        };

        return {
          ...prev,
          sections: updatedSections,
          currentStructureIndex: nextActualIndex,
          status: updatePayload.status || prev.status,
          completedAt: updatePayload.completedAt || prev.completedAt,
          // 試験完了時に計算したスコアもローカルステートに反映
          readingScore: updatePayload.readingScore !== undefined ? updatePayload.readingScore : prev.readingScore,
          listeningScore: updatePayload.listeningScore !== undefined ? updatePayload.listeningScore : prev.listeningScore,
          speakingScore: updatePayload.speakingScore !== undefined ? updatePayload.speakingScore : prev.speakingScore,
          writingScore: updatePayload.writingScore !== undefined ? updatePayload.writingScore : prev.writingScore,
          totalScore: updatePayload.totalScore !== undefined ? updatePayload.totalScore : prev.totalScore,
          updatedAt: Timestamp.now() // ローカルの updatedAt も更新
        };
      });
      console.log('[Page DEBUG] Local attemptData state updated.');

      // 次のセクションへの移動または結果ページへのリダイレクト
      if (nextActualIndex < examDefinition.structure.length) {
        setCurrentStructureIndex(nextActualIndex);
        const newCurrentSection = examDefinition.structure[nextActualIndex];
        setCurrentSection(newCurrentSection);
        if (newCurrentSection.duration) setTimeLeftInSection(newCurrentSection.duration);
        const newNextSectionTitle = nextActualIndex + 1 < examDefinition.structure.length ? examDefinition.structure[nextActualIndex + 1]?.title : null;
        setNextSectionTitle(newNextSectionTitle);
      } else {
        if (examDefinition.id && attemptData.id) {
          console.log(`[Page] Exam completed. Redirecting to results page: /exams/${examDefinition.id}/result?attemptId=${attemptData.id}`);
          router.push(`/exams/${examDefinition.id}/result?attemptId=${attemptData.id}`);
        } else {
          console.error("[Page] Cannot redirect, exam or attempt ID missing after completion.");
          setError("試験結果へのリダイレクトに失敗しました。");
        }
      }

    } catch (error) {
      console.error(`[Page] Error in section data update operations:`, error);
      if (error instanceof FirebaseError) {
        setError(`Firestoreエラー: ${error.message} (コード: ${error.code})`);
      } else {
        setError(`セクションデータの更新中にエラーが発生しました: ${String(error)}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [user, examDefinition, currentSection, questions, attemptData, currentStructureIndex, updateAttemptInFirestore, router, isSubmitting, questionsForCurrentForm]); // questionsForCurrentForm を依存配列に追加
  // console.log('%c[ExamPage] After useCallback handleSectionSubmit', 'color: magenta;');
  

  // console.log('%c[ExamPage] Before useEffect [attemptData?.status] for unloads', 'color: orange;');
  useEffect(() => {
    console.log('[ExamPage] useEffect for UNLOAD HANDLERS TRIGGERED. Deps:', { attemptDataStatus: attemptData?.status });
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
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
  // console.log('%c[ExamPage] After useEffect [attemptData?.status] for unloads', 'color: orange;');

  // console.log('%c[ExamPage] Before useEffect [attemptData?.status] for navigation', 'color: orange;');
  useEffect(() => {
    console.log('[ExamPage] useEffect for NAVIGATION CONFIRMATION TRIGGERED. Deps:', { attemptDataStatus: attemptData?.status });
    if (attemptData?.status === 'completed') return;
    const confirmMessage = '試験を中断してページを移動しますか？\n解答状況は保存されません。';
    const handleAnchorClick = (event: MouseEvent) => {
      const targetElement = event.target as Element;
      const anchor = targetElement.closest('a');
      if (anchor && anchor.href && !anchor.href.startsWith('#') && anchor.target !== '_blank') {
        const targetUrl = new URL(anchor.href, window.location.origin);
        if (targetUrl.origin === window.location.origin) {
          if (!window.confirm(confirmMessage)) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
    };
    const handleBeforePopState = () => {
      if (attemptData?.status !== 'completed') {
        if (!window.confirm(confirmMessage)) {
          window.history.pushState(null, '', window.location.href);
          return false;
        }
      }
      return true;
    };
    window.addEventListener('beforepopstate', handleBeforePopState);
    document.addEventListener('click', handleAnchorClick, true);
    return () => {
      document.removeEventListener('click', handleAnchorClick, true);
      window.removeEventListener('beforepopstate', handleBeforePopState);
    };
  }, [attemptData?.status]);
  // console.log('%c[ExamPage] After useEffect [attemptData?.status] for navigation', 'color: orange;');

  // console.log('%c[ExamPage] Before useEffect [user.uid, params.id, ...] for fetchData', 'color: orange;');
  useEffect(() => {
    console.log('[ExamPage] useEffect for FETCH DATA TRIGGERED. Deps:', { userId: user?.uid, paramsId: params.id, attemptIdFromQuery, authLoading });
    const fetchData = async () => {
      // console.log('%c[ExamPage] fetchData - START', 'color: green;');
      if (!user || !params.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const examDef = await getExam(params.id); 
        if (!examDef || !examDef.structure) {
          throw new Error('模試の構成情報が見つかりません。');
        }
        setExamDefinition(examDef);

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
        setQuestions(questionsBySection);

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
          const existingAttemptDoc = inProgressSnapshot.docs[0];
          const existingAttemptData = { id: existingAttemptDoc.id, ...existingAttemptDoc.data() } as ExamAttempt;
          setAttemptId(existingAttemptDoc.id);
          setAttemptData(existingAttemptData);
          setCurrentStructureIndex(existingAttemptData.currentStructureIndex || 0);
          // console.log('進行中の受験記録を再開:', existingAttemptDoc.id);
        } else {
          // console.log('新しい受験記録を作成します。');
          // examDefがnullでないことは上で確認済み
          const initialSections: Record<string, SectionAttempt> = {};
          examDef.structure.forEach((section: ExamSection) => { 
            initialSections[section.title] = { 
              title: section.title, // title を追加
              type: section.type,   // type を追加
              status: 'pending' 
            };
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
          // console.log('新規受験記録を作成しました:', docRef.id);
        }

      } catch (err: any) {
        console.error('試験初期化エラー:', err);
        setError(err.message || '試験の準備中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };
    if (user && params.id) {
      fetchData();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user?.uid, params.id, attemptIdFromQuery, router, authLoading]);
  // console.log('%c[ExamPage] After useEffect [user, params.id, ...] for fetchData', 'color: orange;');

  // console.log('%c[ExamPage] Before useEffect [currentStructureIndex, examDefinition, ...] for section setup', 'color: orange;');
  useEffect(() => {
    console.log('[ExamPage] useEffect for SECTION SETUP TRIGGERED. Deps:', { currentStructureIndex, examDefinitionExists: !!examDefinition, attemptDataExists: !!attemptData });
    if (examDefinition && attemptData) {
      if (currentStructureIndex < examDefinition.structure.length) {
        const section = examDefinition.structure[currentStructureIndex];
        setCurrentSection(section);
        if (section?.duration) {
          setTimeLeftInSection(section.duration);
        }
        const nextTitle = currentStructureIndex + 1 < examDefinition.structure.length ? examDefinition.structure[currentStructureIndex + 1]?.title : null;
        setNextSectionTitle(nextTitle);
        setIsLoading(false);
      } else if (attemptData.status === 'completed'){
        setIsLoading(false);
        if (params.id && attemptData.id) {
          router.push(`/exams/${params.id}/result?attemptId=${attemptData.id}`);
        } else {
          console.error("Cannot redirect to results: params.id or attemptData.id is null");
          setError("結果ページへのリダイレクトに失敗しました。");
        }
      } else {
        setIsLoading(false);
        setError("試験の進行状態が無効です。");
      }
    }
  }, [currentStructureIndex, examDefinition, attemptData, router, params.id]);
  // console.log('%c[ExamPage] After useEffect [currentStructureIndex, examDefinition, ...] for section setup', 'color: orange;');

  // console.log('%c[ExamPage] Before Loading/Error/User checks', 'color: blue;', { authLoading, isLoading, user, error });
  if (authLoading || isLoading) {
    // console.log('%c[ExamPage] Render: LoadingSpinner (authLoading or isLoading is true)', 'color: red;');
    return <div className="flex justify-center items-center min-h-screen bg-gray-50"><LoadingSpinner /></div>;
  }
  if (!user) {
    // console.log('%c[ExamPage] Render: Login Required (user is null)', 'color: red;');
    return <div className="container mx-auto px-4 py-8"><p>ログインが必要です。</p></div>;
  }
  if (error) {
    // console.log('%c[ExamPage] Render: Error Display', 'color: red;', { error });
    return <div className="container mx-auto px-4 py-8"><div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div></div>;
  }
  if (!examDefinition) {
    // console.log('%c[ExamPage] Render: Exam Definition Missing', 'color: red;');
    return <div className="container mx-auto px-4 py-8"><div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">模試データを読み込んでいます...</div></div>;
  }
  const examTypeLabel = examDefinition ? {
    'TOEIC': 'TOEIC® TEST',
    'TOEFL': 'TOEFL iBT® TEST',
    'EIKEN': '英検®'
  }[examDefinition.type || 'TOEIC'] || '模試' : '模試';
  // console.log('%c[ExamPage] after examTypeLabel definition', 'color: magenta;', { examTypeLabel });

  if (!currentSection) {
    // console.log('%c[ExamPage] Render: Current Section Missing - Initializing section...', 'color: red;');
    return <div className="flex justify-center items-center h-screen">Initializing section...</div>;
  }
  // console.log('%c[ExamPage] Passed all pre-render checks. currentSection available.', 'color: blue;', { currentSection });

  const sectionRenderType = currentSection.type;
  const hasQuestions = questionsForCurrentForm.length > 0;
  // console.log('%c[ExamPage] Before main render logic (screenToRender selection)', 'color: blue;', { sectionRenderType, hasQuestions });
  
  let screenToRender = null;
  if (sectionRenderType === 'instructions') {
    // console.log('%c[ExamPage] Render Logic: Matched instructions', 'color: green;');
    screenToRender = <InstructionsScreen 
          title={currentSection.title}
          instructions={currentSection.instructions}
          duration={currentSection.duration} 
          onNext={handleNext}
    />;
  } else if (sectionRenderType === 'break') {
    // console.log('%c[ExamPage] Render Logic: Matched break', 'color: green;');
    screenToRender = <BreakScreen 
          title={currentSection.title} 
          duration={currentSection.duration || 300} 
          onNext={handleNext}
    />;
  } else if (sectionRenderType === 'speaking' && !hasQuestions && currentSection.isImageDisplayOnly && currentSection.imageUrl) {
    // console.log('%c[ExamPage] Render Logic: Matched speaking image display', 'color: green;');
    screenToRender = <ImageDisplayScreen 
          title={currentSection.title}
          imageUrl={currentSection.imageUrl}
          onNext={handleNext}
          duration={currentSection.duration}
    />;
  } else if (sectionRenderType === 'speaking' && !hasQuestions && currentSection.isAudioPlaybackOnly && currentSection.audioUrl) {
    // console.log('%c[ExamPage] Render Logic: Matched speaking audio display', 'color: green;');
    screenToRender = <AudioPlaybackScreen 
          title={currentSection.title}
          audioUrl={currentSection.audioUrl}
          duration={currentSection.duration}
          onNext={handleNext}
    />;
  } else if (sectionRenderType === 'speaking' && !hasQuestions && !(currentSection.isImageDisplayOnly && currentSection.imageUrl) && !(currentSection.isAudioPlaybackOnly && currentSection.audioUrl)) {
    // console.log('%c[ExamPage] Render Logic: Matched speaking prep (instructions)', 'color: green;');
    screenToRender = <InstructionsScreen 
          title={currentSection.title}
          instructions={currentSection.instructions}
          duration={currentSection.duration} 
          onNext={handleNext} 
    />;
  } else if (sectionRenderType === 'speaking' && hasQuestions) {
    // console.log('%c[ExamPage] Render Logic: Matched speaking ExamForm', 'color: green;');
    screenToRender = <ExamForm
          examId={params.id}
          sectionInfo={currentSection}
          questions={questionsForCurrentForm}
          initialAttemptData={attemptData?.sections[currentSection.title]}
          onSubmit={handleSectionSubmit}
          examType={examDefinition.type} 
    />;
  } else if (sectionRenderType === 'reading' || sectionRenderType === 'listening' || sectionRenderType === 'writing') {
    // console.log('%c[ExamPage] Render Logic: Matched R/L/W block', 'color: orange;');
    if (!hasQuestions && currentSection.isImageDisplayOnly && currentSection.imageUrl) {
      // console.log('%c[ExamPage] Render Logic: R/L/W ImageDisplay', 'color: green;');
      screenToRender = <ImageDisplayScreen 
              title={currentSection.title}
              imageUrl={currentSection.imageUrl}
              onNext={handleNext}
              duration={currentSection.duration}
      />;
    } else if (!hasQuestions && currentSection.isAudioPlaybackOnly && currentSection.audioUrl) {
      // console.log('%c[ExamPage] Render Logic: R/L/W AudioDisplay', 'color: green;');
      screenToRender = <AudioPlaybackScreen 
              title={currentSection.title}
              audioUrl={currentSection.audioUrl}
              duration={currentSection.duration}
              onNext={handleNext}
      />;
    } else if (hasQuestions) {
      // console.log('%c[ExamPage] Render Logic: R/L/W ExamForm', 'color: green;');
      screenToRender = <ExamForm
              examId={params.id}
              sectionInfo={currentSection}
              questions={questionsForCurrentForm}
              initialAttemptData={attemptData?.sections[currentSection.title]}
              onSubmit={handleSectionSubmit}
              examType={examDefinition.type} 
      />;
    } else if (!hasQuestions && !(currentSection.isImageDisplayOnly && currentSection.imageUrl) && !(currentSection.isAudioPlaybackOnly && currentSection.audioUrl) && currentSection.instructions) {
      // console.log('%c[ExamPage] Render Logic: R/L/W Instructions', 'color: green;');
      screenToRender = <InstructionsScreen
              title={currentSection.title}
              instructions={currentSection.instructions}
              duration={currentSection.duration}
              onNext={handleNext}
      />;
    } else {
      // console.log('%c[ExamPage] Render Logic: R/L/W Fallback (No match inside block)', 'color: red;');
      screenToRender = <div>Error: Could not determine screen for R/L/W section.</div>;
    }
  } else {
    // console.log('%c[ExamPage] Render Logic: Fallback (No top-level match)', 'color: red;', { sectionRenderType });
    screenToRender = <div>Loading section or unknown section type... ({sectionRenderType})</div>;
  }

  // console.log('%c[ExamPage] Final screenToRender:', 'color: blue; font-weight: bold;', screenToRender);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {screenToRender}
    </div>
  );
}