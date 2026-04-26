"use client";

import { useState, useCallback } from "react";

interface InputBoxProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const MAX_CHARS = 15000;

export default function InputBox({ onSubmit, isLoading }: InputBoxProps) {
  const [text, setText] = useState("");

  const charCount = text.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;
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
  }, []);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              AI 대화 내용 입력
            </h2>
            <p className="text-sm text-slate-400">
              GPT, Claude 등과 나눈 대화를 붙여넣으세요
            </p>
          </div>
        </div>

        {/* Character Counter */}
        <div className="flex items-center gap-2">
          <div
            className={`counter-badge rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isOverLimit ? "!bg-red-500/20 !border-red-500/30 text-red-400" : "text-indigo-300"
            }`}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="input-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`여기에 AI와 나눈 대화 내용을 붙여넣으세요...\n\n예시:\n사용자: Next.js의 App Router에 대해 설명해줘\nAI: App Router는 Next.js 13에서 도입된...\n\n💡 Ctrl + Enter로 바로 변환할 수 있습니다.`}
          className="w-full h-64 bg-black/20 border border-white/10 rounded-2xl p-5 text-slate-200 text-sm leading-relaxed resize-none placeholder:text-slate-500 transition-all duration-300 hover:border-white/20 focus:border-indigo-500/50"
          disabled={isLoading}
        />

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isOverLimit
                ? "bg-red-500"
                : charPercentage > 80
                ? "bg-amber-500"
                : "bg-gradient-to-r from-indigo-500 to-purple-500"
            }`}
            style={{ width: `${Math.min(charPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Error Message */}
      {isOverLimit && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          입력 텍스트가 최대 길이를 초과했습니다.
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleClear}
          disabled={isEmpty || isLoading}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl border border-white/5 hover:border-white/15 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
        >
          초기화
        </button>

        <button
          id="submit-button"
          onClick={handleSubmit}
          disabled={isEmpty || isOverLimit || isLoading}
          className="btn-primary px-8 py-3 text-sm font-semibold text-white rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="loading-dots">
                <span />
                <span />
                <span />
              </div>
              분석 중...
            </>
          ) : (
            <>
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              지식 문서 생성
            </>
          )}
        </button>
      </div>
    </div>
  );
}
