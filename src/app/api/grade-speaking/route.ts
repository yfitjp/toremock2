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

    if (!transcribedText) {
      return NextResponse.json({ error: 'Transcribed text is required' }, { status: 400 });
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert English speaking evaluator for TOEFL-style exams.
                  Please evaluate the following transcribed speech based on the provided prompt (if any).
                  Consider aspects like fluency, pronunciation (as inferable from text), vocabulary, grammar, and task fulfillment.
                  Provide a score from 0 to 100, and constructive feedback.
                  Your response MUST be in strict JSON format, like this example:
                  {
                    "score": <number>,
                    "feedback": "<string>",
                    "positive_points": ["<string>", "..."],
                    "areas_for_improvement": ["<string>", "..."]
                  }
                  Ensure the output is a single, valid JSON object. Do not include any explanatory text before or after the JSON object.
                  If no specific prompt is provided, evaluate general speaking quality based on the transcription.
                  Remember to output only JSON.`,
      },
      {
        role: 'user',
        content: `Speaking Task Prompt: ${speakingPrompt || 'N/A (Evaluate general speaking quality based on transcription)'}\n\nTranscribed Speech to evaluate:\n${transcribedText}`,
      },
    ];

    console.log('[Grade Speaking API] Sending request to DeepSeek with messages:', JSON.stringify(messages, null, 2));

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat', // Writingと同じモデルを使用すると仮定
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.3, 
      max_tokens: 1000, 
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
        !Array.isArray(parsedResponse.areas_for_improvement)
       ) {
        console.error('[Grade Speaking API] Unexpected JSON structure from DeepSeek API:', parsedResponse);
        throw new Error('DeepSeek API JSON response does not contain all required fields (score, feedback, positive_points, areas_for_improvement) or they are of the wrong type.');
    }

    console.log('[Grade Speaking API] Successfully parsed response:', parsedResponse);

    return NextResponse.json({
      score: parsedResponse.score,
      feedback: parsedResponse.feedback,
      positive_points: parsedResponse.positive_points,
      areas_for_improvement: parsedResponse.areas_for_improvement,
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