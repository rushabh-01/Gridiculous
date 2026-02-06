import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LayoutManager } from "@/components/LayoutManager";
import { AddItemDialog } from "@/components/AddItemDialog";
import { WorkspaceGrid } from "@/components/WorkspaceGrid";
import { MobilePanelView } from "@/components/MobilePanelView";
import { useLayouts } from "@/hooks/useLayouts";
import { useLayoutSharing } from "@/hooks/useLayoutSharing";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppInstance } from "@/types/layout";

const Index = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [isLayoutManagerOpen, setIsLayoutManagerOpen] = useState(false);
  const [isAppInserterOpen, setIsAppInserterOpen] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const {
    layouts,
    activeLayout,
    addLayout,
    updateLayout,
    deleteLayout,
    setActiveLayout,
  } = useLayouts();

  // Handle incoming shared layouts from URL
  useLayoutSharing(addLayout, setActiveLayout);

  const handleAddApp = (
    name: string, 
    url: string, 
    isLocalFile?: boolean, 
    fileData?: string, 
    fileType?: string
  ) => {
    if (!activeLayout) return;

    const targetPanel = selectedPanelId 
      ? activeLayout.panels.find((p) => p.id === selectedPanelId)
      : activeLayout.panels.find((p) => !p.app);

    if (!targetPanel) {
      alert("No empty panels available. Remove an app first or create a new layout.");
      return;
    }

    const newApp: AppInstance = {
      id: `app-${Date.now()}`,
      name,
      url,
      isLocalFile,
      fileData,
      fileType,
    };

    const updatedPanels = activeLayout.panels.map((p) =>
      p.id === targetPanel.id ? { ...p, app: newApp } : p
    );

    updateLayout({ ...activeLayout, panels: updatedPanels });
    setSelectedPanelId(null);
  };

  const handleOpenAppInserter = (panelId?: string) => {
    if (panelId) {
      setSelectedPanelId(panelId);
    }
    setIsAppInserterOpen(true);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Navbar
        isOpen={isNavbarOpen}
        onToggle={() => setIsNavbarOpen(!isNavbarOpen)}
        onOpenLayoutManager={() => setIsLayoutManagerOpen(true)}
        onOpenAppInserter={() => setIsAppInserterOpen(true)}
      />

      <main
        className={`transition-all duration-300 ${
          isNavbarOpen ? "pt-12" : "pt-0"
        } h-full`}
      >
        {isMobile && activeLayout ? (
          <MobilePanelView 
            layout={activeLayout}
            onUpdateLayout={updateLayout}
            onOpenAppInserter={handleOpenAppInserter}
          />
        ) : (
          <WorkspaceGrid 
            layout={activeLayout} 
            onUpdateLayout={updateLayout}
            onOpenAppInserter={handleOpenAppInserter}
          />
        )}
      </main>

      <LayoutManager
        isOpen={isLayoutManagerOpen}
        onClose={() => setIsLayoutManagerOpen(false)}
        layouts={layouts}
        activeLayout={activeLayout}
        onAddLayout={addLayout}
        onDeleteLayout={deleteLayout}
        onSetActiveLayout={setActiveLayout}
      />

      <AddItemDialog
        isOpen={isAppInserterOpen}
        onClose={() => {
          setIsAppInserterOpen(false);
          setSelectedPanelId(null);
        }}
        onAddApp={handleAddApp}
      />
    </div>
  );
};

export default Index;
