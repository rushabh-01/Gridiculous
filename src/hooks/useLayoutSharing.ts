import { useEffect } from "react";
import { Layout, STORAGE_KEY, ACTIVE_LAYOUT_KEY } from "@/types/layout";
import { toast } from "sonner";

// Compress and encode layout data for URL
export const encodeLayoutForUrl = (layout: Layout): string => {
  try {
    const json = JSON.stringify(layout);
    const encoded = btoa(encodeURIComponent(json));
    return encoded;
  } catch (e) {
    console.error("Failed to encode layout:", e);
    return "";
  }
};

// Decode layout data from URL
export const decodeLayoutFromUrl = (encoded: string): Layout | null => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as Layout;
  } catch (e) {
    console.error("Failed to decode layout:", e);
    return null;
  }
};

// Generate shareable URL
export const generateShareableUrl = (layout: Layout): string => {
  const encoded = encodeLayoutForUrl(layout);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?layout=${encoded}`;
};

// Copy URL to clipboard
export const copyShareableLink = async (layout: Layout): Promise<boolean> => {
  const url = generateShareableUrl(layout);
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Shareable link copied to clipboard!");
    return true;
  } catch (e) {
    // Fallback for browsers that don't support clipboard API
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    toast.success("Shareable link copied to clipboard!");
    return true;
  }
};

// Hook to handle incoming shared layouts
export const useLayoutSharing = (
  addLayout: (layout: Layout) => void,
  setActiveLayout: (id: string | null) => void
) => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedLayout = params.get("layout");
    
    if (encodedLayout) {
      const layout = decodeLayoutFromUrl(encodedLayout);
      
      if (layout) {
        // Create a new unique ID for imported layout
        const importedLayout: Layout = {
          ...layout,
          id: `layout-imported-${Date.now()}`,
          name: `${layout.name} (Imported)`,
          createdAt: Date.now(),
        };
        
        // Check if local file data exists (won't work across devices)
        const hasLocalFiles = layout.panels.some(p => p.app?.isLocalFile);
        
        if (hasLocalFiles) {
          toast.warning("Some local files couldn't be imported. You'll need to re-upload them.");
          // Clear local file data that won't work
          importedLayout.panels = importedLayout.panels.map(p => {
            if (p.app?.isLocalFile) {
              return { ...p, app: null };
            }
            return p;
          });
        }
        
        addLayout(importedLayout);
        setActiveLayout(importedLayout.id);
        
        // Clean up URL
        window.history.replaceState({}, "", window.location.pathname);
        
        toast.success(`Layout "${layout.name}" imported successfully!`);
      } else {
        toast.error("Invalid layout link");
      }
    }
  }, [addLayout, setActiveLayout]);
};
