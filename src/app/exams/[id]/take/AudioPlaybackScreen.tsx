'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioPlaybackScreenProps {
  title: string;
  audioUrl: string;
  onNext: () => void;
  duration?: number; // This could be a pre-fetched or estimated duration
}

export default function AudioPlaybackScreen({
  title,
  audioUrl,
  onNext,
  // duration: estimatedDuration, // Rename for clarity if used as fallback
}: AudioPlaybackScreenProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const formatTime = (totalSeconds: number | undefined) => {
    if (totalSeconds === undefined || isNaN(totalSeconds)) return 'Loading...'; // Handle NaN
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60); // Use Math.floor for seconds as well
    return `${minutes}min ${seconds.toString().padStart(2, '0')}sec`;
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleTimeUpdate = () => {
        setAudioCurrentTime(audioElement.currentTime);
      };
      const handleLoadedMetadata = () => {
        setAudioDuration(audioElement.duration);
      };

      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      // Play logic
      audioElement.load();
      audioElement.play().catch(error => {
        console.error("Audio autoplay failed in AudioPlaybackScreen:", error);
      });

      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [audioUrl]);

  const progressPercent = audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0;

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{title}</h2>
      
      {/* Audio Player and Custom Progress Bar */}
      <div className="my-6 space-y-3">
        <audio
          ref={audioRef}
          src={audioUrl}
          // autoPlay // Autoplay is handled in useEffect
          controlsList="nodownload"
          className="w-full hidden" // Hide default player, we use custom UI
          onEnded={onNext}
        >
          Your browser does not support the audio element.
        </audio>

        {/* Custom Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-150 ease-linear"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatTime(audioCurrentTime)}</span>
          <span>{formatTime(audioDuration)}</span>
        </div>
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