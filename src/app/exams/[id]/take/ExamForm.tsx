'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import { addDocument } from '@/app/lib/firestore';

interface Question {
  id: string;
  content?: string;
  options: string[];
  correctAnswer?: number;
  imageUrl?: string;
  audioUrl?: string;
  questionType?: 'multiple-choice' | 'text-input' | 'speaking' | 'writing';
  sectionType?: 'reading' | 'listening' | 'writing' | 'speaking';
}

interface ExamFormProps {
  examId: string;
  questions: Question[];
  examType?: string; // 模試タイプ（TOEIC, TOEFL, EIKENなど）
}

export default function ExamForm({ examId, questions, examType }: ExamFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60分（秒単位）
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 残り時間のカウントダウン
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 回答の選択（選択肢タイプ）
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // テキスト回答の変更（テキスト入力タイプ）
  const handleTextInputChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  // 音声の再生
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

  // 次の問題へ
  const handleNext = () => {
    // 音声を停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // 前の問題へ
  const handlePrev = () => {
    // 音声を停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // 回答の提出
  const handleSubmit = async () => {
    if (!user) {
      setError('ログインが必要です。');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 正解数を計算（選択問題のみ）
      let correctCount = 0;
      let totalMultipleChoiceQuestions = 0;
      
      for (const question of questions) {
        if (question.questionType === 'multiple-choice' || question.questionType === undefined) {
          totalMultipleChoiceQuestions++;
          if (question.correctAnswer !== undefined && 
              typeof answers[question.id] === 'number' && 
              answers[question.id] === question.correctAnswer) {
            correctCount++;
          }
        }
      }
      
      // スコアを計算（100点満点）- 選択問題のみ
      const score = totalMultipleChoiceQuestions > 0 
        ? Math.round((correctCount / totalMultipleChoiceQuestions) * 100)
        : 0;
      
      // 回答データをFirestoreに保存
      await addDocument('exam_attempts', {
        userId: user.uid,
        examId: examId,
        answers: answers,
        score: score,
        completedAt: new Date(),
      });

      // 結果ページへリダイレクト
      router.push(`/exams/${examId}/result?score=${score}`);
    } catch (err) {
      console.error('Error submitting exam:', err);
      setError('回答の提出中にエラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  // 残り時間のフォーマット
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // 現在の問題
  const currentQuestionData = questions[currentQuestion];

  if (!currentQuestionData) {
    return <div>問題が見つかりません。</div>;
  }

  // 問題タイプの判定（デフォルトは選択肢問題）
  const questionType = currentQuestionData.questionType || 'multiple-choice';
  const sectionType = currentQuestionData.sectionType || 'reading';
  
  // TOEFLのReadingセクションかどうかを判定
  const isToeflReading = examType === 'TOEFL' && sectionType === 'reading';
  
  // デバッグ: 画像URLがあれば出力
  if (currentQuestionData.imageUrl) {
    // console.log('問題画像URL:', currentQuestionData.imageUrl);
    // console.log('模試タイプ:', examType, '/ セクション:', sectionType);
  }
  
  // 問題テキストを取得
  const questionText = currentQuestionData.content || '';

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          問題 {currentQuestion + 1} / {questions.length}
        </div>
        <div className="text-lg font-medium text-red-600">
          残り時間: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 md:hidden">{questionText}</h2>
        
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* 問題画像の表示 */}
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
            
            {/* リスニング問題の音声プレーヤー */}
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
                    音声を{isPlaying ? '停止' : '再生'}する
                  </div>
                </div>
              </div>
            )}

            {/* 問題タイプに応じた回答フォーム */}
            {questionType === 'multiple-choice' && (
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      answers[currentQuestionData.id] === index
                        ? 'bg-blue-100 border-blue-500'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestionData.id, index)}
                  >
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        className="mt-1 mr-2"
                        checked={answers[currentQuestionData.id] === index}
                        onChange={() => handleAnswerSelect(currentQuestionData.id, index)}
                      />
                      <span>{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* テキスト入力問題（Writing問題など） */}
            {questionType === 'text-input' && (
              <div className="space-y-3">
                <textarea
                  value={answers[currentQuestionData.id] as string || ''}
                  onChange={(e) => handleTextInputChange(currentQuestionData.id, e.target.value)}
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ここに回答を入力してください..."
                />
              </div>
            )}

            {/* Writing問題（エッセイなど） */}
            {questionType === 'writing' && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  <p className="text-gray-700">以下のテーマについて、200-300語程度の英文を作成してください。</p>
                </div>
                <textarea
                  value={answers[currentQuestionData.id] as string || ''}
                  onChange={(e) => handleTextInputChange(currentQuestionData.id, e.target.value)}
                  className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ここに回答を入力してください..."
                />
                <div className="text-right text-gray-500 text-sm">
                  {typeof answers[currentQuestionData.id] === 'string' 
                    ? (answers[currentQuestionData.id] as string).length 
                    : 0} 文字
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestion === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          前の問題
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            次の問題
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md ${
              isSubmitting
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSubmitting ? '提出中...' : '回答を提出する'}
          </button>
        )}
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                answers[questions[index].id] !== undefined
                  ? 'bg-green-500 text-white'
                  : currentQuestion === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 