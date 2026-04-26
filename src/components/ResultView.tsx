import { useState, useEffect } from "react";
import { parseMarkdown } from "@/lib/markdown";

interface ResultViewProps {
  markdown: string;
}

export default function ResultView({ markdown }: ResultViewProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const convert = async () => {
      const html = await parseMarkdown(markdown);
      setHtmlContent(html);
    };
    convert();
  }, [markdown]);

  return (
    <div className="animate-fade-in-up">
      {/* Markdown Result */}
      <div
        id="result-content"
        className="result-content prose prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-p:text-slate-400 prose-strong:text-white prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-code:text-indigo-400"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
