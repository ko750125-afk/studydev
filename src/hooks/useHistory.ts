"use client";

import { useState, useEffect, useCallback } from "react";
import { StudyDoc } from "@/types/history";
import { extractTitle } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const STORAGE_KEY = "studydev_history";
const MAX_HISTORY = 20;

export function useHistory() {
  const [history, setHistory] = useState<StudyDoc[]>([]);
  const { user } = useAuth();

  // Load history
  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        // Load from Firestore
        try {
          const historyRef = collection(db, "users", user.uid, "history");
          const q = query(historyRef, orderBy("createdAt", "desc"), limit(MAX_HISTORY));
          const querySnapshot = await getDocs(q);
          const docs = querySnapshot.docs.map(d => d.data() as StudyDoc);
          setHistory(docs);
        } catch (e) {
          console.error("Failed to load from Firestore", e);
        }
      } else {
        // Load from localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setHistory(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse history", e);
          }
        }
      }
    };

    loadHistory();
  }, [user]);

  const saveToHistory = useCallback(async (markdown: string) => {
    const title = extractTitle(markdown);
    const newDoc: StudyDoc = {
      id: crypto.randomUUID(),
      title,
      markdown,
      createdAt: Date.now(),
    };

    if (user) {
      // Save to Firestore
      try {
        const docRef = doc(db, "users", user.uid, "history", newDoc.id);
        await setDoc(docRef, newDoc);
        setHistory(prev => [newDoc, ...prev].slice(0, MAX_HISTORY));
      } catch (e) {
        console.error("Failed to save to Firestore", e);
      }
    } else {
      // Save to localStorage
      setHistory((prev) => {
        const updated = [newDoc, ...prev].slice(0, MAX_HISTORY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }

    return newDoc;
  }, [user]);

  const deleteHistoryItem = useCallback(async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "history", id));
        setHistory(prev => prev.filter(item => item.id !== id));
      } catch (e) {
        console.error("Failed to delete from Firestore", e);
      }
    } else {
      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [user]);

  const clearHistory = useCallback(async () => {
    if (user) {
      // In Firestore, we have to delete docs one by one or in batch
      // For simplicity, we just clear the state and rely on the user to delete or we can implement batch delete
      try {
        const historyRef = collection(db, "users", user.uid, "history");
        const querySnapshot = await getDocs(historyRef);
        const batch = writeBatch(db);
        querySnapshot.forEach((d) => {
          batch.delete(d.ref);
        });
        await batch.commit();
        setHistory([]);
      } catch (e) {
        console.error("Failed to clear Firestore history", e);
      }
    } else {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  return {
    history,
    saveToHistory,
    deleteHistoryItem,
    clearHistory,
  };
}
