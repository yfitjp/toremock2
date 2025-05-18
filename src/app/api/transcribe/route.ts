import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI APIキーを環境変数から取得
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  console.log('[api/transcribe] Received request');
  try {
    const body = await request.json();
    const audioUrl = body.audioUrl;

    if (!audioUrl) {
      console.log('[api/transcribe] Missing audioUrl in request body');
      return NextResponse.json({ error: 'Missing audioUrl' }, { status: 400 });
    }

    console.log(`[api/transcribe] audioUrl: ${audioUrl}`);

    // 音声ファイルをダウンロード
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      console.error(`[api/transcribe] Failed to download audio file from ${audioUrl}. Status: ${audioResponse.status}`);
      return NextResponse.json({ error: `Failed to download audio file. Status: ${audioResponse.status}` }, { status: 500 });
    }
    const audioBlob = await audioResponse.blob();
    // const audioBuffer = Buffer.from(await audioArrayBuffer); //  Node.js 環境では Buffer が使えるが、Vercel Edge Functions では ArrayBuffer の方が適切かもしれない。OpenAI SDKが何を期待するかに依存
    // OpenAI SDK v4.x は File-like オブジェクトを期待するため、BlobからFileオブジェクトを作成する
    // VercelのEdge環境では File API が利用可能
    const audioFile = new File([audioBlob], "audio.webm", { type: audioBlob.type });


    console.log('[api/transcribe] Audio file downloaded, attempting to transcribe with OpenAI...');

    // OpenAI APIを呼び出して文字起こしを実行
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: audioFile, // ダウンロードした音声ファイル
      model: 'whisper-1',
      // language: 'en', // 必要に応じて言語を指定
      // response_format: 'json', // デフォルトでjson
    });

    const transcription = transcriptionResponse.text;
    console.log(`[api/transcribe] Transcription successful: ${transcription}`);

    return NextResponse.json({ transcription });

  } catch (error) {
    console.error('[api/transcribe] Error processing request:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
} 