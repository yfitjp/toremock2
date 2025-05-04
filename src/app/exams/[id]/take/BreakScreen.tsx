'use client';

import React, { useState, useEffect } from 'react';

interface BreakScreenProps {
  title: string;
  duration?: number; // 休憩時間（秒単位）
  onNext: () => void;
}

const BreakScreen: React.FC<BreakScreenProps> = ({ title, duration = 300, onNext }) => { // デフォルト5分
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const timerId = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>
      <p className="text-lg text-gray-600 mb-6">休憩時間です。</p>

      <div className="text-6xl font-mono font-bold text-indigo-600 my-8">
        {formatTime(remainingTime)}
      </div>

      {remainingTime > 0 ? (
         <p className="text-gray-500 mb-8">時間になるまでお待ちください。準備ができ次第、次へ進むことも可能です。</p>
      ) : (
          <p className="text-green-600 font-semibold mb-8">休憩時間が終了しました。</p>
      )}
      
      <button 
        onClick={onNext} 
        className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        disabled={remainingTime > 0} // 時間中は無効化 (任意)
      >
        試験を再開する
      </button>
      {remainingTime > 0 && (
         <button 
           onClick={onNext} 
           className="ml-4 px-6 py-2 bg-gray-500 text-white text-sm font-semibold rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
         >
           スキップして再開
         </button>
      )} 
    </div>
  );
};

export default BreakScreen; 