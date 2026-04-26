import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

const MAX_INPUT_LENGTH = 15000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body as { text?: string };

    // 입력 검증
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "텍스트를 입력해주세요." },
        { status: 400 }
      );
    }

    if (text.trim().length === 0) {
      return NextResponse.json(
        { error: "빈 텍스트는 처리할 수 없습니다." },
        { status: 400 }
      );
    }

    if (text.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `입력 텍스트가 너무 깁니다. 최대 ${MAX_INPUT_LENGTH.toLocaleString()}자까지 가능합니다.`,
        },
        { status: 400 }
      );
    }

    // Gemini API 호출
    const result = await callGemini(text);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Summarize API error:", error);

    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
