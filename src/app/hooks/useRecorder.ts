'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type RecorderStatus = 'idle' | 'permission-requested' | 'permission-granted' | 'permission-denied' | 'recording' | 'stopped' | 'error';

export interface UseRecorderReturnType {
  status: RecorderStatus;
  stream: MediaStream | null;
  audioBlob: Blob | null;
  audioUrl: string | null;
  errorMessage: string | null;
  getMicrophonePermission: () => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecorder: () => void;
}

const useRecorder = (): UseRecorderReturnType => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>('audio/webm');

  const getMicrophonePermission = useCallback(async () => {
    console.log('[useRecorder] getMicrophonePermission called. Current status:', status);
    setStatus('permission-requested');
    setErrorMessage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      setStatus('permission-granted');
      console.log('[useRecorder] Microphone permission GRANTED. Stream set.');
    } catch (err) {
      console.error("[useRecorder] Error accessing microphone:", err);
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error accessing microphone.');
      setStatus('permission-denied');
      console.log('[useRecorder] Microphone permission DENIED.');
    }
  }, [status]);

  const startRecording = useCallback(() => {
    console.log('[useRecorder] startRecording called. Current status:', status, 'Stream available:', !!stream);
    if (!stream || status === 'recording') {
      console.warn('[useRecorder] Stream not available or already recording.');
      if (!stream) setErrorMessage('Microphone permission not granted or stream not available.');
      return;
    }
    if (status === 'permission-denied') {
        console.warn('[useRecorder] Attempted to start recording but permission was denied.');
        setErrorMessage('Microphone permission was denied. Please enable it in your browser settings.');
        return;
    }

    // Determine supported MIME type
    const MimeTypes = [
      'audio/webm;codecs=opus', // Opus in WebM (High quality, good compression)
      'audio/webm',
      'audio/mp4', // For Safari (results in m4a)
      'audio/ogg;codecs=opus' // Opus in OGG
    ];
    
    let supportedMimeType = '';
    for (const type of MimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        supportedMimeType = type;
        break;
      }
    }

    if (!supportedMimeType) {
      console.error('[useRecorder] No supported MIME type found for MediaRecorder.');
      setErrorMessage('No supported audio recording format found for your browser.');
      setStatus('error');
      return;
    }
    mimeTypeRef.current = supportedMimeType;
    console.log(`[useRecorder] Using MIME type: ${supportedMimeType}`);

    console.log('[useRecorder] Setting status to "recording".');
    setStatus('recording');
    setAudioBlob(null);
    setAudioUrl(null);
    if(audioUrl) URL.revokeObjectURL(audioUrl);
    audioChunksRef.current = [];
    setErrorMessage(null);

    try {
        console.log('[useRecorder] Creating MediaRecorder instance.');
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: mimeTypeRef.current });

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
            // console.log('[useRecorder] ondataavailable - chunk size:', event.data.size);
            audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            console.log('[useRecorder] onstop called. Number of chunks:', audioChunksRef.current.length);
            const completeBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
            setAudioBlob(completeBlob);
            const url = URL.createObjectURL(completeBlob);
            setAudioUrl(url);
            setStatus('stopped');
            console.log('[useRecorder] Status set to "stopped". Audio Blob created, size:', completeBlob.size, 'URL:', url);
        };

        mediaRecorderRef.current.onerror = (event) => {
            console.error("MediaRecorder error:", event);
            const errMsg = event.error?.message || 'Unknown MediaRecorder error';
            setErrorMessage(`Recording error: ${errMsg}`);
            setStatus('error');
            console.error('[useRecorder] MediaRecorder error event:', event);
        };
        
        console.log('[useRecorder] Calling mediaRecorder.start().');
        mediaRecorderRef.current.start(1000);
        console.log('[useRecorder] mediaRecorder.start(1000) called successfully.');

    } catch (err) {
        console.error("[useRecorder] Error starting recording:", err);
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error starting recording.');
        setStatus('error');
    }
  }, [stream, status, audioUrl]);

  const stopRecording = useCallback(() => {
    console.log('[useRecorder] stopRecording called. Current status:', status, 'MediaRecorder exists:', !!mediaRecorderRef.current);
    if (mediaRecorderRef.current && status === 'recording') {
      console.log('[useRecorder] Calling mediaRecorder.stop().');
      mediaRecorderRef.current.stop();
      // onstop で status が 'stopped' に設定される
    } else {
      console.warn('[useRecorder] MediaRecorder not active or not recording. Cannot stop.');
    }
  }, [status]);

  const resetRecorder = useCallback(() => {
    console.log('[useRecorder] resetRecorder called. Current status:', status);
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setAudioBlob(null);
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setStatus('idle');
    setErrorMessage(null);
    console.log('[useRecorder] Recorder reset to idle state.');
  }, [stream, audioUrl, status]);

  return {
    status,
    stream,
    audioBlob,
    audioUrl,
    errorMessage,
    getMicrophonePermission,
    startRecording,
    stopRecording,
    resetRecorder,
  };
};

export default useRecorder; 