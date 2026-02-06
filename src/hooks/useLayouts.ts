import { useState, useEffect } from "react";
import { Layout, STORAGE_KEY, ACTIVE_LAYOUT_KEY } from "@/types/layout";

export const useLayouts = () => {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [activeLayoutId, setActiveLayoutId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLayouts(JSON.parse(stored));
    }
    const activeId = localStorage.getItem(ACTIVE_LAYOUT_KEY);
    if (activeId) {
      setActiveLayoutId(activeId);
    }
  }, []);

  const saveLayouts = (newLayouts: Layout[]) => {
    setLayouts(newLayouts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayouts));
  };

  const addLayout = (layout: Layout) => {
    const newLayouts = [...layouts, layout];
    saveLayouts(newLayouts);
  };

  const updateLayout = (layout: Layout) => {
    const newLayouts = layouts.map((l) => (l.id === layout.id ? layout : l));
    saveLayouts(newLayouts);
  };

  const deleteLayout = (id: string) => {
    const newLayouts = layouts.filter((l) => l.id !== id);
    saveLayouts(newLayouts);
    if (activeLayoutId === id) {
      setActiveLayoutId(null);
      localStorage.removeItem(ACTIVE_LAYOUT_KEY);
    }
  };

  const setActiveLayout = (id: string | null) => {
    setActiveLayoutId(id);
    if (id) {
      localStorage.setItem(ACTIVE_LAYOUT_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_LAYOUT_KEY);
    }
  };

  const activeLayout = layouts.find((l) => l.id === activeLayoutId);

  return {
    layouts,
    activeLayout,
    addLayout,
    updateLayout,
    deleteLayout,
    setActiveLayout,
  };
};
