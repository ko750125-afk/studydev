"use client";

import { useState, useCallback, useEffect } from "react";
import InputBox from "@/components/InputBox";
import ResultView from "@/components/ResultView";
import PdfButton from "@/components/PdfButton";
import { useHistory } from "@/hooks/useHistory";
import { StudyDoc } from "@/types/history";
import HistorySidebar from "@/components/HistorySidebar";

type AppState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { history, saveToHistory, deleteHistoryItem, clearHistory } = useHistory();

  const handleSubmit = useCallback(async (text: string) => {
    setState("loading");
    setError("");
    // We don't clear result immediately to allow "streaming" feel if possible, 
    // but here we just reset for the new one.
    
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
      saveToHistory(data.result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setState("error");
    }
  }, [saveToHistory]);

  const handleSelectHistory = useCallback((doc: StudyDoc) => {
    setResult(doc.markdown);
    setState("success");
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setResult("");
    setError("");
  }, []);

  return (
    <main className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
      {/* Sidebar Overlay for Mobile/Tablet or Toggleable */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <HistorySidebar 
          history={history} 
          onSelect={handleSelectHistory} 
          onDelete={deleteHistoryItem} 
          onClear={clearHistory} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.03]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-slate-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
              {/* Logo and text removed */}
            </div>
          </div>
          
          {/* Empty div to maintain justify-between if needed, or just remove if only logo is left */}
          <div />
        </nav>

        {/* Hero Section */}
        <div className={`flex-1 flex flex-col items-center px-6 pb-40 relative ${state === "idle" || state === "loading" ? "justify-center min-h-[90vh]" : "pt-20"}`}>
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.06] rounded-full blur-[150px] pointer-events-none" />

          <div className="w-full max-w-4xl relative z-10">
            {/* Conditional Rendering: Idle / Success / Error */}
            {state === "idle" || state === "loading" ? (
              <div className="text-center space-y-24 animate-fade-in-up">
                <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-white">
                  APP OF DEV STUDY
                </h1>
                
                <div className="w-full max-w-3xl mx-auto">
                  <InputBox onSubmit={handleSubmit} isLoading={state === "loading"} />
                </div>
              </div>
            ) : state === "success" && result ? (
              <div className="space-y-8 w-full animate-fade-in-up">
                <div className="flex items-center justify-between sticky top-20 z-30 py-4 bg-[#0a0a0a]/80 backdrop-blur-md">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full" />
                    추출된 지식 문서
                  </h2>
                  <div className="flex items-center gap-3">
                    <PdfButton markdown={result} />
                    <button 
                      onClick={handleReset}
                      className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-300"
                      title="New Document"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="bg-[#111111] border border-white/[0.03] rounded-[40px] p-8 sm:p-12 shadow-2xl">
                  <ResultView markdown={result} />
                </div>

                <div className="flex justify-center pb-20">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    <span>맨 위로 이동</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : state === "error" ? (
              <div className="w-full max-w-2xl mx-auto py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">오류가 발생했습니다</h2>
                <p className="text-slate-400">{error}</p>
                <button onClick={handleReset} className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-slate-200 transition-all">
                  다시 시도하기
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-10 border-t border-white/[0.03] text-center">
        </footer>
      </div>
    </main>
  );
}
