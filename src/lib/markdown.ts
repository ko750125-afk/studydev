import { marked } from "marked";

/**
 * 마크다운을 안전한 HTML로 변환합니다.
 * 커스텀 렌더러를 통해 StudyDev 스타일을 적용합니다.
 */
export async function parseMarkdown(markdown: string): Promise<string> {
  const renderer = new marked.Renderer();

  // 테이블 스타일 커스텀
  renderer.table = (token) => {
    return `
      <div class="table-container my-6 overflow-x-auto rounded-xl border border-white/10">
        <table class="w-full text-sm text-left">
          <thead class="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
            ${token.header.map(cell => `<th>${cell.text}</th>`).join('')}
          </thead>
          <tbody class="divide-y divide-white/5 text-slate-400">
            ${token.rows.map(row => `<tr>${row.map(cell => `<td>${cell.text}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  // 코드 블록 스타일 커스텀
  renderer.code = (token) => {
    return `
      <div class="code-block my-6 rounded-2xl border border-white/10 overflow-hidden bg-black/40">
        <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <span class="text-xs font-mono text-slate-500">${token.lang || "code"}</span>
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
          </div>
        </div>
        <pre class="p-4 overflow-x-auto"><code class="language-${token.lang || "text"} text-sm font-mono text-indigo-300">${escapeHtml(token.text)}</code></pre>
      </div>
    `;
  };

  // 인라인 코드
  renderer.codespan = (token) => {
    return `<code class="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-sm font-mono">${token.text}</code>`;
  };

  // 인용문
  renderer.blockquote = (token) => {
    return `<blockquote class="pl-4 border-l-4 border-indigo-500/50 my-4 text-slate-400 italic bg-indigo-500/5 py-2 pr-4 rounded-r-lg">${token.text}</blockquote>`;
  };

  marked.setOptions({
    renderer,
    breaks: true,
    gfm: true,
  });

  return marked.parse(markdown);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
