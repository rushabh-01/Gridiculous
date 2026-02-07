export type ViewMode = 'default' | 'tablet' | 'desktop';

export interface PanelSettings {
  viewMode: ViewMode;
  zoom: number;
}

export interface AppInstance {
  id: string;
  name: string;
  url: string;
  icon?: string;
  isLocalFile?: boolean;
  fileData?: string; // base64 for local files
  fileType?: string;
}

export interface LayoutPanel {
  id: string;
  app: AppInstance | null;
  settings?: PanelSettings;
  note?: string; // Sticky note for the panel
}

export interface Layout {
  id: string;
  name: string;
  panelCount: number;
  panels: LayoutPanel[];
  createdAt: number;
  gridConfig?: {
    rowsConfig: number[];
    isColumnBased?: boolean;
  };
}

export const STORAGE_KEY = "multiapp-layouts";
export const ACTIVE_LAYOUT_KEY = "multiapp-active-layout";

export const VIEW_MODE_DIMENSIONS: Record<ViewMode, { width: number; label: string }> = {
  default: { width: 0, label: 'Default' },
  tablet: { width: 768, label: 'Tablet (768px)' },
  desktop: { width: 1440, label: 'Desktop (1440px)' },
};
