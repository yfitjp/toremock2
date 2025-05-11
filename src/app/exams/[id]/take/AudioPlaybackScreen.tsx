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
    return `${minutes}分${seconds}秒`;
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
      {duration && (
        <p className="mb-5 text-md text-center text-gray-600">
          音声の目安時間: {formatTime(duration)}
        </p>
      )}
      <div className="my-6">
        <audio controls src={audioUrl} className="w-full">
          ご利用のブラウザは音声再生に対応していません。
        </audio>
      </div>
      <p className="mb-8 text-center text-gray-700">
        音声を聞き終わったら、「次へ」ボタンを押して問題に進んでください。
      </p>
      <button
        onClick={onNext}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 shadow-md hover:shadow-lg"
      >
        次へ (問題に進む)
      </button>
    </div>
  );
} 