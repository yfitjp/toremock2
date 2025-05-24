'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';

export type RecorderStatus = 'idle' | 'permission-requested' | 'permission-granted' | 'permission-denied' | 'recording' | 'stopped' | 'error';

export interface UseRecorderReturnType {
  status: RecorderStatus;
  audioBlob: Blob | null;
  audioUrl: string | null; // Keep for potential local playback if needed, though MP3 blob is primary
  errorMessage: string | null;
  getMicrophonePermission: () => Promise<void>; // Will effectively just initialize recorder
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetRecorder: () => void;
}

const useRecorder = (): UseRecorderReturnType => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recorderRef = useRef<MicRecorder | null>(null);

  // Initialize recorder - this implicitly handles permission request with some browsers
  const initializeRecorder = useCallback(() => {
    if (!recorderRef.current) {
      try {
        recorderRef.current = new MicRecorder({
          bitRate: 128, // Standard MP3 bitrate
        });
        console.log('[useRecorder] MicRecorder initialized.');
        setStatus('permission-granted'); // Assuming initialization implies permission or will be handled by start
      } catch (err) {
        console.error('[useRecorder] Error initializing MicRecorder:', err);
        setErrorMessage(err instanceof Error ? err.message : 'Failed to initialize recorder.');
        setStatus('error');
      }
    }
  }, []);

  const getMicrophonePermission = useCallback(async () => {
    console.log('[useRecorder] getMicrophonePermission called (effectively initializeRecorder).');
    setStatus('permission-requested');
    setErrorMessage(null);
    // MicRecorder handles permissions somewhat implicitly on start, 
    // but we can try an explicit getUserMedia to update status more clearly
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // If successful, initialize the recorder instance.
      // Actual permission status for MicRecorder is often known at start()
      initializeRecorder(); 
      setStatus('permission-granted');
      console.log('[useRecorder] Microphone permission seems GRANTED via getUserMedia.');
    } catch (err) {
      console.error("[useRecorder] Error accessing microphone via getUserMedia:", err);
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error accessing microphone.');
      setStatus('permission-denied');
      console.log('[useRecorder] Microphone permission DENIED via getUserMedia.');
    }
  }, [initializeRecorder]);


  const startRecording = useCallback(async () => {
    console.log('[useRecorder] startRecording called. Current status:', status);
    if (!recorderRef.current) {
      // Try to initialize if not already
      initializeRecorder();
      if (!recorderRef.current) {
         console.warn('[useRecorder] Recorder not initialized, cannot start recording.');
         setErrorMessage('Recorder not initialized. Please grant microphone permission first.');
         setStatus('permission-denied'); // Or 'idle' if permission flow is separate
         return;
      }
    }
    
    if (status === 'recording') {
      console.warn('[useRecorder] Already recording.');
      return;
    }

    // Clear previous recording
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setErrorMessage(null);

    try {
      console.log('[useRecorder] Attempting to start MicRecorder.');
      await recorderRef.current.start();
      setStatus('recording');
      console.log('[useRecorder] MicRecorder started successfully.');
    } catch (err) {
      console.error('[useRecorder] Error starting MicRecorder:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Could not start recording.');
      setStatus('error');
      // Attempt to map common errors to permission denied
      if (err instanceof Error && (err.name === 'NotAllowedError' || err.message.includes('Permission denied'))) {
        setStatus('permission-denied');
      }
    }
  }, [status, audioUrl, initializeRecorder]);

  const stopRecording = useCallback(async () => {
    console.log('[useRecorder] stopRecording called. Current status:', status);
    if (!recorderRef.current || status !== 'recording') {
      console.warn('[useRecorder] Recorder not active or not recording. Cannot stop.');
      return;
    }

    try {
      console.log('[useRecorder] Attempting to stop MicRecorder.');
      const [buffer, blob] = await recorderRef.current.stop().getMp3();
      console.log('[useRecorder] MicRecorder stopped. Blob type:', blob.type, 'Blob size:', blob.size);
      
      if (!(blob instanceof Blob)) {
        console.error('[useRecorder] getMp3 did not return a Blob:', blob);
        throw new Error('Recording did not produce a valid audio blob.');
      }
      if (blob.size === 0) {
        console.warn('[useRecorder] Recorded MP3 blob is empty.');
        // Potentially set an error message or handle as appropriate
        // For now, we will still set it, but this is a warning sign.
      }
      
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url); // For potential local playback
      setStatus('stopped');
      console.log('[useRecorder] MP3 Blob created. URL:', url);
    } catch (err) {
      console.error('[useRecorder] Error stopping MicRecorder or getting MP3:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Could not stop recording or process audio.');
      setStatus('error');
    }
  }, [status]);

  const resetRecorder = useCallback(() => {
    console.log('[useRecorder] resetRecorder called.');
    if (recorderRef.current && status === 'recording') {
      // Try to stop an ongoing recording gracefully
      recorderRef.current.stop().getMp3().then(() => { // Call getMp3() and then() on its promise
        console.log('[useRecorder] Ongoing recording stopped and processed during reset.');
      }).catch((e: any) => {
        console.warn('[useRecorder] Error stopping/processing ongoing recording during reset:', e);
      });
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    recorderRef.current = null; // Let garbage collector handle the old instance
    setAudioBlob(null);
    setAudioUrl(null);
    setStatus('idle');
    setErrorMessage(null);
    console.log('[useRecorder] Recorder reset to idle state.');
    // No explicit stream to stop with MicRecorder, it manages its own.
  }, [status, audioUrl]);
  
  // Cleanup effect to reset recorder on unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.activeStream) {
        // If there's an active stream (implies recording or permission granted)
        // try to stop tracks to release microphone.
        // MicRecorder doesn't expose tracks directly, so this is a bit of a guess.
        // A more robust solution would be for MicRecorder to have a .close() or .release() method.
        try {
            const stream = recorderRef.current.activeStream;
            if (stream && typeof stream.getTracks === 'function') {
                 stream.getTracks().forEach((track: any) => track.stop());
                 console.log('[useRecorder] Active media stream tracks stopped on unmount.');
            }
        } catch (e) {
            console.warn('[useRecorder] Could not stop media stream tracks on unmount:', e);
        }
      }
      // Reset other states if needed
      console.log('[useRecorder] Cleaned up on unmount.');
    };
  }, []);

  return {
    status,
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