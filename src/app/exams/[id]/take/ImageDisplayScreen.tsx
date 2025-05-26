import React, { useState, useEffect } from 'react';
// Next.js の Image コンポーネントを使用する場合。今回は通常のimgを使用するのでコメントアウトも検討
// import Image from 'next/image'; 

interface ImageDisplayScreenProps {
  imageUrl: string;
  onNext: () => void;
  title?: string;
  instructions?: string; // オプションで指示文も表示できるようにする
  duration?: number; // 秒単位の時間制限
}

const ImageDisplayScreen: React.FC<ImageDisplayScreenProps> = ({ imageUrl, onNext, title, instructions, duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration || 0);

  useEffect(() => {
    if (duration && duration > 0) {
      setTimeLeft(duration);
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onNext(); // 時間切れで自動遷移
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // アンマウント時にタイマーをクリア
    } else {
        // duration がない場合は、timeLeft を非常に大きな値にするか、
        // もしくはタイマー関連の表示をしないなどのハンドリングも考えられる。
        // ここでは Next ボタンのみに依存するため、0のままでも問題ないが、
        // 視覚的に「時間無制限」を示すために null や undefined を使う設計も良い。
        // 今回はpropsでdurationが渡されない場合はタイマー表示なしとするため、初期値0でOK
    }
  }, [duration, onNext]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-3xl w-full text-center">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex-grow text-center">{title || 'Display'}</h1>
            {duration && duration > 0 && (
                <div className="text-lg font-medium text-red-500">
                    Time Left: {formatTime(timeLeft)}
                </div>
            )}
        </div>

        {instructions && (
          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto mb-6 text-left" 
            dangerouslySetInnerHTML={{ __html: instructions }} 
          />
        )}
        <div className="mb-8 max-h-[60vh] overflow-auto rounded border">
          {imageUrl ? (
            <img src={imageUrl} alt={title || 'Display Image'} className="w-full h-auto object-contain" />
          ) : (
            <p className="text-gray-500">画像が指定されていません。</p>
          )}
        </div>
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Next (Proceed to Questions)
        </button>
      </div>
    </div>
  );
};

export default ImageDisplayScreen; 