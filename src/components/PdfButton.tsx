"use client";

import { useState, useCallback } from "react";

interface PdfButtonProps {
  markdown: string;
}

import { marked } from "marked";

interface PdfButtonProps {
  markdown: string;
}

/**
 * 마크다운을 PDF용 HTML로 변환 (marked 사용)
 */
async function markdownToPdfHtml(md: string): Promise<string> {
  const renderer = new marked.Renderer();
  
  // PDF용 커스텀 스타일링
  renderer.table = (token) => `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead style="background: #f3f4f6;">
        <tr>${token.header.map(cell => `<th style="padding: 10px; border: 1px solid #e5e7eb;">${cell.text}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${token.rows.map(row => `<tr>${row.map(cell => `<td style="padding: 10px; border: 1px solid #e5e7eb;">${cell.text}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `;

  marked.setOptions({
    renderer,
    breaks: true,
    gfm: true,
  });

  return marked.parse(md);
}

export default function PdfButton({ markdown }: PdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  const generatePdf = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      
      // Extract title
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const docTitle = titleMatch ? titleMatch[1] : "StudyDev Technical Report";

      const parsedMarkdownHtml = await markdownToPdfHtml(markdown);
      
      const container = document.createElement("div");
      container.className = "pdf-content";
      
      const styleEl = document.createElement("style");
      styleEl.textContent = `
        .pdf-content { 
          font-size: 11pt; 
          width: 210mm;
          font-family: 'Inter', 'Noto Sans KR', sans-serif;
          color: #0f172a;
          background: #ffffff;
          line-height: 1.7;
        }
        .pdf-body-content { padding: 40px 50px; }
        .pdf-content h1 {
          font-size: 26pt; font-weight: 800; color: #0f172a;
          margin-top: 10px; margin-bottom: 24px; padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
          letter-spacing: -0.02em;
        }
        .pdf-content h2 {
          font-size: 19pt; font-weight: 700; color: #1e293b;
          margin-top: 40px; margin-bottom: 18px;
          letter-spacing: -0.01em;
        }
        .pdf-content h3 {
          font-size: 14pt; font-weight: 700; color: #334155;
          margin-top: 24px; margin-bottom: 12px;
        }
        .pdf-content p { margin-bottom: 16px; color: #334155; }
        .pdf-content table {
          width: 100%; border-collapse: collapse; margin: 30px 0;
          font-size: 10pt;
        }
        .pdf-content th {
          background: #f8fafc; color: #475569; font-weight: 700;
          padding: 12px; border: 1px solid #e2e8f0; text-align: left;
          text-transform: uppercase; font-size: 9pt; letter-spacing: 0.05em;
        }
        .pdf-content td {
          padding: 12px; border: 1px solid #e2e8f0; color: #475569;
        }
        .pdf-content pre {
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 20px; margin: 24px 0;
          font-family: 'JetBrains Mono', monospace; font-size: 9pt;
          line-height: 1.5;
        }
        .pdf-content code:not(pre code) {
          background: #f1f5f9; color: #6366f1; padding: 2px 6px;
          border-radius: 6px; font-size: 90%; font-weight: 500;
        }
        .pdf-content blockquote {
          border-left: 4px solid #6366f1; padding: 12px 24px;
          color: #64748b; font-style: italic; margin: 24px 0;
          background: #f8fafc; border-radius: 0 12px 12px 0;
        }
        .pdf-content ul, .pdf-content ol {
          margin-bottom: 20px; padding-left: 20px;
        }
        .pdf-content li {
          margin-bottom: 8px; color: #334155;
        }
      `;
      container.appendChild(styleEl);

      const bodyWrapper = document.createElement("div");
      bodyWrapper.className = "pdf-body-content";
      bodyWrapper.innerHTML = parsedMarkdownHtml;
      container.appendChild(bodyWrapper);

      document.body.appendChild(container);

      const safeTitle = docTitle.replace(/[^a-z0-9가-힣]/gi, '_').substring(0, 50);
      const fileName = `StudyDev_${safeTitle}_${new Date().getTime()}`;

      const options = {
        margin: 0,
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const 
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(options).from(container).save();
      document.body.removeChild(container);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  }, [markdown, isGenerating]);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={generatePdf}
        disabled={isGenerating}
        className="group flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-2xl hover:bg-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isGenerating ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF Download
          </>
        )}
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-400 border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-200"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}
