import { useState, useCallback, useRef } from 'react';

export type RecorderStatus =
  | 'idle'
  | 'permission-requested'
  | 'permission-granted'
  | 'permission-denied'
  | 'recording'
  | 'stopped'
  | 'error';

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

  const getMicrophonePermission = useCallback(async () => {
    setStatus('permission-requested');
    setErrorMessage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      setStatus('permission-granted');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error accessing microphone.');
      setStatus('permission-denied');
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!stream || status === 'recording') {
      console.warn('Stream not available or already recording.');
      if (!stream) setErrorMessage('Microphone permission not granted or stream not available.');
      return;
    }
    if (status === 'permission-denied') {
        setErrorMessage('Microphone permission was denied. Please enable it in your browser settings.');
        return;
    }

    setStatus('recording');
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
    setErrorMessage(null);

    try {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const completeBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setAudioBlob(completeBlob);
            const url = URL.createObjectURL(completeBlob);
            setAudioUrl(url);
            setStatus('stopped');
        };

        mediaRecorderRef.current.onerror = (event) => {
            console.error("MediaRecorder error:", event);
            // @ts-ignore
            const errMsg = event.error?.message || 'Unknown MediaRecorder error';
            setErrorMessage(`Recording error: ${errMsg}`);
            setStatus('error');
        };
        
        mediaRecorderRef.current.start();

    } catch (err) {
        console.error("Error starting recording:", err);
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error starting recording.');
        setStatus('error');
    }
  }, [stream, status]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      // The status will be set to 'stopped' by the onstop event handler
    } else {
      console.warn('MediaRecorder not active or not recording.');
    }
  }, [status]);

  const resetRecorder = useCallback(() => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setAudioBlob(null);
    setAudioUrl(null);
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl); // Clean up the object URL
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setStatus('idle');
    setErrorMessage(null);
  }, [stream, audioUrl]);


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