/**
 * Gemini API 호출 유틸리티
 * 서버 사이드에서만 사용 (API Key 보호)
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `[지시사항: 개발 지식 정리 및 문서화 규칙]

핵심 내용 추출:
개발 관련 내용(개념, 용어, 코드, 구조)만 추출하고
잡담, 질문, 감정 표현은 철저히 제거한다.

구조화된 정리:
- 제목은 기술 스택 또는 주제 단위로 분류
- 설명은 비유 없이 기술적으로 작성

출력 형식:

# [문서 제목]

## 1. 카테고리명

### 기술명 (한글 발음)

**정의:**
...

**특징:**
...

---

문서 마지막에 반드시 아래 표 추가:

## 용어 정리

| 용어 | 한글 발음 | IT 의미 |
|------|----------|--------|
| ... | ... | ... |

**추가 규칙:**
- 마크다운 형식으로 출력
- 코드 블록은 언어를 명시 (예: \`\`\`typescript)
- 불필요한 인사말, 요약 문구 제거
- 한글로 작성
- 기술 용어는 원문(영문) 유지하되 한글 발음 병기`;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

export async function callGemini(userInput: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일에 API 키를 추가하세요."
    );
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\n입력 데이터:\n${userInput}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API 오류 (${response.status}): ${errorText}`);
  }

  const data: GeminiResponse = await response.json();

  if (data.error) {
    throw new Error(`Gemini API 오류: ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini API에서 유효한 응답을 받지 못했습니다.");
  }

  return text;
}
