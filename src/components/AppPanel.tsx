import { useState, useRef } from "react";
import { X, GripVertical, AlertCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppInstance, PanelSettings, VIEW_MODE_DIMENSIONS } from "@/types/layout";
import { PanelControls } from "./PanelControls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AppPanelProps {
  app: AppInstance | null;
  settings: PanelSettings;
  onSettingsChange: (settings: PanelSettings) => void;
  onRemoveApp: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onAddApp?: () => void;
  onEditApp?: () => void;
}

const DEFAULT_SETTINGS: PanelSettings = {
  viewMode: 'default',
  zoom: 1,
};

export const AppPanel = ({ 
  app, 
  settings = DEFAULT_SETTINGS,
  onSettingsChange,
  onRemoveApp, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onAddApp,
  onEditApp
}: AppPanelProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleRemove = () => {
    if (app?.isLocalFile) {
      document.exitFullscreen?.();
      setIsFullscreen(!isFullscreen);
      setShowDeleteConfirm(true);
    } else {
      if (!isFullscreen) {
      onRemoveApp();
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(!isFullscreen);
      onRemoveApp();
    }
    }
  };

  const confirmRemove = () => {
    onRemoveApp();
    setShowDeleteConfirm(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      panelRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const getContentStyle = () => {
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

  const renderContent = () => {
    if (!app) return null;

    // Local file with base64 data
    if (app.isLocalFile && app.fileData) {
      if (app.fileType?.startsWith('image/')) {
        return (
          <img 
            src={app.fileData} 
            alt={app.name}
            className="max-w-full max-h-full object-contain"
            style={getContentStyle()}
          />
        );
      }
      if (app.fileType === 'application/pdf') {
        return (
          <iframe
            src={app.fileData}
            className="border-0"
            style={getContentStyle()}
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
            style={getContentStyle()}
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
            className="border-0 bg-white"
            style={getContentStyle()}
            title={app.name}
          />
        );
      }
    }

    // Web URL
    return (
      <>
        {iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center p-6 max-w-sm">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="font-medium mb-2">Cannot embed this site</h3>
              <p className="text-xs text-muted-foreground mb-4">
                This website blocks iframe embedding for security reasons.
              </p>
              <Button 
                size="sm" 
                onClick={() => window.open(app.url, '_blank')}
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        )}
        <iframe
          src={app.url}
          className="border-0"
          style={getContentStyle()}
          title={app.name}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
          allow="camera; microphone; display-capture"
          onError={() => setIframeError(true)}
        />
      </>
    );
  };

  if (!app) {
    return (
      <div
        className="h-full w-full glass rounded-lg flex items-center justify-center border-2 border-dashed border-white/10 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onAddApp}
      >
        <p className="text-xs text-muted-foreground">Click to add an app or file</p>
      </div>
    );
  }

  const showHorizontalScroll = settings.viewMode !== 'default';

  return (
    <>
      <div 
        ref={panelRef}
        className={`h-full w-full flex flex-col glass rounded-lg overflow-hidden group ${
          isFullscreen ? 'fixed inset-0 z-50' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-1 bg-card/40 border-b border-white/5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="cursor-grab active:cursor-grabbing flex-shrink-0"
              draggable
              onDragStart={onDragStart}
            >
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium truncate">{app.name}</span>
            {app.isLocalFile && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary flex-shrink-0">
                Local
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <PanelControls
              settings={settings}
              onSettingsChange={onSettingsChange}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              appUrl={!app.isLocalFile ? app.url : undefined}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onEditApp}
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Edit"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div 
          className={`flex-1 relative ${showHorizontalScroll ? 'overflow-auto' : 'overflow-hidden'}`}
        >
          {renderContent()}
        </div>
      </div>

      {/* Delete confirmation for local files */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Local File?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{app.name}" from this panel and delete it from local storage.
              You'll need to re-upload the file if you want to use it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
