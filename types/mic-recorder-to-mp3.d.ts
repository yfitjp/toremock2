declare module 'mic-recorder-to-mp3' {
  interface MicRecorderOptions {
    bitRate?: number;
    encoder?: string; // 'mp3' or 'wav'
    sampleRate?: number; // 8000 to 48000
  }

  class MicRecorder {
    constructor(options?: MicRecorderOptions);
    activeStream: MediaStream | null;
    start(): Promise<void>;
    stop(): {
      getMp3(): Promise<[Buffer, Blob]>;
      getWav(): Promise<[Buffer, Blob]>; // If wav encoder is used
      getBuffer(): Promise<Buffer[]>;    // Raw buffer
    };
    // Add other methods or properties if known and needed
  }

  export default MicRecorder;
} 