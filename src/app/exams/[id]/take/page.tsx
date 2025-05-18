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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
    // console.log('%c[ExamPage] useCallback handleSectionSubmit - CALLED', 'color: darkcyan;', { submittedAnswers });
    if (!user || !examDefinition || !currentSection || !attemptData || !attemptData.id || isSubmitting) {
      // console.warn('[Page] handleSectionSubmit called with invalid state');
      return;
    }
    // console.log(`[Page] handleSectionSubmit for section: ${currentSection.title}`, submittedAnswers);
    setIsSubmitting(true);

    const attemptDocRef = doc(db, 'exam_attempts', attemptData.id);
    const sectionTitle = currentSection.title;
    const sectionType = currentSection.type;

    const newSectionAttemptData: Partial<SectionAttempt> = {
      status: 'completed',
      completedAt: serverTimestamp() as Timestamp,
    };

    let audioBlobToUpload: Blob | null = null;
    let audioAnswerKey: string | null = null;

    // Firestoreに保存する解答データを準備
    const answersToSaveInFirestore: Record<string, string | number> = {};

    for (const key in submittedAnswers) {
      const answer = submittedAnswers[key];
      if (answer instanceof Blob) {
        audioBlobToUpload = answer;
        audioAnswerKey = key;
        // 初期状態では 'audio_pending_upload' としておく
        answersToSaveInFirestore[key] = 'audio_pending_upload'; 
      } else {
        answersToSaveInFirestore[key] = answer;
      }
    }

    // audioBlobToUpload があれば、Firebase Storage にアップロード
    if (audioBlobToUpload && audioAnswerKey && user && attemptData?.id && questionsForCurrentForm.find(q => q.id === audioAnswerKey)) {
      const questionId = audioAnswerKey; // 明確化のため
      const storage = getStorage(undefined, "gs://toremock.firebasestorage.app"); 
      const filePath = `speaking_answers/${user.uid}/${attemptData.id}/${questionId}.webm`;
      const storageRef = ref(storage, filePath);

      try {
        console.log(`[Page] Uploading audio to: ${filePath}`);
        const uploadTask = await uploadBytesResumable(storageRef, audioBlobToUpload);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        answersToSaveInFirestore[audioAnswerKey] = downloadURL; // アップロード成功後、URLで上書き
        console.log('[Page] Audio uploaded successfully. URL:', downloadURL);

        // 対象となるセクションのドキュメント参照
        const currentSectionAttemptRef = doc(db, 'exam_attempts', attemptData.id, 'sections', sectionTitle);

        // Firestoreに保存する最終的なデータを作成
        const dataToSave: Partial<SectionAttempt> = {
          status: 'completed',
          answers: answersToSaveInFirestore, // 従来の解答（もしあれば）
          completedAt: serverTimestamp(),
          audioStorageUrl: downloadURL, // audioStorageUrl をここに追加
        };

        // console.log(`[Page] Saving to Firestore. Path: ${sectionTitle}, Data:`, dataToSave); // パス表示を修正するなら sectionAttemptRef.path
        console.log(`[Page] Saving to Firestore. Path: ${currentSectionAttemptRef.path}, Data:`, dataToSave);
        await updateDoc(currentSectionAttemptRef, dataToSave); // 修正: currentSectionAttemptRef を使用
        console.log('[Page] Firestore updated with audio URL.');

        // 文字起こしAPIを呼び出す
        try {
          console.log(`[Page] Calling transcribe API with URL: ${downloadURL}`);
          const transcribeResponse = await fetch('/api/transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ audioUrl: downloadURL }),
          });

          if (!transcribeResponse.ok) {
            const errorData = await transcribeResponse.json().catch(() => ({ error: 'Failed to parse error response from transcribe API' }));
            console.error('[Page] Error from transcribe API:', transcribeResponse.status, errorData);
            await updateDoc(currentSectionAttemptRef, { // ★ 修正
              transcribedText: 'transcription_failed',
              transcriptionError: errorData.error || `API Error: ${transcribeResponse.status}`
            });
          } else {
            const { transcription } = await transcribeResponse.json();
            console.log('[Page] Transcription received:', transcription);
            await updateDoc(currentSectionAttemptRef, { // ★ 修正
              transcribedText: transcription,
              transcriptionError: null,
            });
            console.log('[Page] Firestore updated with transcription.');
          }
        } catch (transcribeError) {
          console.error('[Page] Error calling transcribe API:', transcribeError);
          await updateDoc(currentSectionAttemptRef, { // ★ 修正
            transcribedText: 'transcription_error',
            transcriptionError: transcribeError instanceof Error ? transcribeError.message : String(transcribeError)
          });
        }

      } catch (error) {
        console.error("[Page] Error uploading audio to Firebase Storage:", error);
        answersToSaveInFirestore[audioAnswerKey] = 'audio_upload_failed'; // エラー情報を記録
        // 必要であれば、ここでユーザーにエラー通知を行うか、エラーをsetErrorで状態管理することも検討
      }
    } else {
      // 音声ファイルがない場合は、通常通りFirestoreに解答を保存
      const dataToSave: Partial<SectionAttempt> = {
        status: 'completed',
        answers: answersToSaveInFirestore,
        completedAt: serverTimestamp(),
      };
      console.log(`[Page] Saving to Firestore (no audio). Path: ${sectionTitle}, Data:`, dataToSave);
      await updateDoc(doc(db, 'exam_attempts', attemptData.id, 'sections', sectionTitle), dataToSave);
      console.log('[Page] Firestore updated (no audio).');
    }
    
    newSectionAttemptData.answers = answersToSaveInFirestore; // 更新された解答データを使用

    const questionsForThisSection = questions[sectionTitle]?.sort((a: Question, b: Question) => a.order - b.order) || [];

    if (sectionType === 'writing' && questionsForThisSection.length > 0) {
      const writingQuestion = questionsForThisSection[0];
      const userAnswer = answersToSaveInFirestore[writingQuestion.id] as string;
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
          // console.error("[Page] Error during AI grading:", err);
          // setError(err instanceof Error ? err.message : 'Unknown error during AI grading'); // UIにエラー表示すると邪魔になる場合も
          newSectionAttemptData.feedback = "Error during AI grading."; // Attempt の方に記録
        }
      } else {
        // console.log("[Page] Writing answer empty, skipping grading.");
      }
    } else if (sectionType === 'reading' || sectionType === 'listening') {
      let correctCount = 0;
      let totalScoreable = 0;
      questionsForThisSection.forEach((q: Question) => {
        if (q.correctAnswer !== undefined && q.questionType === 'multiple-choice' && answersToSaveInFirestore[q.id] !== undefined) {
          totalScoreable++;
          if (answersToSaveInFirestore[q.id] === q.correctAnswer) {
            correctCount++;
          }
        }
      });
      if (totalScoreable > 0) {
        newSectionAttemptData.score = Math.round((correctCount / totalScoreable) * 100);
      }
      // console.log(`[Page] Score for ${sectionType} ${sectionTitle}: ${newSectionAttemptData.score}`);
    }

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
              completedAt: Timestamp.now() // serverTimestampの代わりにクライアント時刻（近似）
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
        if (examDefinition.id && attemptData.id) {
        router.push(`/exams/${examDefinition.id}/result?attemptId=${attemptData.id}`);
        } else {
          console.error("Cannot redirect, exam or attempt ID missing after completion.");
          setError("試験結果へのリダイレクトに失敗しました。");
        }
      }
    } catch (err) {
      console.error("[Page] Error submitting section to Firestore:", err);
      setError(err instanceof Error ? err.message : 'Unknown error submitting section');
    } finally {
      setIsSubmitting(false);
    }
  }, [user, examDefinition, currentSection, attemptData, questions, router, isSubmitting, updateAttemptInFirestore, questionsForCurrentForm]);
  // console.log('%c[ExamPage] After useCallback handleSectionSubmit', 'color: magenta;');
  

  // console.log('%c[ExamPage] Before useEffect [attemptData?.status] for unloads', 'color: orange;');
  useEffect(() => {
    // console.log('%c[ExamPage] useEffect [attemptData?.status] for unloads - START', 'color: orange;', { attemptDataStatus: attemptData?.status });
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (attemptData?.status !== 'completed') {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      // console.log('%c[ExamPage] useEffect [attemptData?.status] for unloads - CLEANUP', 'color: orange;');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [attemptData?.status]);
  // console.log('%c[ExamPage] After useEffect [attemptData?.status] for unloads', 'color: orange;');

  // console.log('%c[ExamPage] Before useEffect [attemptData?.status] for navigation', 'color: orange;');
  useEffect(() => {
    // console.log('%c[ExamPage] useEffect [attemptData?.status] for navigation - START', 'color: orange;', { attemptDataStatus: attemptData?.status });
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
      // console.log('%c[ExamPage] useEffect [attemptData?.status] for navigation - CLEANUP', 'color: orange;');
      document.removeEventListener('click', handleAnchorClick, true);
      window.removeEventListener('beforepopstate', handleBeforePopState);
    };
  }, [attemptData?.status]);
  // console.log('%c[ExamPage] After useEffect [attemptData?.status] for navigation', 'color: orange;');

  // console.log('%c[ExamPage] Before useEffect [user.uid, params.id, ...] for fetchData', 'color: orange;');
  useEffect(() => {
    console.log('%c[ExamPage] useEffect for fetchData TRIGGERED', 'color: red; font-weight: bold;', { userId: user?.uid, paramsId: params.id, attemptIdFromQuery, authLoading });
    // console.log('%c[ExamPage] useEffect [user.uid, params.id, ...] for fetchData - START', 'color: orange;', { userId: user?.uid, paramsId: params.id, attemptIdFromQuery, authLoading });
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
    console.log('%c[ExamPage] useEffect for section setup TRIGGERED', 'color: red; font-weight: bold;', { currentStructureIndex, examDefinition, attemptData });
    // console.log('%c[ExamPage] useEffect [currentStructureIndex, examDefinition, ...] for section setup - START', 'color: orange;', { currentStructureIndex, examDefinition, attemptData });
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