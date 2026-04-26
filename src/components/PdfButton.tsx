"use client";

import { useState, useCallback } from "react";

interface PdfButtonProps {
  markdown: string;
}

/**
 * 마크다운을 PDF용 HTML로 변환
 */
function markdownToPdfHtml(md: string): string {
  let html = md;

  // 코드 블록
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_match, lang, code) =>
      `<pre><code class="language-${lang || "text"}">${escapeHtml(code.trim())}</code></pre>`
  );

  // 인라인 코드
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

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

  // Bold & Italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // 리스트
  html = html.replace(/^[\-\*] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Blockquote
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // 단락
  html = html.replace(
    /^(?!<[a-z])((?!<[a-z]).+)$/gm,
    (match) => {
      if (match.trim() === "") return "";
      return `<p>${match}</p>`;
    }
  );

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

export default function PdfButton({ markdown }: PdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Dynamic import (client-side only)
      const html2pdf = (await import("html2pdf.js")).default;

      const htmlContent = markdownToPdfHtml(markdown);

      // PDF용 임시 컨테이너 생성
      const container = document.createElement("div");
      container.className = "pdf-content";
      container.innerHTML = htmlContent;
      container.style.width = "210mm";
      container.style.fontFamily = "'Noto Sans KR', 'Inter', sans-serif";
      container.style.color = "#1a1a2e";
      container.style.background = "#ffffff";
      container.style.padding = "40px 50px";
      container.style.lineHeight = "1.75";

      // 스타일 시트 인라인 적용
      const styleEl = document.createElement("style");
      styleEl.textContent = `
        .pdf-content h1 {
          font-size: 22px; font-weight: 700; color: #1a1a2e;
          margin: 28px 0 14px; padding-bottom: 8px;
          border-bottom: 2px solid #667eea;
        }
        .pdf-content h2 {
          font-size: 17px; font-weight: 600; color: #2d2d44;
          margin: 22px 0 10px; padding-left: 10px;
          border-left: 3px solid #667eea;
        }
        .pdf-content h3 {
          font-size: 14px; font-weight: 600; color: #3d3d55;
          margin: 16px 0 8px;
        }
        .pdf-content p {
          font-size: 12px; color: #333; margin: 6px 0;
        }
        .pdf-content strong { color: #1a1a2e; }
        .pdf-content ul, .pdf-content ol {
          padding-left: 20px; font-size: 12px;
        }
        .pdf-content li { color: #333; margin: 3px 0; }
        .pdf-content code {
          font-family: 'JetBrains Mono', monospace;
          background: #f0f0ff; color: #4338ca;
          padding: 1px 5px; border-radius: 3px; font-size: 11px;
        }
        .pdf-content pre {
          background: #f5f5ff; border: 1px solid #e0e0f0;
          border-radius: 6px; padding: 12px; margin: 10px 0;
        }
        .pdf-content pre code {
          background: none; color: #1a1a2e; font-size: 10.5px;
        }
        .pdf-content table {
          width: 100%; border-collapse: collapse;
          margin: 14px 0; font-size: 11px;
        }
        .pdf-content th {
          background: #667eea; color: #fff;
          padding: 8px 12px; text-align: left;
          font-weight: 600; border: 1px solid #5a6fd6;
        }
        .pdf-content td {
          padding: 7px 12px; border: 1px solid #ddd; color: #333;
        }
        .pdf-content tr:nth-child(even) td {
          background: #f8f8ff;
        }
        .pdf-content blockquote {
          border-left: 3px solid #667eea;
          padding-left: 12px; color: #555;
        }
        .pdf-content hr {
          border: none; border-top: 1px solid #ddd; margin: 20px 0;
        }
      `;
      container.prepend(styleEl);

      document.body.appendChild(container);

      const now = new Date();
      const fileName = `dev-knowledge_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

      const options = {
        margin: [10, 10, 10, 10],
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(options).from(container).save();

      // 임시 컨테이너 제거
      document.body.removeChild(container);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  }, [markdown, isGenerating]);

  return (
    <div className="flex items-center gap-3">
      <button
        id="pdf-download-button"
        onClick={generatePdf}
        disabled={isGenerating}
        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold rounded-2xl hover:from-rose-600 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isGenerating ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            PDF 생성 중...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            PDF 다운로드
          </>
        )}
      </button>

      <button
        id="copy-button"
        onClick={() => {
          navigator.clipboard.writeText(markdown);
          const btn = document.getElementById("copy-button");
          if (btn) {
            btn.textContent = "✓ 복사됨!";
            setTimeout(() => {
              btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg> 마크다운 복사`;
            }, 2000);
          }
        }}
        className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-300 border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
        마크다운 복사
      </button>
    </div>
  );
}
