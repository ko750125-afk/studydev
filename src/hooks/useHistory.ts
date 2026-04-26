"use client";

import { useState, useEffect, useCallback } from "react";
import { StudyDoc } from "@/types/history";

const STORAGE_KEY = "studydev_history";
const MAX_HISTORY = 20;

export function useHistory() {
  const [history, setHistory] = useState<StudyDoc[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = useCallback((markdown: string) => {
    // Extract title from first heading or first line
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : markdown.split('\n')[0].substring(0, 30) || "Untitled Doc";

    const newDoc: StudyDoc = {
      id: crypto.randomUUID(),
      title,
      markdown,
      createdAt: Date.now(),
    };

    setHistory((prev) => {
      const updated = [newDoc, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newDoc;
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    saveToHistory,
    deleteHistoryItem,
    clearHistory,
  };
}
