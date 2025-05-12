'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type RecorderStatus = 'idle' | 'permission-requested' | 'permission-granted' | 'permission-denied' | 'recording' | 'stopped' | 'error';
export type AudioBlob = Blob | null;

export const useRecorder = () => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [audioBlob, setAudioBlob] = useState<AudioBlob>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null); // ストリームを保持

  const getMicrophonePermission = useCallback(async () => {
    setStatus('permission-requested');
    setAudioBlob(null); // Reset previous recording
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Media Devices API not supported in this browser.');
      setStatus('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // ストリームを保存
      setStatus('permission-granted');
      console.log('Microphone permission granted.');
    } catch (err) {
      console.error('Error getting microphone permission:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Microphone permission denied. Please allow microphone access in your browser settings.');
          setStatus('permission-denied');
        } else {
          setError(`Error accessing microphone: ${err.message}`);
          setStatus('error');
        }
      } else {
        setError('An unknown error occurred while accessing the microphone.');
        setStatus('error');
      }
    }
  }, []);

  const startRecording = useCallback(() => {
    if (status !== 'permission-granted' || !streamRef.current) {
      setError('Microphone permission not granted or stream not available.');
      setStatus('error');
      console.error('Cannot start recording: Permission not granted or stream unavailable.');
      return;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.warn('Already recording.');
      return;
    }

    setAudioBlob(null); // Reset previous recording
    audioChunksRef.current = [];
    setError(null);

    try {
      // 推奨されるMIMEタイプを試す
      const options = { mimeType: 'audio/webm;codecs=opus' }; 
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn(`${options.mimeType} is not Supported. Trying default.`);
        options.mimeType = 'audio/webm'; // フォールバック
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn(`${options.mimeType} is not Supported. Trying default without specific codec.`);
          options.mimeType = ''; // さらにフォールバック
        }
      }
      
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setStatus('stopped');
        console.log('Recording stopped, blob created.', blob);
        // ストリームを停止 (必要に応じて。連続録音しない場合は停止推奨)
        // streamRef.current?.getTracks().forEach(track => track.stop());
        // streamRef.current = null;
        // setStatus('idle'); // 必要なら idle に戻す
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        // @ts-ignore MediaRecorderErrorEvent は標準化されているはずだが型定義にない場合がある
        setError(`Recording error: ${event.error?.message || 'Unknown error'}`);
        setStatus('error');
      }

      mediaRecorderRef.current.start();
      setStatus('recording');
      console.log('Recording started.');

    } catch (err) {
        console.error('Error starting recording:', err);
        if (err instanceof Error) {
            setError(`Failed to start recording: ${err.message}`);
        } else {
            setError('An unknown error occurred while starting the recording.');
        }
        setStatus('error');
    }

  }, [status]);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
      console.warn('Not recording or recorder not initialized.');
      // エラー状態にはしないが、何もせずに関数を抜ける
      return;
    }
    try {
        mediaRecorderRef.current.stop(); // onstop イベントハンドラで後続処理が行われる
        console.log('Stopping recording signal sent.');
        // ここでは setStatus('stopped') は呼び出さない。onstop で行う。
    } catch (err) {
        console.error('Error stopping recording:', err);
        if (err instanceof Error) {
            setError(`Failed to stop recording: ${err.message}`);
        } else {
            setError('An unknown error occurred while stopping the recording.');
        }
        setStatus('error');
    }
  }, []);

  // クリーンアップ関数: コンポーネントのアンマウント時にストリームを停止
  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop(); // 録音中なら停止
      streamRef.current?.getTracks().forEach(track => track.stop()); // マイクアクセスを解放
      console.log('Recorder cleanup: stream stopped.');
    };
  }, []);

  return {
    status,
    audioBlob,
    error,
    getMicrophonePermission,
    startRecording,
    stopRecording,
  };
}; 