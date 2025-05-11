'use client';

import { useEffect, useState } from 'react';

interface AudioPlaybackScreenProps {
  title: string;
  audioUrl: string;
  onNext: () => void;
  duration?: number; // 音源の長さや目安時間（秒）
}

export default function AudioPlaybackScreen({
  title,
  audioUrl,
  onNext,
  duration,
}: AudioPlaybackScreenProps) {
  // duration を分秒形式に変換するヘルパー関数
  const formatTime = (totalSeconds: number | undefined) => {
    if (totalSeconds === undefined) return '';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}min ${seconds}sec`;
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
      {duration && (
        <p className="mb-5 text-md text-center text-gray-600">
          Estimated audio duration: {formatTime(duration)}
        </p>
      )}
      <div className="my-6">
        <audio controls src={audioUrl} className="w-full">
          Your browser does not support the audio element.
        </audio>
      </div>
      <p className="mb-8 text-center text-gray-700">
        Once you have finished listening to the audio, press the "Next" button to proceed to the questions.
      </p>
      <button
        onClick={onNext}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 shadow-md hover:shadow-lg"
      >
        Next (Proceed to Questions)
      </button>
    </div>
  );
} 