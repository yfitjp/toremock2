import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// DeepSeek APIクライアントの初期化 (環境変数は適宜変更の可能性あり)
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY, // Writingと同じAPIキーを使用すると仮定
  baseURL: 'https://api.deepseek.com', 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transcribedText = body.transcribedText as string | undefined;
    const speakingPrompt = body.speakingPrompt as string | undefined; // 問題の指示文
    const modelAnswer = body.modelAnswer as string | undefined; // modelAnswer を追加
    const questionContext = body.questionContext as string | undefined; // パッセージの内容データ
    const audioContext = body.audioContext as string | undefined; // 音声の内容データ

    if (!transcribedText) {
      return NextResponse.json({ error: 'Transcribed text is required' }, { status: 400 });
    }
    // modelAnswer のログ追加 (任意)
    console.log(`[Grade Speaking API DEBUG] Extracted modelAnswer (type: ${typeof modelAnswer}):`, modelAnswer);
    // questionContext と audioContext のログ追加
    console.log(`[Grade Speaking API DEBUG] Extracted questionContext (type: ${typeof questionContext}):`, questionContext);
    console.log(`[Grade Speaking API DEBUG] Extracted audioContext (type: ${typeof audioContext}):`, audioContext);

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert English speaking evaluator for TOEFL-style exams.
                  Please evaluate the following transcribed speech based on the provided prompt, model answer (if any), reading passage (questionContext), and lecture/audio script (audioContext).
                  The question context (reading passage) and audio context (lecture script) provide background information for the speaking task.
                  If a model answer is provided, use it as a benchmark for a 100% score and evaluate the user's speech in comparison.
                  Consider aspects like fluency, pronunciation (as inferable from text), vocabulary, grammar, task fulfillment, and accurate use of information from the provided contexts.
                  Provide a score from 0 to 100, and constructive feedback.
                  Your response MUST be in strict JSON format, like this example:
                  {
                    "score": <number>,
                    "feedback": "<string>",
                    "positive_points": ["<string>", "..."],
                    "areas_for_improvement": ["<string>", "..."],
                    "revised_transcription": "<string with the revised version of the transcribed speech, keeping original meaning but improving grammar, vocabulary, and natural phrasing.>"
                  }
                  Ensure the output is a single, valid JSON object. Do not include any explanatory text before or after the JSON object.
                  If no specific prompt is provided, evaluate general speaking quality based on the transcription, considering the context if available.
                  Remember to output only JSON.`, 
      },
      {
        role: 'user',
        content: `Speaking Task Prompt: ${speakingPrompt || 'N/A (Evaluate general speaking quality based on transcription)'}
Model Answer: ${modelAnswer || 'N/A'}
Reading Passage Context: ${questionContext || 'N/A'}
Lecture/Audio Context: ${audioContext || 'N/A'}

Transcribed Speech to evaluate:
${transcribedText}`,
      },
    ];

    console.log('[Grade Speaking API] Sending request to DeepSeek with messages:', JSON.stringify(messages, null, 2));

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat', 
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.5, 
      max_tokens: 3000, 
      stream: false,
    });

    console.log('[Grade Speaking API] Received raw response from DeepSeek:', JSON.stringify(completion, null, 2));

    const assistantResponse = completion.choices[0]?.message?.content;

    if (!assistantResponse) {
      console.error('[Grade Speaking API] No response content from DeepSeek API. Full completion:', completion);
      throw new Error('No response content from DeepSeek API');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(assistantResponse);
    } catch (parseError: any) {
      console.error('[Grade Speaking API] Failed to parse DeepSeek API response as JSON. Response was:', assistantResponse);
      const jsonMatch = assistantResponse.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedResponse = JSON.parse(jsonMatch[1]);
          console.log('[Grade Speaking API] Successfully parsed JSON from markdown block.');
        } catch (markdownParseError: any) {
          console.error('[Grade Speaking API] Failed to parse JSON even from markdown block. Markdown Parse Error:', markdownParseError.message);
          throw new Error(`DeepSeek API response was not valid JSON, even after attempting to extract from markdown. Parse error: ${markdownParseError.message}. Original response: ${assistantResponse}`);
        }
      } else {
        throw new Error(`DeepSeek API response was not valid JSON. Parse error: ${parseError.message}. Original response: ${assistantResponse}`);
      }
    }
    
    if (typeof parsedResponse.score !== 'number' || 
        typeof parsedResponse.feedback !== 'string' ||
        !Array.isArray(parsedResponse.positive_points) ||
        !Array.isArray(parsedResponse.areas_for_improvement) ||
        typeof parsedResponse.revised_transcription !== 'string'
       ) {
        console.error('[Grade Speaking API] Unexpected JSON structure from DeepSeek API:', parsedResponse);
        throw new Error('DeepSeek API JSON response does not contain all required fields (score, feedback, positive_points, areas_for_improvement, revised_transcription) or they are of the wrong type.');
    }

    console.log('[Grade Speaking API] Successfully parsed response:', parsedResponse);

    return NextResponse.json({
      score: parsedResponse.score,
      feedback: parsedResponse.feedback,
      positive_points: parsedResponse.positive_points,
      areas_for_improvement: parsedResponse.areas_for_improvement,
      revised_transcription: parsedResponse.revised_transcription,
    });

  } catch (error: any) {
    console.error('[Grade Speaking API] Error in grade-speaking API:', error);
    let errorMessage = 'Failed to grade speech';
    let errorDetails = error.toString();

    if (error instanceof OpenAI.APIError) {
        errorMessage = error.message;
        errorDetails = JSON.stringify({
            status: error.status,
            headers: error.headers,
            error: error.error,
        });
        console.error('[Grade Speaking API] OpenAI APIError details:', errorDetails);
    } else if (error.message) {
        errorMessage = error.message;
    }
    
    return NextResponse.json({ 
        error: errorMessage, 
        details: errorDetails 
    }, { status: (error instanceof OpenAI.APIError && error.status) ? error.status : 500 });
  }
} 