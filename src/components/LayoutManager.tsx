import { useState } from "react";
import { Grid, Trash2, Plus, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, LayoutPanel } from "@/types/layout";
import { toast } from "sonner";
import { CustomLayoutCreator } from "./CustomLayoutCreator";
import { copyShareableLink } from "@/hooks/useLayoutSharing";

interface LayoutManagerProps {
  isOpen: boolean;
  onClose: () => void;
  layouts: Layout[];
  activeLayout: Layout | undefined;
  onAddLayout: (layout: Layout) => void;
  onDeleteLayout: (id: string) => void;
  onSetActiveLayout: (id: string | null) => void;
}

const LAYOUT_TEMPLATES = [
  { count: 1, label: "Single" },
  { count: 2, label: "Split 2" },
  { count: 3, label: "Split 3" },
  { count: 4, label: "Grid 4" },
  { count: 5, label: "Split 5" },
  { count: 6, label: "Grid 6" },
];

export const LayoutManager = ({
  isOpen,
  onClose,
  layouts,
  activeLayout,
  onAddLayout,
  onDeleteLayout,
  onSetActiveLayout,
}: LayoutManagerProps) => {
  const [layoutName, setLayoutName] = useState("");
  const [selectedPanelCount, setSelectedPanelCount] = useState(2);

  const createLayout = () => {
    if (!layoutName.trim()) {
      toast.error("Please enter a layout name");
      return;
    }

    const panels: LayoutPanel[] = Array.from({ length: selectedPanelCount }, (_, i) => ({
      id: `panel-${Date.now()}-${i}`,
      app: null,
    }));

    const newLayout: Layout = {
      id: `layout-${Date.now()}`,
      name: layoutName,
      panelCount: selectedPanelCount,
      panels,
      createdAt: Date.now(),
    };

    onAddLayout(newLayout);
    toast.success("Layout created!");
    setLayoutName("");
  };

  const createCustomLayout = (name: string, config: number[], isColumnBased?: boolean) => {
    const totalPanels = config.reduce((a, b) => a + b, 0);
    
    const panels: LayoutPanel[] = Array.from({ length: totalPanels }, (_, i) => ({
      id: `panel-${Date.now()}-${i}`,
      app: null,
    }));

    const newLayout: Layout = {
      id: `layout-${Date.now()}`,
      name,
      panelCount: totalPanels,
      panels,
      createdAt: Date.now(),
      gridConfig: { 
        rowsConfig: config,
        isColumnBased: isColumnBased || false 
      },
    };

    onAddLayout(newLayout);
    toast.success("Custom layout created!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass max-w-2xl border-white/10 flex flex-col max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10 flex-shrink-0">
          <DialogTitle className="text-lg">Manage Layouts</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="templates">Quick Templates</TabsTrigger>
              <TabsTrigger value="custom">Custom Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              {/* Create new layout */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Create New Layout</h3>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="layout-name" className="text-xs">
                      Layout Name
                    </Label>
                    <Input
                      id="layout-name"
                      value={layoutName}
                      onChange={(e) => setLayoutName(e.target.value)}
                      placeholder="e.g., My Workspace"
                      className="glass h-9 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Panel Count</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {LAYOUT_TEMPLATES.map(({ count, label }) => (
                        <Button
                          key={count}
                          variant={selectedPanelCount === count ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedPanelCount(count)}
                          className="h-16 flex flex-col gap-1 text-xs"
                        >
                          <Grid className="h-4 w-4" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={createLayout} 
                  className="w-full h-9 text-xs gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Layout
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom">
              <CustomLayoutCreator onCreateLayout={createCustomLayout} />
            </TabsContent>
          </Tabs>

          {/* Saved layouts */}
          <div className="space-y-3 mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-medium">Saved Layouts</h3>
            {layouts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No layouts yet. Create one above!
              </p>
            ) : (
              <div className="space-y-2">
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className={`glass glass-hover p-3 rounded-lg flex items-center justify-between ${
                      activeLayout?.id === layout.id ? "ring-1 ring-primary" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="text-xs font-medium">{layout.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {layout.panelCount} panel{layout.panelCount > 1 ? "s" : ""}
                        {layout.gridConfig?.rowsConfig && ` (${layout.gridConfig.isColumnBased ? "cols: " : "rows: "}${layout.gridConfig.rowsConfig.join("-")})`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyShareableLink(layout)}
                        className="h-7 w-7"
                        title="Share layout"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant={activeLayout?.id === layout.id ? "secondary" : "outline"}
                        size="sm"
                        onClick={() =>
                          onSetActiveLayout(activeLayout?.id === layout.id ? null : layout.id)
                        }
                        className="h-7 text-xs"
                      >
                        {activeLayout?.id === layout.id ? "Active" : "Load"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          onDeleteLayout(layout.id);
                          toast.success("Layout deleted");
                        }}
                        className="h-7 w-7"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
