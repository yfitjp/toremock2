'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExamForm;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const useAuth_1 = require("@/app/hooks/useAuth");
function ExamForm({ examId, sectionInfo, questions, initialAttemptData, onSubmit, examType }) {
    const router = (0, navigation_1.useRouter)();
    const { user } = (0, useAuth_1.useAuth)();
    const [currentAnswers, setCurrentAnswers] = (0, react_1.useState)({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = (0, react_1.useState)(0);
    const [timeLeft, setTimeLeft] = (0, react_1.useState)(sectionInfo.duration || 0);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const audioRef = (0, react_1.useRef)(null);
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const handleAnswerSelect = (questionId, optionIndex) => {
        setCurrentAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    };
    const handleTextInputChange = (questionId, text) => {
        setCurrentAnswers((prev) => ({ ...prev, [questionId]: text }));
    };
    const handlePlayAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            }
            else {
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
        if (isSubmitting)
            return;
        console.log(`Completing section: ${sectionInfo.title}`);
        setIsSubmitting(true);
        onSubmit(currentAnswers);
    };
    (0, react_1.useEffect)(() => {
        if (initialAttemptData?.answers) {
            setCurrentAnswers(initialAttemptData.answers);
        }
    }, [initialAttemptData]);
    (0, react_1.useEffect)(() => {
        if (!sectionInfo.duration)
            return;
        setTimeLeft(sectionInfo.duration);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    console.log("Time's up for section:", sectionInfo.title);
                    handleSectionComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [sectionInfo.duration, sectionInfo.title]);
    const currentQuestionData = questions[currentQuestionIndex];
    if (!currentQuestionData) {
        return <div>問題が見つかりません。</div>;
    }
    const questionType = currentQuestionData.questionType || 'multiple-choice';
    const sectionType = currentQuestionData.sectionType || 'reading';
    const isToeflReading = examType === 'TOEFL' && sectionType === 'reading';
    if (currentQuestionData.imageUrl) {
        // console.log('問題画像URL:', currentQuestionData.imageUrl);
        // console.log('模試タイプ:', sectionInfo.examType, '/ セクション:', sectionType);
    }
    const questionText = currentQuestionData.content || '';
    return (<div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          問題 {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="text-lg font-medium text-red-600">
          残り時間: {timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 md:hidden">{questionText}</h2>
        
        <div className="flex flex-col md:flex-row md:space-x-6">
          {currentQuestionData.imageUrl && (<div className="mb-6 md:mb-0 md:w-3/5">
              <div className={`relative w-full ${isToeflReading
                ? 'max-h-[80vh] overflow-y-auto'
                : 'aspect-[5/7] max-h-[70vh] overflow-auto'} rounded-lg border border-gray-200`}>
                <img src={currentQuestionData.imageUrl} alt="問題画像" className={`w-full ${isToeflReading ? 'h-auto' : 'object-contain'}`}/>
              </div>
            </div>)}
          
          <div className="md:w-2/5">
            <h2 className="text-xl font-semibold mb-4 hidden md:block">{questionText}</h2>
            
            {currentQuestionData.audioUrl && (<div className="mb-6">
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <button onClick={handlePlayAudio} className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors">
                    {isPlaying ? (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>)}
                  </button>
                  <audio ref={audioRef} src={currentQuestionData.audioUrl} onEnded={() => setIsPlaying(false)} className="hidden"/>
                  <div className="ml-4 text-gray-600">
                    音声を{isPlaying ? '停止' : '再生'}する
                  </div>
                </div>
              </div>)}

            {questionType === 'multiple-choice' && (<div className="space-y-3">
                {currentQuestionData.options && currentQuestionData.options.map((option, index) => (<div key={index} className={`p-3 border rounded-lg cursor-pointer transition-colors ${currentAnswers[currentQuestionData.id] === index
                    ? 'bg-blue-100 border-blue-500'
                    : 'hover:bg-gray-50 border-gray-200'}`} onClick={() => handleAnswerSelect(currentQuestionData.id, index)}>
                    <label className="flex items-start cursor-pointer">
                      <input type="radio" className="mt-1 mr-2" checked={currentAnswers[currentQuestionData.id] === index} onChange={() => handleAnswerSelect(currentQuestionData.id, index)}/>
                      <span>{option}</span>
                    </label>
                  </div>))}
              </div>)}

            {questionType === 'text-input' && (<div className="space-y-3">
                <textarea value={currentAnswers[currentQuestionData.id] || ''} onChange={(e) => handleTextInputChange(currentQuestionData.id, e.target.value)} className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ここに回答を入力してください..."/>
              </div>)}

            {questionType === 'writing' && (<div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  <p className="text-gray-700">以下のテーマについて、200-300語程度の英文を作成してください。</p>
                </div>
                <textarea value={currentAnswers[currentQuestionData.id] || ''} onChange={(e) => handleTextInputChange(currentQuestionData.id, e.target.value)} className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ここに回答を入力してください..."/>
                <div className="text-right text-gray-500 text-sm">
                  {typeof currentAnswers[currentQuestionData.id] === 'string'
                ? currentAnswers[currentQuestionData.id].length
                : 0} 文字
                </div>
              </div>)}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className={`px-4 py-2 rounded-md ${currentQuestionIndex === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          前の問題
        </button>

        {currentQuestionIndex < questions.length - 1 ? (<button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            次の問題
          </button>) : (<button onClick={handleSectionComplete} disabled={isSubmitting} className={`px-4 py-2 rounded-md ${isSubmitting ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
            {isSubmitting ? '処理中...' : 'セクション完了'}
          </button>)}
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => (<button key={index} onClick={() => setCurrentQuestionIndex(index)} className={`w-8 h-8 flex items-center justify-center rounded-full ${currentAnswers[questions[index].id] !== undefined
                ? 'bg-green-500 text-white'
                : currentQuestionIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'}`}>
              {index + 1}
            </button>))}
        </div>
      </div>
    </div>);
}
