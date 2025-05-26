'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import { Question, ExamSection, SectionAttempt } from '@/app/lib/firestoreTypes';
import useRecorder, { RecorderStatus, UseRecorderReturnType } from '@/app/hooks/useRecorder';

interface ExamFormProps {
  examId: string;
  sectionInfo: ExamSection;
  questions: Question[];
  initialAttemptData?: SectionAttempt;
  onSubmit: (answers: Record<string, number | string | Blob>) => void;
  examType: string;
}

export default React.memo(function ExamForm({ 
  examId, 
  sectionInfo, 
  questions, 
  initialAttemptData, 
  onSubmit, 
  examType
}: ExamFormProps) {
  // console.log('[ExamForm] Props received:', { examId, sectionInfo, questions, examType });
  const router = useRouter();
  const { user } = useAuth();
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number | string | Blob>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  console.log('[ExamForm] Initializing. Section type:', sectionInfo.type);
  const recorder: UseRecorderReturnType = useRecorder();
  const [isRecordingTimeUp, setIsRecordingTimeUp] = useState(false);

  // console.log('[ExamForm] Determining questionType. questions:', questions, 'sectionInfo.type:', sectionInfo.type);
  const questionType = questions && questions.length > 0 && questions[0]?.questionType 
                     ? questions[0].questionType 
                     : sectionInfo.type === 'speaking' 
                     ? 'speaking' 
                     : 'multiple-choice';
  // console.log('[ExamForm] questionType determined:', questionType);

  useEffect(() => {
    console.log(`%c[ExamForm] MOUNTED - ${sectionInfo.title} - ${new Date().toLocaleTimeString()}`, 'color: green; font-weight: bold;');
    return () => {
      console.log(`%c[ExamForm] UNMOUNTING - ${sectionInfo.title} - ${new Date().toLocaleTimeString()}`, 'color: red; font-weight: bold;');
    };
  }, [sectionInfo.title]); // sectionInfo.title が変わることは稀なので、ほぼマウント・アンマウント時に対応

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setCurrentAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleTextInputChange = (questionId: string, text: string) => {
    setCurrentAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleNext = () => {
    // console.log('[ExamForm handleNext] Start. currentQuestionIndex:', currentQuestionIndex, 'questions.length:', questions.length);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentQuestionIndex < questions.length - 1) {
      // console.log('[ExamForm handleNext] Incrementing index from:', prev);
      setCurrentQuestionIndex(prev => {
        return prev + 1;
      });
    } else {
      // console.log('[ExamForm handleNext] Else block. currentQuestionIndex:', currentQuestionIndex);
      if (questionType !== 'speaking') {
        handleSectionComplete();
      }
    }
  };

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (questionType === 'speaking') {
      // recorder.resetRecorder(); // ページ遷移やセクション完了時にresetするのでここでは不要かも
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSectionComplete = useCallback(() => {
    console.log('%c[ExamForm] handleSectionComplete CALLED', 'color: blue; font-weight: bold;', { isSubmitting, sectionInfoTitle: sectionInfo.title, recorderStatus: recorder.status, audioBlobExists: !!recorder.audioBlob });
    if (isSubmitting) return;
    console.log(`[ExamForm] handleSectionComplete called for section: ${sectionInfo.title}. Recorder status: ${recorder.status}, AudioBlob exists: ${!!recorder.audioBlob}`);
    setIsSubmitting(true);
    const questionId = questions[currentQuestionIndex]?.id || 'speaking_answer';

    // Prepare answers to submit, including handling for unanswered multiple-choice questions
    const answersToSubmit = { ...currentAnswers };

    if (questionType !== 'speaking') {
      questions.forEach(q => {
        if (q.questionType === 'multiple-choice' && !(q.id in answersToSubmit)) {
          answersToSubmit[q.id] = -1; // Mark unanswered multiple-choice as -1
        }
        // For other question types (text-input, writing), if not in answersToSubmit, it means they were left blank
        // and will be saved as such (or not at all if the key doesn't exist, depending on Firestore behavior for undefined values in maps)
        // For this requirement, we only explicitly mark multiple-choice.
      });
    }

    if (questionType === 'speaking' && recorder.audioBlob) {
      console.log('[ExamForm] Submitting with audioBlob. Size:', recorder.audioBlob.size);
      const answersWithAudio = {
        ...answersToSubmit, // Use potentially modified answersToSubmit
        [questionId]: recorder.audioBlob
      };
      onSubmit(answersWithAudio);
    } else if (questionType === 'speaking') {
      console.log('[ExamForm] No audioBlob or submission forced. Submitting with no_audio_recorded.');
      const emptyAudioAnswer = { 
        ...answersToSubmit, // Use potentially modified answersToSubmit
        [questionId]: 'no_audio_recorded'
      };
      onSubmit(emptyAudioAnswer);
    } else {
      onSubmit(answersToSubmit); // Use potentially modified answersToSubmit for non-speaking
    }
  }, [isSubmitting, sectionInfo.title, questions, currentQuestionIndex, questionType, recorder.audioBlob, currentAnswers, onSubmit]);

  useEffect(() => {
    if (initialAttemptData?.answers) {
      setCurrentAnswers(initialAttemptData.answers);
    }
  }, [initialAttemptData]);

  // Timer logic unified based on sectionInfo.duration
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    console.log(`[ExamForm TimerEffect] Initializing for: ${sectionInfo.title}, Duration: ${sectionInfo.duration}`);

    if (sectionInfo.duration && sectionInfo.duration > 0) {
    setTimeLeft(sectionInfo.duration);
      console.log(`[ExamForm TimerEffect] Timer SET for ${sectionInfo.title} with duration: ${sectionInfo.duration}`);

      timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            if (timerId) clearInterval(timerId);
            if (sectionInfo.type === 'speaking') {
              setIsRecordingTimeUp(true); 
              console.log('[ExamForm TimerEffect] Speaking time is up.');
              // Consider if stopRecording() should be called here or handled by recorder based on time up.
          }
          return 0;
        }
          return prevTime - 1;
      });
    }, 1000);
    } else {
      setTimeLeft(0); 
      console.log(`[ExamForm TimerEffect] No duration for ${sectionInfo.title}, timer set to 0.`);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
        console.log(`[ExamForm TimerEffect] Timer CLEARED for ${sectionInfo.title}`);
      }
    };
  // examId を依存配列に追加することで、異なる試験インスタンス間でセクション情報が同じでもタイマーがリセットされるようにする
  // currentQuestionIndex を削除。セクションごとのタイマーであり、質問遷移でリセットすべきではない。
  }, [sectionInfo.title, sectionInfo.type, sectionInfo.duration, examId]); 

  const currentQuestionData = questions[currentQuestionIndex];
  // console.log('[ExamForm Render] currentQuestionIndex:', currentQuestionIndex, 'questions.length:', questions.length, 'questionType:', questionType);

  useEffect(() => {
    if (currentQuestionData?.audioUrl && audioRef.current) {
      audioRef.current.src = currentQuestionData.audioUrl;
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio autoplay failed in ExamForm:", error);
          // Optionally show a play button or message if autoplay is blocked
        });
      }
      // setIsPlaying(true); // No longer needed as there's no manual play/pause button
    }
  }, [currentQuestionData?.audioUrl]);

  useEffect(() => {
    // console.log(`[ExamForm] Recorder status updated in ExamForm: ${recorder.status} AudioBlob: ${recorder.audioBlob ? 'Exists' : 'null'} Error: ${recorder.errorMessage}`);
    if (recorder.status === 'stopped' && recorder.audioBlob && questions[currentQuestionIndex]) {
      // console.log('[ExamForm] Audio recorded, setting answer for question ID:', questions[currentQuestionIndex].id);
      setCurrentAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].id]: recorder.audioBlob as any }));
    } else if (recorder.status === 'error') {
      // console.error('[ExamForm] Recording error:', recorder.errorMessage);
      // Optionally, provide feedback to the user
    }
  }, [recorder.status, recorder.audioBlob, recorder.errorMessage, currentQuestionIndex, questions]);

  // Automatic permission request and recording for speaking questions
  useEffect(() => {
    if (questionType === 'speaking' && sectionInfo.type === 'speaking') { // Ensure it's the actual speaking task section
      console.log('[ExamForm Speaking Auto-Flow] useEffect triggered. Recorder status:', recorder.status);
      if (recorder.status === 'idle' || recorder.status === 'permission-denied') {
        console.log('[ExamForm Speaking Auto-Flow] Requesting microphone permission automatically.');
        recorder.getMicrophonePermission(); 
      } else if (recorder.status === 'permission-granted' && !isSubmitting && timeLeft > 0) {
        console.log('[ExamForm Speaking Auto-Flow] Permission granted, starting recording automatically.');
        recorder.startRecording();
        setIsRecordingTimeUp(false); // Reset time up flag if any
      }
    }
    // Dependencies: recorder.status ensures this runs when permission status changes.
    // timeLeft > 0 prevents starting recording if the timer has already run out (e.g., on re-render after time up)
    // sectionInfo.type and questionType ensure this only runs for the intended speaking sections.
  }, [recorder.status, questionType, sectionInfo.type, isSubmitting, timeLeft, recorder.getMicrophonePermission, recorder.startRecording]);

  if (questionType !== 'speaking' && !currentQuestionData) {
    return <div>Loading question...</div>;
  }

  const sectionType = currentQuestionData?.sectionType || 'reading';
  
  const isToeflReading = examType === 'TOEFL' && sectionType === 'reading';
  
  if (currentQuestionData.imageUrl) {
    // console.log('問題画像URL:', currentQuestionData.imageUrl);
    // console.log('模試タイプ:', sectionInfo.examType, '/ セクション:', sectionType);
  }
  
  const questionText = currentQuestionData?.content || '';

  const handleStopRecording = () => {
    console.log('[ExamForm] handleStopRecording called. Current recorder status:', recorder.status);
    if (recorder.status === 'recording') {
      console.log('[ExamForm] Attempting to stop recording.');
      recorder.stopRecording();
    } else {
      console.warn('[ExamForm] Cannot stop recording. Not currently recording. Status:', recorder.status);
    }
  };

  useEffect(() => {
    const completeSectionIfNeeded = () => {
      if (questionType === 'speaking' && isRecordingTimeUp && recorder.status === 'stopped' && !isSubmitting) {
        console.log('[ExamForm] useEffect[isRecordingTimeUp, recorder.status]: Recording time up AND recorder stopped. Calling handleSectionComplete.');
        handleSectionComplete();
      }
    };
    completeSectionIfNeeded();
  }, [isRecordingTimeUp, recorder.status, questionType, isSubmitting, handleSectionComplete]);

  // recorderの状態が変化したときにログを出力
  // useEffect(() => {
  //   console.log('[ExamForm] Recorder status updated in ExamForm:', recorder.status, 'AudioBlob:', recorder.audioBlob ? `Exists, size: ${recorder.audioBlob.size}` : 'null', 'Error:', recorder.errorMessage);
  // }, [recorder.status, recorder.errorMessage, recorder.audioBlob]);

  // クリーンアップエフェクト
  // useEffect(() => {
  //   // このエフェクトは questionType が 'speaking' の場合にのみ recorder をリセットする
  //   // また、コンポーネントがアンマウントされる際にも呼び出される
  //   if (questionType === 'speaking') {
  //     return () => {
  //       console.log('[ExamForm] Cleaning up recorder for speaking section on unmount. Current status:', recorder.status);
  //       recorder.resetRecorder();
  //     };
  //   }
  // }, [questionType, recorder.resetRecorder]); // recorder.resetRecorder のみでOK

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          {questionType !== 'speaking' ?
            `Question ${currentQuestionIndex + 1} / ${questions.length}` :
            sectionInfo.title
          }
        </div>
        {questionType !== 'speaking' && questions.length > 0 && (
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={`progress-${index}`}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestionIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        )}
        <div className="text-lg font-medium text-red-600">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      {questionType !== 'speaking' && currentQuestionData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 md:hidden">{questionText}</h2>
          
          <div className="flex flex-col md:flex-row md:space-x-6">
            {currentQuestionData.imageUrl && (
              <div className="mb-6 md:mb-0 md:w-3/5">
                <div className={`relative w-full ${
                  isToeflReading 
                    ? 'max-h-[80vh] overflow-y-auto' 
                    : 'aspect-[5/7] max-h-[70vh] overflow-auto'
                } rounded-lg border border-gray-200`}>
                  <img 
                    src={currentQuestionData.imageUrl} 
                    alt="問題画像" 
                    className={`w-full ${isToeflReading ? 'h-auto' : 'object-contain'}`}
                  />
                </div>
              </div>
            )}
            
            <div className="md:w-2/5">
              <h2 className="text-xl font-semibold mb-4 hidden md:block">{questionText}</h2>
              
              {currentQuestionData.audioUrl && (
                <div className="mb-6">
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <audio 
                      ref={audioRef} 
                      controls={false}
                      controlsList="nodownload"
                      onEnded={() => { /* setIsPlaying(false); No longer needed */ }}
                      className="w-full"
                    />
                    <div className="ml-4 text-gray-600">
                       Audio will play automatically.
                    </div>
                  </div>
                </div>
              )}

              {questionType === 'multiple-choice' && (
                <div className="space-y-3">
                  {currentQuestionData.options && currentQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentAnswers[currentQuestionData.id] === index
                          ? 'bg-blue-100 border-blue-500'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestionData.id, index)}
                    >
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          className="mt-1 mr-2"
                          checked={currentAnswers[currentQuestionData.id] === index}
                          onChange={() => handleAnswerSelect(currentQuestionData.id, index)}
                        />
                        <span>{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {questionType === 'text-input' && (
                <div className="space-y-3">
                  <textarea
                    value={currentAnswers[currentQuestionData.id] as string || ''}
                    onChange={(e) => handleTextInputChange(currentQuestionData.id, e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your answer here..."
                  />
                </div>
              )}

              {questionType === 'writing' && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg mb-3">
                    <p className="text-gray-700">Please write an essay of 200-300 words on the following topic.</p>
                  </div>
                  <textarea
                    value={currentAnswers[currentQuestionData.id] as string || ''}
                    onChange={(e) => handleTextInputChange(currentQuestionData.id, e.target.value)}
                    className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your essay here..."
                  />
                  <div className="text-right text-gray-500 text-sm">
                    {typeof currentAnswers[currentQuestionData.id] === 'string' 
                      ? (currentAnswers[currentQuestionData.id] as string).length 
                      : 0} Characters
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {questionType === 'speaking' && (
        <div className="space-y-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-center">{currentQuestionData?.content || sectionInfo.instructions || "Speaking Task"}</h3>
          
          {recorder.errorMessage && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p><strong>Error:</strong> {recorder.errorMessage}</p>
            </div>
          )}

          {(() => {
            console.log('[ExamForm Speaking UI Render] Checking recorder.status before button render:', recorder.status);
            return null; 
          })()}
          
          {(recorder.status === 'idle' || recorder.status === 'permission-requested') && (
            <div className="text-center p-4">
              <p className="text-lg font-semibold">Waiting for microphone permission...</p>
              <p className="text-sm text-gray-600">Your browser should prompt you for microphone access.</p>
              {recorder.status === 'permission-requested' && (
                <div className="mt-2 text-blue-600">Requesting microphone access...</div>
              )}
            </div>
          )}

          {recorder.status === 'permission-denied' && (
             <p className="text-center text-red-600">Microphone access was denied. Please check your browser settings.</p>
          )}

          {(recorder.status === 'permission-granted' || recorder.status === 'recording' || recorder.status === 'stopped') && (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-2xl font-mono p-2 border rounded-md min-w-[100px] text-center">
                {formatTime(timeLeft)} 
              </div>
              
              {recorder.status === 'recording' ? (
                <button
                  onClick={handleStopRecording}
                  className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Stop Recording
                </button>
              ) : (
                <div className="text-center p-4">
                  {timeLeft > 0 && (
                     <p className="text-lg font-semibold text-gray-700">Preparing to record...</p>
                  )}
                  {timeLeft === 0 && (
                     <p className="text-lg font-semibold text-orange-600">Time is up. Recording cannot start.</p>
                  )}
                </div>
              )}

              <p className="text-sm text-gray-600">
                Status: {recorder.status}
                {recorder.status === 'stopped' && recorder.audioBlob && ` (Recorded: ${(recorder.audioBlob.size / 1024).toFixed(2)} KB)`}
              </p>

              {/* recorder.audioUrl && recorder.status === 'stopped' && (
                <div className="w-full mt-2">
                  <p className="text-sm text-gray-700 mb-1">Recorded Audio:</p>
                  <audio controls src={recorder.audioUrl} className="w-full" />
                </div>
              )*/}
            </div>
          )}
          {isRecordingTimeUp && recorder.status !== 'recording' && (
            <p className="text-center text-orange-600 font-semibold">Time is up! Please submit your answer if you haven't.</p>
          )}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0 || questionType === 'speaking'}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {questionType !== 'speaking' && currentQuestionIndex < questions.length - 1 && (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        )}

        {((questionType !== 'speaking' && currentQuestionIndex === questions.length - 1 && questions.length > 0) ||
          (questionType === 'speaking' && (recorder.status === 'stopped' || isRecordingTimeUp))) && (
          <button
            onClick={handleSectionComplete}
            disabled={isSubmitting || (questionType === 'speaking' && recorder.status === 'recording')}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : (questionType === 'speaking' ? 'Submit Answer' : 'Complete Section')}
          </button>
        )}
      </div>
    </div>
  );
}); 