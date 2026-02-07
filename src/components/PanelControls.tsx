import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ViewMode, VIEW_MODE_DIMENSIONS, PanelSettings } from "@/types/layout";

interface PanelControlsProps {
  settings: PanelSettings;
  onSettingsChange: (settings: PanelSettings) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  appUrl?: string;
  onRefresh?: () => void;
  isLocalFile?: boolean;
}

export const PanelControls = ({
  settings,
  onSettingsChange,
  isFullscreen,
  onToggleFullscreen,
  appUrl,
  onRefresh,
  isLocalFile,
}: PanelControlsProps) => {
  const handleViewModeChange = (mode: ViewMode) => {
    onSettingsChange({ ...settings, viewMode: mode });
  };

  const handleZoomIn = () => {
    onSettingsChange({ ...settings, zoom: Math.min(settings.zoom + 0.1, 2) });
  };

  const handleZoomOut = () => {
    onSettingsChange({ ...settings, zoom: Math.max(settings.zoom - 0.1, 0.25) });
  };

  const handleResetZoom = () => {
    onSettingsChange({ ...settings, zoom: 1 });
  };

  const handleOpenExternal = () => {
    if (appUrl) {
      window.open(appUrl, '_blank');
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* View Mode Buttons */}
      <div className="flex items-center border-r border-white/10 pr-1 mr-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={settings.viewMode === 'default' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => handleViewModeChange('default')}
              className="h-5 w-5"
            >
              <Smartphone className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Default (Responsive)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={settings.viewMode === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => handleViewModeChange('tablet')}
              className="h-5 w-5"
            >
              <Tablet className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{VIEW_MODE_DIMENSIONS.tablet.label}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={settings.viewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => handleViewModeChange('desktop')}
              className="h-5 w-5"
            >
              <Monitor className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{VIEW_MODE_DIMENSIONS.desktop.label}</TooltipContent>
        </Tooltip>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center border-r border-white/10 pr-1 mr-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="h-5 w-5"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <span className="text-[10px] text-muted-foreground min-w-[32px] text-center">
          {Math.round(settings.zoom * 100)}%
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="h-5 w-5"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetZoom}
              className="h-5 w-5"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Zoom</TooltipContent>
        </Tooltip>
      </div>

      {/* Refresh Button - for web apps only */}
      {onRefresh && !isLocalFile && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="h-5 w-5"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
      )}

      {/* Fullscreen & External */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="h-5 w-5"
          >
            {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
      </Tooltip>

      {appUrl && !appUrl.startsWith('data:') && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenExternal}
              className="h-5 w-5"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open in New Tab</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
