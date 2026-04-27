"use client";

import { useState, useCallback, useEffect } from "react";
import InputBox from "@/components/InputBox";
import ResultView from "@/components/ResultView";
import PdfButton from "@/components/PdfButton";
import { useHistory } from "@/hooks/useHistory";
import { StudyDoc } from "@/types/history";
import HistorySidebar from "@/components/HistorySidebar";
import { useAuth } from "@/context/AuthContext";

type AppState = "idle" | "loading" | "success" | "error";

function NavigationBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, login, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[var(--neu-bg)]/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-slate-200 rounded-lg text-slate-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</span>
              <span className="text-sm font-bold text-slate-700">{user.displayName || user.email}</span>
            </div>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            )}
            <button 
              onClick={logout}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-[var(--neu-bg)] shadow-[4px_4px_8px_var(--neu-dark),-4px_-4px_8px_var(--neu-light)] hover:shadow-[inset_2px_2px_5px_var(--neu-dark),inset_-2px_-2px_5px_var(--neu-light)] text-red-500 transition-all"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--neu-bg)] shadow-[4px_4px_8px_var(--neu-dark),-4px_-4px_8px_var(--neu-light)] hover:shadow-[inset_2px_2px_5px_var(--neu-dark),inset_-2px_-2px_5px_var(--neu-light)] text-slate-700 font-bold transition-all group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="hidden sm:inline">구글로 로그인</span>
            <span className="sm:hidden">로그인</span>
          </button>
        )}
      </div>
    </nav>
  );
}

function HeroSection({ onSubmit, isLoading }: { onSubmit: (text: string) => void; isLoading: boolean }) {
  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in-up">
      <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-slate-800 text-center">
        APP OF DEV STUDY
      </h1>
      <div className="w-full">
        <InputBox onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

function ResultSection({ result, onReset }: { result: string; onReset: () => void }) {
  return (
    <div className="space-y-8 w-full animate-fade-in-up">
      <div className="flex items-center justify-between sticky top-20 z-30 py-4 bg-[var(--neu-bg)]/80 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-500 rounded-full" />
          추출된 지식 문서
        </h2>
        <div className="flex items-center gap-3">
          <PdfButton markdown={result} />
          <button 
            onClick={onReset}
            className="p-2.5 rounded-full bg-[var(--neu-bg)] shadow-[4px_4px_8px_var(--neu-dark),-4px_-4px_8px_var(--neu-light)] hover:shadow-[inset_2px_2px_5px_var(--neu-dark),inset_-2px_-2px_5px_var(--neu-light)] transition-all text-slate-600"
            title="Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="bg-[var(--neu-bg)] rounded-[40px] p-8 sm:p-12 shadow-[12px_12px_24px_var(--neu-dark),-12px_-12px_24px_var(--neu-light)]">
        <ResultView markdown={result} />
      </div>

      <div className="flex justify-center pb-20">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>맨 위로 이동</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ErrorSection({ error, onReset }: { error: string; onReset: () => void }) {
  return (
    <div className="w-full max-w-2xl mx-auto py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">오류가 발생했습니다</h2>
      <p className="text-slate-600">{error}</p>
      <button onClick={onReset} className="px-8 py-3 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all shadow-lg">
        다시 시도하기
      </button>
    </div>
  );
}

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { history, saveToHistory, deleteHistoryItem, clearHistory } = useHistory();

  const handleSubmit = useCallback(async (text: string) => {
    setState("loading");
    setError("");
    
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

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <main className="flex min-h-screen bg-[var(--neu-bg)] text-[var(--text-primary)] selection:bg-blue-500/20">
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
        <HistorySidebar 
          history={history} 
          onSelect={handleSelectHistory} 
          onDelete={deleteHistoryItem} 
          onClear={clearHistory} 
        />
      </div>

      <div className="flex-1 relative flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        <NavigationBar onToggleSidebar={toggleSidebar} />

        <div className={`flex-1 flex flex-col items-center px-6 pb-40 relative ${state === "idle" || state === "loading" ? "justify-center min-h-[95vh]" : "pt-24"}`}>
          <div className="w-full max-w-3xl relative z-10">
            {state === "idle" || state === "loading" ? (
              <HeroSection onSubmit={handleSubmit} isLoading={state === "loading"} />
            ) : state === "success" && result ? (
              <ResultSection result={result} onReset={handleReset} />
            ) : state === "error" ? (
              <ErrorSection error={error} onReset={handleReset} />
            ) : null}
          </div>
        </div>

        <footer className="px-6 py-10 border-t border-slate-200 text-center" />
      </div>
    </main>
  );
}
