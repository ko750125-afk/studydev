"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface InputBoxProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const MAX_CHARS = 15000;

export default function InputBox({ onSubmit, isLoading }: InputBoxProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = text.trim().length === 0;

  const handleSubmit = useCallback(() => {
    if (!isEmpty && !isOverLimit && !isLoading) {
      onSubmit(text);
    }
  }, [text, isEmpty, isOverLimit, isLoading, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleClear = useCallback(() => {
    setText("");
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  // Auto-resize textarea logic (optional but nice)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className={`relative group bg-[#161616] border transition-all duration-500 rounded-[32px] overflow-hidden ${
          isLoading ? "border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]" : "border-white/5 hover:border-white/10 shadow-2xl"
        }`}
      >
        {/* Input Area */}
        <div className="p-6 pb-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=""
            className="w-full min-h-[120px] max-h-[400px] bg-transparent text-slate-100 text-lg sm:text-xl placeholder:text-slate-600 resize-none outline-none leading-relaxed transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Bottom Utility Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.03] bg-white/[0.01]">
          <div className="flex items-center gap-2">
            {/* Action Icons */}
            <button 
              onClick={handleClear}
              disabled={isEmpty || isLoading}
              className="p-2.5 rounded-full hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all disabled:opacity-0"
              title="Clear text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <div className="w-px h-4 bg-white/5 mx-1" />

            {/* Char Counter */}
            <span className={`text-xs font-medium ${isOverLimit ? "text-red-400" : "text-slate-600"}`}>
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>

          <div className="text-[10px] text-slate-700 font-mono tracking-widest uppercase opacity-50">
            Secure AI Processing
          </div>
        </div>

        {/* Loading Progress Bar Line (Top of the box) */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
            <div className="h-full bg-indigo-500 animate-[shimmer_1.5s_infinite]" style={{ width: '50%' }} />
          </div>
        )}
      </div>

      {/* Standalone Action Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isEmpty || isOverLimit || isLoading}
          className={`group relative flex items-center gap-3 px-12 py-5 rounded-[24px] font-bold text-lg transition-all duration-500 overflow-hidden ${
            isEmpty || isOverLimit || isLoading
              ? "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
              : "bg-white text-black hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          }`}
        >
          {/* Shine Effect */}
          {!isEmpty && !isOverLimit && !isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
          )}

          {isLoading ? (
            <>
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="tracking-tight">지식 추출 중...</span>
            </>
          ) : (
            <>
              <span className="relative z-10 tracking-tight">요약 정리 시작</span>
              <div className="relative z-10 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Shortcut Info */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold opacity-40">
          Press <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 mx-0.5">Ctrl</span> + <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 mx-0.5">Enter</span> to trigger
        </p>
      </div>
    </div>
  );
}
