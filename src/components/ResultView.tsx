"use client";

import { useMemo } from "react";

interface ResultViewProps {
  markdown: string;
}

/**
 * 마크다운 텍스트를 HTML로 변환하는 간단한 파서
 * 외부 라이브러리 의존 없이 구현
 */
function parseMarkdown(md: string): string {
  let html = md;

  // 코드 블록 (```language ... ```)
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_match, lang, code) =>
      `<pre><code class="language-${lang || "text"}">${escapeHtml(code.trim())}</code></pre>`
  );

  // 인라인 코드
  html = html.replace(
    /`([^`]+)`/g,
    "<code>$1</code>"
  );

  // 테이블
  html = html.replace(
    /(?:^|\n)((?:\|[^\n]+\|\n)+)/g,
    (_match, tableBlock: string) => {
      const rows = tableBlock.trim().split("\n");
      if (rows.length < 2) return tableBlock;

      const headerCells = rows[0]
        .split("|")
        .filter((c) => c.trim())
        .map((c) => `<th>${c.trim()}</th>`)
        .join("");

      // rows[1]은 구분선 (---|---|---)
      const bodyRows = rows
        .slice(2)
        .map((row) => {
          const cells = row
            .split("|")
            .filter((c) => c.trim())
            .map((c) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    }
  );

  // 헤딩
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // 수평선
  html = html.replace(/^---$/gm, "<hr />");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // 리스트 (unordered)
  html = html.replace(/^[\-\*] (.+)$/gm, "<li>$1</li>");
  // 연속 li를 ul로 감싸기
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

  // 순서 리스트 (numbered) - 이미 ul로 감싸지지 않은 것들
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Blockquote
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // 단락: 빈 줄로 구분된 텍스트를 p 태그로 감싸기
  html = html.replace(
    /^(?!<[a-z])((?!<[a-z]).+)$/gm,
    (match) => {
      if (match.trim() === "") return "";
      return `<p>${match}</p>`;
    }
  );

  // 연속 빈 줄 정리
  html = html.replace(/\n{3,}/g, "\n\n");

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function ResultView({ markdown }: ResultViewProps) {
  const htmlContent = useMemo(() => parseMarkdown(markdown), [markdown]);

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: "0.2s" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">정리된 문서</h2>
          <p className="text-sm text-slate-400">
            AI가 추출한 개발 지식 문서입니다
          </p>
        </div>
      </div>

      {/* Markdown Result */}
      <div
        id="result-content"
        className="result-content bg-black/20 rounded-2xl p-6 border border-white/5"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
