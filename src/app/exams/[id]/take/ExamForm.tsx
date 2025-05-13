'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import { Question, ExamSection, SectionAttempt } from '@/app/lib/firestoreTypes';
import { useRecorder, RecorderStatus, AudioBlob } from '@/app/hooks/useRecorder';

interface ExamFormProps {
  examId: string;
  sectionInfo: ExamSection;
  questions: Question[];
  initialAttemptData?: SectionAttempt;
  onSubmit: (answers: Record<string, number | string /* | AudioBlob */>) => void;
  examType: string;
}

export default function ExamForm({ 
  examId, 
  sectionInfo, 
  questions, 
  initialAttemptData, 
  onSubmit, 
  examType
}: ExamFormProps) {
  console.log('[ExamForm] Props received:', { examId, sectionInfo, questions, examType });
  const router = useRouter();
  const { user } = useAuth();
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number | string /* | AudioBlob */>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(sectionInfo.duration || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const recorder = useRecorder();
  const [isRecordingTimeUp, setIsRecordingTimeUp] = useState(false);

  console.log('[ExamForm] Determining questionType. questions:', questions, 'sectionInfo.type:', sectionInfo.type);
  const questionType = questions && questions.length > 0 && questions[0]?.questionType 
                     ? questions[0].questionType 
                     : sectionInfo.type === 'speaking' 
                     ? 'speaking' 
                     : 'multiple-choice';
  console.log('[ExamForm] questionType determined:', questionType);

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

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      if (questionType !== 'speaking') {
        handleSectionComplete();
      }
    }
  };

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSectionComplete = () => {
    if (isSubmitting) return;
    console.log(`Completing section: ${sectionInfo.title}`);
    setIsSubmitting(true);
    const questionId = questions[currentQuestionIndex]?.id || 'speaking_answer';

    if (questionType === 'speaking' && recorder.audioBlob) {
      console.log('Recorded audio for speaking:', recorder.audioBlob);
      const answersWithAudio = { 
        ...currentAnswers,
        [questionId]: `recorded_audio_${Date.now()}.webm`
      };
      onSubmit(answersWithAudio);
    } else if (questionType === 'speaking') {
      console.log('No audio recorded for speaking or submission forced.');
      const emptyAudioAnswer = { 
        ...currentAnswers,
        [questionId]: 'no_audio_recorded'
      };
      onSubmit(emptyAudioAnswer);
    } else {
      onSubmit(currentAnswers);
    }
  };

  useEffect(() => {
    if (initialAttemptData?.answers) {
      setCurrentAnswers(initialAttemptData.answers);
    }
  }, [initialAttemptData]);

  useEffect(() => {
    if (!sectionInfo.duration) return;
    setTimeLeft(sectionInfo.duration);
    setIsRecordingTimeUp(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (questionType === 'speaking') {
            console.log("Recording time's up for:", sectionInfo.title);
            if (recorder.status === 'recording') {
              recorder.stopRecording();
            }
            setIsRecordingTimeUp(true);
          } else {
            console.log("Time's up for section:", sectionInfo.title);
            handleSectionComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sectionInfo.duration, sectionInfo.title, questionType, recorder.status, recorder.stopRecording]);

  const currentQuestionData = questions[currentQuestionIndex];

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

  const handleRequestMicPermission = async () => {
    await recorder.getMicrophonePermission();
  };

  const handleStartRecording = () => {
    if (recorder.status === 'permission-granted' || recorder.status === 'stopped') {
      recorder.startRecording();
      setIsRecordingTimeUp(false);
      setTimeLeft(sectionInfo.duration || 0); 
    }
  };

  const handleStopRecording = () => {
    if (recorder.status === 'recording') {
      recorder.stopRecording();
    }
  };

  useEffect(() => {
    const completeSectionIfNeeded = () => {
      if (questionType === 'speaking' && isRecordingTimeUp && recorder.status === 'stopped' && !isSubmitting) {
        console.log('Recording time up and recording stopped, submitting.');
        handleSectionComplete();
      }
    };
    completeSectionIfNeeded();
  }, [isRecordingTimeUp, recorder.status, questionType, isSubmitting]);

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

      {questionType !== 'speaking' && (
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
                    <button
                      onClick={handlePlayAudio}
                      className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors"
                    >
                      {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    <audio ref={audioRef} src={currentQuestionData.audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                    <div className="ml-4 text-gray-600">
                      {isPlaying ? 'Pause' : 'Play'} Audio
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
          <h3 className="text-lg font-semibold text-center">{currentQuestionData.content || sectionInfo.instructions || "Speaking Task"}</h3>
          
          {recorder.error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p><strong>Error:</strong> {recorder.error}</p>
            </div>
          )}

          {recorder.status === 'idle' || recorder.status === 'permission-requested' && (
            <button
              onClick={handleRequestMicPermission}
              disabled={recorder.status === 'permission-requested'}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {recorder.status === 'permission-requested' ? 'Requesting Mic...' : 'Allow Microphone Access'}
            </button>
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
                <button
                  onClick={handleStartRecording}
                  disabled={timeLeft === 0 || isSubmitting}
                  className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  Start Recording
                </button>
              )}

              <p className="text-sm text-gray-600">
                Status: {recorder.status} 
                {recorder.status === 'stopped' && recorder.audioBlob && ` (Recorded: ${(recorder.audioBlob.size / 1024).toFixed(2)} KB)`}
              </p>

              {recorder.audioBlob && recorder.status === 'stopped' && (
                <div className="w-full mt-2">
                  <p className="text-sm text-gray-700 mb-1">Recorded Audio:</p>
                  <audio controls src={URL.createObjectURL(recorder.audioBlob)} className="w-full" />
                </div>
              )}
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

        {(questionType !== 'speaking' && currentQuestionIndex === questions.length - 1) || 
         (questionType === 'speaking' && (recorder.status === 'stopped' || isRecordingTimeUp)) && (
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
} 