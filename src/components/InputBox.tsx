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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Input Container */}
      <div 
        className={`w-full relative group bg-[#0d0d0d] border transition-all duration-500 rounded-[30px] overflow-hidden ${
          isLoading ? "border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.2)]" : "border-white/10 hover:border-white/20 shadow-2xl"
        }`}
      >
        <div className="p-8 pb-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=""
            className="w-full min-h-[160px] max-h-[500px] bg-transparent text-white text-xl placeholder:text-slate-700 resize-none outline-none leading-relaxed transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between px-8 py-5 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleClear}
              disabled={isEmpty || isLoading}
              className="p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-all disabled:opacity-0"
              title="Clear text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <div className="w-px h-5 bg-white/10" />

            <span className={`text-sm font-medium ${isOverLimit ? "text-red-400" : "text-slate-500"}`}>
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>
        </div>

        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
            <div className="h-full bg-indigo-500 animate-[shimmer_2s_infinite]" style={{ width: '40%' }} />
          </div>
        )}
      </div>

      {/* Spacing and Premium Button */}
      <div className="mt-32 w-full flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isEmpty || isOverLimit || isLoading}
          className={`px-24 py-5 rounded-full font-bold text-2xl transition-all duration-500 border-2 active:scale-95 ${
            isEmpty || isOverLimit || isLoading
              ? "bg-white/10 text-white/20 border-white/5 cursor-not-allowed"
              : "bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(99,102,241,0.5)] hover:scale-105"
          }`}
        >
          {isLoading ? "처리 중..." : "요약"}
        </button>
      </div>
    </div>
  );
}
