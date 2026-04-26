"use client";

import { useState, useCallback } from "react";
import InputBox from "@/components/InputBox";
import ResultView from "@/components/ResultView";
import PdfButton from "@/components/PdfButton";

type AppState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async (text: string) => {
    setState("loading");
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "서버 오류가 발생했습니다.");
      }

      setResult(data.result);
      setState("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setState("error");
    }
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setResult("");
    setError("");
  }, []);

  return (
    <main className="flex-1">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Powered by Gemini AI
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="gradient-text">StudyDev</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            AI 대화를 <strong className="text-slate-200">개발 문서</strong>로
            자동 변환하고{" "}
            <strong className="text-slate-200">PDF</strong>로 저장하세요
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { icon: "⚡", label: "즉시 변환" },
              { icon: "📄", label: "A4 PDF" },
              { icon: "🔒", label: "API 키 보호" },
              { icon: "🇰🇷", label: "한글 지원" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-400"
              >
                <span>{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </header>

        {/* Input Section */}
        <section className="glass-card rounded-3xl p-6 sm:p-8 mb-8">
          <InputBox onSubmit={handleSubmit} isLoading={state === "loading"} />
        </section>

        {/* Loading State */}
        {state === "loading" && (
          <section className="glass-card rounded-3xl p-8 mb-8 text-center animate-fade-in-up">
            <div className="animate-float inline-block mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              AI가 지식을 추출하고 있습니다
            </h3>
            <p className="text-sm text-slate-400">
              대화 내용을 분석하여 구조화된 개발 문서를 생성 중...
            </p>
            <div className="mt-5">
              <div className="w-64 h-1.5 mx-auto bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-shimmer" />
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {state === "error" && (
          <section className="glass-card rounded-3xl p-6 sm:p-8 mb-8 border-red-500/20 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold mb-1">오류 발생</h3>
                <p className="text-sm text-red-300/80">{error}</p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </section>
        )}

        {/* Result Section */}
        {state === "success" && result && (
          <>
            <section className="glass-card rounded-3xl p-6 sm:p-8 mb-6">
              <ResultView markdown={result} />
            </section>

            {/* Action Bar */}
            <div className="flex items-center justify-between animate-fade-in-up">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-400 border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-200"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                새로 시작
              </button>
              <PdfButton markdown={result} />
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 mb-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="inline-flex items-center gap-2 text-xs text-slate-600">
            <span>Built with</span>
            <span className="text-indigo-400">Next.js</span>
            <span>•</span>
            <span className="text-purple-400">Gemini AI</span>
            <span>•</span>
            <span className="text-pink-400">html2pdf</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
