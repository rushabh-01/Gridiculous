import { useState } from "react";
import { X, Maximize2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout, AppInstance, PanelSettings, VIEW_MODE_DIMENSIONS } from "@/types/layout";
import { PanelControls } from "./PanelControls";

interface MobilePanelViewProps {
  layout: Layout;
  onUpdateLayout: (layout: Layout) => void;
  onOpenAppInserter: (panelId?: string) => void;
}

const DEFAULT_SETTINGS: PanelSettings = {
  viewMode: 'default',
  zoom: 1,
};

export const MobilePanelView = ({ 
  layout, 
  onUpdateLayout, 
  onOpenAppInserter 
}: MobilePanelViewProps) => {
  const [expandedPanelId, setExpandedPanelId] = useState<string | null>(null);

  const handleRemoveApp = (panelId: string) => {
    const updatedPanels = layout.panels.map((p) =>
      p.id === panelId ? { ...p, app: null } : p
    );
    onUpdateLayout({ ...layout, panels: updatedPanels });
    setExpandedPanelId(null);
  };

  const handleSettingsChange = (panelId: string, settings: PanelSettings) => {
    const updatedPanels = layout.panels.map((p) =>
      p.id === panelId ? { ...p, settings } : p
    );
    onUpdateLayout({ ...layout, panels: updatedPanels });
  };

  const getContentStyle = (settings: PanelSettings) => {
    const { viewMode, zoom } = settings;
    const viewConfig = VIEW_MODE_DIMENSIONS[viewMode];
    
    if (viewMode === 'default') {
      return {
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        width: `${100 / zoom}%`,
        height: `${100 / zoom}%`,
      };
    }

    return {
      width: `${viewConfig.width}px`,
      minWidth: `${viewConfig.width}px`,
      transform: `scale(${zoom})`,
      transformOrigin: 'top left',
      height: `${100 / zoom}%`,
    };
  };

  const renderContent = (app: AppInstance, settings: PanelSettings) => {
    if (app.isLocalFile && app.fileData) {
      if (app.fileType?.startsWith('image/')) {
        return (
          <img 
            src={app.fileData} 
            alt={app.name}
            className="max-w-full max-h-full object-contain"
            style={getContentStyle(settings)}
          />
        );
      }
      if (app.fileType === 'application/pdf') {
        return (
          <iframe
            src={app.fileData}
            className="border-0 w-full h-full"
            style={getContentStyle(settings)}
            title={app.name}
          />
        );
      }
      if (app.fileType?.startsWith('video/')) {
        return (
          <video 
            src={app.fileData} 
            controls 
            className="max-w-full max-h-full"
            style={getContentStyle(settings)}
          />
        );
      }
      if (app.fileType?.startsWith('audio/')) {
        return (
          <div className="flex items-center justify-center h-full">
            <audio src={app.fileData} controls />
          </div>
        );
      }
      if (app.fileType?.startsWith('text/')) {
        return (
          <iframe
            src={app.fileData}
            className="border-0 bg-white w-full h-full"
            style={getContentStyle(settings)}
            title={app.name}
          />
        );
      }
    }

    return (
      <iframe
        src={app.url}
        className="border-0 w-full h-full"
        style={getContentStyle(settings)}
        title={app.name}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
        allow="camera; microphone; display-capture"
      />
    );
  };

  const expandedPanel = layout.panels.find(p => p.id === expandedPanelId);

  // Fullscreen expanded view
  if (expandedPanel) {
    const settings = expandedPanel.settings || DEFAULT_SETTINGS;
    const showHorizontalScroll = settings.viewMode !== 'default';

    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-card/80 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium truncate">
              {expandedPanel.app?.name || "Empty Panel"}
            </span>
            {expandedPanel.app?.isLocalFile && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                Local
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {expandedPanel.app && (
              <>
                <PanelControls
                  settings={settings}
                  onSettingsChange={(s) => handleSettingsChange(expandedPanel.id, s)}
                  isFullscreen={false}
                  onToggleFullscreen={() => {}}
                  appUrl={!expandedPanel.app.isLocalFile ? expandedPanel.app.url : undefined}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenAppInserter(expandedPanel.id)}
                  className="h-7 text-xs"
                >
                  Edit
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpandedPanelId(null)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 ${showHorizontalScroll ? 'overflow-auto' : 'overflow-hidden'}`}>
          {expandedPanel.app ? (
            renderContent(expandedPanel.app, settings)
          ) : (
            <div 
              className="h-full flex items-center justify-center"
              onClick={() => onOpenAppInserter(expandedPanel.id)}
            >
              <p className="text-sm text-muted-foreground">Tap to add an app or file</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tile grid view
  return (
    <div className="h-full w-full p-2 overflow-y-auto">
      <div className="grid grid-cols-2 gap-2">
        {layout.panels.map((panel) => (
          <div
            key={panel.id}
            onClick={() => setExpandedPanelId(panel.id)}
            className="aspect-video glass rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group"
          >
            {panel.app ? (
              <div className="relative h-full w-full">
                {/* Thumbnail preview */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {panel.app.isLocalFile && panel.app.fileType?.startsWith('image/') ? (
                    <img 
                      src={panel.app.fileData} 
                      alt={panel.app.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                  )}
                </div>

                {/* Overlay with info */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors">
                  <Maximize2 className="h-6 w-6 mb-2 opacity-70" />
                  <span className="text-xs font-medium truncate px-2 max-w-full">
                    {panel.app.name}
                  </span>
                  {panel.app.isLocalFile && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-primary/30 text-primary mt-1">
                      Local
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-white/10">
                <p className="text-[10px] text-muted-foreground">Empty</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
