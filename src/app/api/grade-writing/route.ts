import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// DeepSeek APIクライアントの初期化
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com', // または 'https://api.deepseek.com/v1'
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const essayText = body.essayText as string | undefined;
    const essayPrompt = body.essayPrompt as string | undefined; // 問題の指示文

    if (!essayText) {
      return NextResponse.json({ error: 'Essay text is required' }, { status: 400 });
    }

    // DeepSeek APIへのリクエストメッセージを構築
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert English writing evaluator for TOEFL-style exams.
                  Please evaluate the following essay based on the provided prompt (if any).
                  Provide a score from 0 to 100, and constructive feedback.
                  Your response MUST be in strict JSON format, like this example:
                  {
                    "score": <number>,
                    "feedback": "<string>",
                    "positive_points": ["<string>", "..."],
                    "areas_for_improvement": ["<string>", "..."]
                  }
                  Ensure the output is a single, valid JSON object. Do not include any explanatory text before or after the JSON object.
                  Focus on clarity, organization, grammar, vocabulary, and task fulfillment.
                  If no specific prompt is provided for the essay, evaluate its general writing quality.
                  Remember to output only JSON.`, // "json" を含める
      },
      {
        role: 'user',
        content: `Essay Prompt: ${essayPrompt || 'N/A (Evaluate general writing quality)'}\n\nEssay to evaluate:\n${essayText}`,
      },
    ];

    console.log('[Grade API] Sending request to DeepSeek with messages:', JSON.stringify(messages, null, 2));

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      response_format: { type: "json_object" }, // JSONモードを有効化
      temperature: 0.3, // 採点の一貫性を高めるため低めに設定
      max_tokens: 1000,  // 応答に必要な十分なトークン数を確保 (適宜調整)
      stream: false,
    });

    console.log('[Grade API] Received raw response from DeepSeek:', JSON.stringify(completion, null, 2));

    const assistantResponse = completion.choices[0]?.message?.content;

    if (!assistantResponse) {
      console.error('[Grade API] No response content from DeepSeek API. Full completion:', completion);
      throw new Error('No response content from DeepSeek API');
    }

    // APIからのレスポンスが期待通りのJSON形式であることを確認・パース
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(assistantResponse);
    } catch (parseError: any) {
      console.error('[Grade API] Failed to parse DeepSeek API response as JSON. Response was:', assistantResponse);
      // DeepSeek API が JSON 以外に追加のテキストを返した場合のフォールバックを試みる (例: ```json ... ``` のようなマークダウンブロック)
      const jsonMatch = assistantResponse.match(/```json\\n([\s\S]*?)\\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedResponse = JSON.parse(jsonMatch[1]);
          console.log('[Grade API] Successfully parsed JSON from markdown block.');
        } catch (markdownParseError: any) {
          console.error('[Grade API] Failed to parse JSON even from markdown block. Markdown Parse Error:', markdownParseError.message);
          throw new Error(`DeepSeek API response was not valid JSON, even after attempting to extract from markdown. Parse error: ${markdownParseError.message}. Original response: ${assistantResponse}`);
        }
      } else {
        throw new Error(`DeepSeek API response was not valid JSON. Parse error: ${parseError.message}. Original response: ${assistantResponse}`);
      }
    }
    
    // レスポンスに必要なフィールドがあるか検証
    if (typeof parsedResponse.score !== 'number' || 
        typeof parsedResponse.feedback !== 'string' ||
        !Array.isArray(parsedResponse.positive_points) ||
        !Array.isArray(parsedResponse.areas_for_improvement)
       ) {
        console.error('[Grade API] Unexpected JSON structure from DeepSeek API:', parsedResponse);
        throw new Error('DeepSeek API JSON response does not contain all required fields (score, feedback, positive_points, areas_for_improvement) or they are of the wrong type.');
    }

    console.log('[Grade API] Successfully parsed response:', parsedResponse);

    return NextResponse.json({
      score: parsedResponse.score,
      feedback: parsedResponse.feedback,
      positive_points: parsedResponse.positive_points,
      areas_for_improvement: parsedResponse.areas_for_improvement,
      // llmRawResponseForDebug: completion, // デバッグ用に生のレスポンス全体を返すことも可能だが、本番では注意
    });

  } catch (error: any) {
    console.error('[Grade API] Error in grade-writing API:', error);
    let errorMessage = 'Failed to grade essay';
    let errorDetails = error.toString();

    if (error instanceof OpenAI.APIError) {
        errorMessage = error.message; // OpenAI SDK v4+ では error.message に詳細が含まれる
        errorDetails = JSON.stringify({
            status: error.status,
            headers: error.headers,
            error: error.error, // APIからのエラーオブジェクト
        });
        console.error('[Grade API] OpenAI APIError details:', errorDetails);
    } else if (error.message) {
        errorMessage = error.message;
    }
    
    return NextResponse.json({ 
        error: errorMessage, 
        details: errorDetails 
    }, { status: (error instanceof OpenAI.APIError && error.status) ? error.status : 500 });
  }
} 