"use client";

import { StudyDoc } from "@/types/history";
import { formatDate } from "@/lib/utils";

interface HistorySidebarProps {
  history: StudyDoc[];
  onSelect: (doc: StudyDoc) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export default function HistorySidebar({
  history,
  onSelect,
  onDelete,
  onClear,
}: HistorySidebarProps) {
  return (
    <div className="w-72 h-full bg-[var(--neu-bg)] border-r border-slate-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">History</span>
          <button
            onClick={() => {
              if (window.confirm("모든 이력을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
                onClear();
              }
            }}
            disabled={history.length === 0}
            className="text-[10px] uppercase tracking-wider text-slate-400 hover:text-slate-800 transition-colors disabled:opacity-0"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="py-20 text-center px-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              최근 생성한 문서가 여기에 나타납니다.
            </p>
          </div>
        ) : (
          history.map((doc) => (
            <div
              key={doc.id}
              className="group relative flex items-center gap-3 p-3 rounded-2xl shadow-[inset_2px_2px_5px_var(--neu-dark),inset_-2px_-2px_5px_var(--neu-light)] transition-all duration-200 cursor-pointer mb-2"
              onClick={() => onSelect(doc)}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-500 truncate group-hover:text-slate-800 transition-colors">
                  {doc.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {formatDate(doc.createdAt)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("이 문서를 이력에서 삭제하시겠습니까?")) {
                    onDelete(doc.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
