'use client';

import { useEffect, useRef } from 'react';

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
  const audioRef = useRef<HTMLAudioElement>(null);

  // duration を分秒形式に変換するヘルパー関数
  const formatTime = (totalSeconds: number | undefined) => {
    if (totalSeconds === undefined) return '';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}min ${seconds}sec`;
  };

  useEffect(() => {
    if (audioRef.current) {
      // audioUrlが変更された場合、新しいソースをロードして再生
      audioRef.current.load(); // Ensure new src is loaded if audioUrl changes
      audioRef.current.play().catch(error => {
        console.error("Audio autoplay failed in AudioPlaybackScreen:", error);
        // Consider adding a fallback play button if autoplay is blocked
      });
    }
  }, [audioUrl]);

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
      {duration && (
        <p className="mb-5 text-md text-center text-gray-600">
          Estimated audio duration: {formatTime(duration)}
        </p>
      )}
      <div className="my-6">
        <audio
          ref={audioRef}
          src={audioUrl}
          autoPlay
          controlsList="nodownload" // Disables download and other context menu items
          // controls={false} // Explicitly set for clarity, though default is no controls without the attribute
          className="w-full"
          onEnded={onNext} // Automatically go to next when audio finishes
        >
          Your browser does not support the audio element.
        </audio>
      </div>
      <p className="mb-8 text-center text-gray-700">
        Listen to the audio. You will automatically proceed to the questions once the audio finishes.
        If it does not proceed, please click the button below.
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