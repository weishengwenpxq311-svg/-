import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_ANSWER = '我这边暂时有点卡住啦，可以稍后再问我一次。';
const USER_TAG = 'qi-website-visitor';

// Avoid edge-runtime caching; this is a stateful chat call.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ChatRequestBody {
  message?: unknown;
  conversationId?: unknown;
}

interface DifyResponse {
  answer?: string;
  conversation_id?: string;
  message_id?: string;
  // Dify returns many more fields; we only care about answer + conversation_id.
}

function safeString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function stripThinkingContent(text: string): string {
  const withoutClosedBlocks = text.replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, '');
  const lower = withoutClosedBlocks.toLowerCase();
  const openIndex = lower.lastIndexOf('<think');
  const closeIndex = lower.lastIndexOf('</think>');

  if (openIndex !== -1 && openIndex > closeIndex) {
    return withoutClosedBlocks.slice(0, openIndex).trim();
  }

  return withoutClosedBlocks.replace(/<\/?think\b[^>]*>/gi, '').trim();
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody = {};
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    body = {};
  }

  const message = safeString(body.message).trim();
  const conversationId = safeString(body.conversationId);

  if (!message) {
    return NextResponse.json({
      answer: FALLBACK_ANSWER,
      conversationId,
    });
  }

  const apiKey = process.env.DIFY_API_KEY;
  if (!apiKey) {
    console.warn('[qi-chat] DIFY_API_KEY is not set; returning fallback.');
    return NextResponse.json({
      answer: FALLBACK_ANSWER,
      conversationId,
    });
  }

  const baseUrl = (process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1').replace(/\/+$/, '');

  try {
    const difyRes = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user: USER_TAG,
      }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!difyRes.ok) {
      const detail = await difyRes.text().catch(() => '');
      console.warn('[qi-chat] Dify non-2xx:', difyRes.status, detail.slice(0, 300));
      return NextResponse.json({
        answer: FALLBACK_ANSWER,
        conversationId,
      });
    }

    const data = (await difyRes.json()) as DifyResponse;
    const answer = stripThinkingContent(safeString(data.answer)) || FALLBACK_ANSWER;
    const nextConversationId = safeString(data.conversation_id) || conversationId;

    return NextResponse.json({
      answer,
      conversationId: nextConversationId,
    });
  } catch (err) {
    console.warn('[qi-chat] Dify request failed:', err);
    return NextResponse.json({
      answer: FALLBACK_ANSWER,
      conversationId,
    });
  }
}
