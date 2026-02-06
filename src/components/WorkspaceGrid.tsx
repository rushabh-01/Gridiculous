import { useState } from "react";
import { DraggablePanel } from "./DraggablePanel";
import { AppPanel } from "./AppPanel";
import { Layout, AppInstance, PanelSettings } from "@/types/layout";

interface WorkspaceGridProps {
  layout: Layout | undefined;
  onUpdateLayout: (layout: Layout) => void;
  onOpenAppInserter: (panelId?: string) => void;
}

const DEFAULT_SETTINGS: PanelSettings = {
  viewMode: 'default',
  zoom: 1,
};

export const WorkspaceGrid = ({ layout, onUpdateLayout, onOpenAppInserter }: WorkspaceGridProps) => {
  if (!layout) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-sm text-muted-foreground">No layout selected</p>
          <p className="text-xs text-muted-foreground">
            Create or load a layout to get started
          </p>
        </div>
      </div>
    );
  }

  const handleRemoveApp = (panelId: string) => {
    const updatedPanels = layout.panels.map((p) =>
      p.id === panelId ? { ...p, app: null } : p
    );
    onUpdateLayout({ ...layout, panels: updatedPanels });
  };

  const handleSettingsChange = (panelId: string, settings: PanelSettings) => {
    const updatedPanels = layout.panels.map((p) =>
      p.id === panelId ? { ...p, settings } : p
    );
    onUpdateLayout({ ...layout, panels: updatedPanels });
  };

  const handleSwapPanels = (sourcePanelId: string, targetPanelId: string) => {
    const sourcePanel = layout.panels.find(p => p.id === sourcePanelId);
    const targetPanel = layout.panels.find(p => p.id === targetPanelId);
    
    if (!sourcePanel || !targetPanel) return;
    
    const updatedPanels = layout.panels.map((p) => {
      if (p.id === sourcePanelId) {
        return { ...p, app: targetPanel.app, settings: targetPanel.settings };
      }
      if (p.id === targetPanelId) {
        return { ...p, app: sourcePanel.app, settings: sourcePanel.settings };
      }
      return p;
    });

    onUpdateLayout({ ...layout, panels: updatedPanels });
  };

  const renderAppPanel = (panel: typeof layout.panels[0]) => (
    <DraggablePanel
      panelId={panel.id}
      onSwap={handleSwapPanels}
    >
      <AppPanel
        app={panel.app}
        settings={panel.settings || DEFAULT_SETTINGS}
        onSettingsChange={(settings) => handleSettingsChange(panel.id, settings)}
        onRemoveApp={() => handleRemoveApp(panel.id)}
        onAddApp={() => onOpenAppInserter(panel.id)}
        onEditApp={() => onOpenAppInserter(panel.id)}
      />
    </DraggablePanel>
  );

  const gridConfig = layout.gridConfig;

  // Custom layout with grid config
  if (gridConfig?.rowsConfig) {
    const isColumnBased = gridConfig.isColumnBased;
    
    if (isColumnBased) {
      // Column-based layout: columns contain rows
      let panelIndex = 0;
      return (
        <div className="h-full w-full p-2">
          <div className="flex gap-2 h-full">
            {gridConfig.rowsConfig.map((rowCount, colIndex) => (
              <div 
                key={colIndex} 
                className="flex-1 flex flex-col gap-2 min-w-0"
              >
                {Array.from({ length: rowCount }, (_, rowIndex) => {
                  const panel = layout.panels[panelIndex++];
                  return panel ? (
                    <div 
                      key={panel.id} 
                      className="flex-1 min-h-0 overflow-hidden"
                    >
                      {renderAppPanel(panel)}
                    </div>
                  ) : null;
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Row-based layout: rows contain columns
    let panelIndex = 0;
    return (
      <div className="h-full w-full p-2">
        <div className="flex flex-col gap-2 h-full">
          {gridConfig.rowsConfig.map((columnCount, rowIndex) => (
            <div 
              key={rowIndex} 
              className="flex-1 flex gap-2 min-h-0"
            >
              {Array.from({ length: columnCount }, (_, colIndex) => {
                const panel = layout.panels[panelIndex++];
                return panel ? (
                  <div 
                    key={panel.id} 
                    className="flex-1 min-w-0 overflow-hidden"
                  >
                    {renderAppPanel(panel)}
                  </div>
                ) : null;
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default layouts (1-6 panels without custom config)
  const { panelCount, panels } = layout;
  
  // Single panel
  if (panelCount === 1) {
    return (
      <div className="h-full w-full p-2">
        {renderAppPanel(panels[0])}
      </div>
    );
  }

  // 2 panels - horizontal split
  if (panelCount === 2) {
    return (
      <div className="h-full w-full p-2">
        <div className="flex gap-2 h-full">
          <div className="flex-1 min-w-0 overflow-hidden">
            {renderAppPanel(panels[0])}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            {renderAppPanel(panels[1])}
          </div>
        </div>
      </div>
    );
  }

  // 3 panels - horizontal split
  if (panelCount === 3) {
    return (
      <div className="h-full w-full p-2">
        <div className="flex gap-2 h-full">
          {panels.map((panel) => (
            <div key={panel.id} className="flex-1 min-w-0 overflow-hidden">
              {renderAppPanel(panel)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4 panels - 2x2 grid
  if (panelCount === 4) {
    return (
      <div className="h-full w-full p-2">
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {panels.map((panel) => (
            <div key={panel.id} className="min-w-0 min-h-0 overflow-hidden">
              {renderAppPanel(panel)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5 panels - 2 large + 3 stacked
  if (panelCount === 5) {
    return (
      <div className="h-full w-full p-2">
        <div className="flex gap-2 h-full">
          <div className="flex-1 min-w-0 overflow-hidden">
            {renderAppPanel(panels[0])}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            {renderAppPanel(panels[1])}
          </div>
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex-1 min-h-0 overflow-hidden">
              {renderAppPanel(panels[2])}
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {renderAppPanel(panels[3])}
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {renderAppPanel(panels[4])}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6 panels - 3x2 grid
  return (
    <div className="h-full w-full p-2">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
        {panels.map((panel) => (
          <div key={panel.id} className="min-w-0 min-h-0 overflow-hidden">
            {renderAppPanel(panel)}
          </div>
        ))}
      </div>
    </div>
  );
};
