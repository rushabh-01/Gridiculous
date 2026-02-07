import { useState, useCallback, useRef } from "react";
import { Layout } from "@/types/layout";

interface HistoryState {
  past: Layout[];
  future: Layout[];
}

export const useLayoutHistory = (
  initialLayout: Layout | undefined,
  onUpdate: (layout: Layout) => void
) => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    future: [],
  });
  
  const lastLayoutRef = useRef<Layout | undefined>(initialLayout);

  const pushToHistory = useCallback((newLayout: Layout) => {
    if (lastLayoutRef.current) {
      setHistory((prev) => ({
        past: [...prev.past.slice(-19), lastLayoutRef.current!], // Keep last 20 states
        future: [], // Clear redo stack on new action
      }));
    }
    lastLayoutRef.current = newLayout;
    onUpdate(newLayout);
  }, [onUpdate]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      
      const newPast = [...prev.past];
      const previousState = newPast.pop()!;
      
      const newHistory = {
        past: newPast,
        future: lastLayoutRef.current 
          ? [lastLayoutRef.current, ...prev.future.slice(0, 19)] 
          : prev.future,
      };
      
      lastLayoutRef.current = previousState;
      onUpdate(previousState);
      
      return newHistory;
    });
  }, [onUpdate]);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      
      const newFuture = [...prev.future];
      const nextState = newFuture.shift()!;
      
      const newHistory = {
        past: lastLayoutRef.current 
          ? [...prev.past.slice(-19), lastLayoutRef.current] 
          : prev.past,
        future: newFuture,
      };
      
      lastLayoutRef.current = nextState;
      onUpdate(nextState);
      
      return newHistory;
    });
  }, [onUpdate]);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Sync ref when layout changes externally
  const syncLayout = useCallback((layout: Layout | undefined) => {
    lastLayoutRef.current = layout;
  }, []);

  return {
    pushToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    syncLayout,
  };
};
