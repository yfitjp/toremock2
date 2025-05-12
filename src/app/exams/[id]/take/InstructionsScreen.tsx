'use client';

import React, { useState, useEffect } from 'react';

interface InstructionsScreenProps {
  title: string;
  instructions?: string;
  duration?: number; // Optional duration in seconds
  onNext: () => void;
}

// Helper function to format seconds into MM:SS
const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ title, instructions, duration, onNext }) => {
  const [timeLeft, setTimeLeft] = useState(duration || 0);

  useEffect(() => {
    if (duration === undefined || duration <= 0) return; // No timer needed

    setTimeLeft(duration);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          console.log("Instruction time's up!");
          onNext(); // Automatically proceed when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount or if duration/onNext changes
    return () => clearInterval(timer);

  }, [duration, onNext]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">{title}</h1>
      
      {/* Timer display if duration is provided */} 
      {duration !== undefined && duration > 0 && (
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-600">Preparation Time:</p>
          <div className="text-4xl font-bold text-red-600 tracking-wider">
            {formatTime(timeLeft)}
          </div>
        </div>
      )}

      <div className="prose prose-lg max-w-none mb-8 text-gray-700">
        {/* instructions が HTML を含む可能性を考慮する場合は dangerouslySetInnerHTML を使うか、Markdown パーサーを使う */}
        <p>{instructions || 'Follow the instructions and proceed when ready.'}</p>
        {/* 必要であればここに詳細な指示内容を追加 */}
      </div>

      {/* Show button only if there is no duration (manual proceed) */} 
      {(duration === undefined || duration <= 0) && (
        <div className="text-center">
          <button 
            onClick={onNext} 
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Start Exam / Proceed
          </button>
        </div>
      )}
    </div>
  );
};

export default InstructionsScreen; 