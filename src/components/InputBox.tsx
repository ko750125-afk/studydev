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
        className={`w-full relative group transition-all duration-500 rounded-[30px] overflow-hidden neu-concave ${
          isLoading ? "shadow-[inset_0_0_20px_rgba(49,130,206,0.2)]" : ""
        }`}
      >
        <div style={{ paddingTop: '40px', paddingLeft: '56px', paddingRight: '32px', paddingBottom: '16px' }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="요약할 내용을 붙여넣으세요..."
            className="w-full min-h-[120px] max-h-[500px] bg-transparent text-slate-800 text-xl placeholder:text-slate-300 resize-none outline-none leading-relaxed transition-all caret-indigo-600"
            style={{ caretColor: '#4f46e5' }}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-200/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleClear}
              disabled={isEmpty || isLoading}
              className="p-2 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-all disabled:opacity-0"
              title="Clear text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <div className="w-px h-5 bg-slate-200" />

            <span className={`text-sm font-medium ${isOverLimit ? "text-red-500" : "text-slate-400"}`}>
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>
        </div>

        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-200 overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }} />
          </div>
        )}
      </div>

      {/* Repositioned Button Section: Bottom Right */}
      <div className="flex justify-end w-full mt-10 pb-20">
        <button
          onClick={handleSubmit}
          disabled={isEmpty || isOverLimit || isLoading}
          className="premium-summary-button px-20 py-5 text-2xl"
        >
          {isLoading ? "처리 중..." : "요약"}
        </button>
      </div>
    </div>
  );
}
