import { useState, useRef } from "react";
import { Link as LinkIcon, FileUp, Globe, File } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (name: string, url: string, isLocalFile?: boolean, fileData?: string, fileType?: string) => void;
}

const QUICK_APPS = [
  { name: "Google", url: "https://www.google.com/webhp?igu=1" },
  { name: "Wikipedia", url: "https://www.wikipedia.org" },
  { name: "YouTube", url: "https://www.youtube.com/embed/" },
  { name: "Bing", url: "https://www.bing.com" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com" },
  { name: "OpenAI", url: "https://openai.com" },
];

const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'text/html',
  'text/plain',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
];

export const AddItemDialog = ({ isOpen, onClose, onAddApp }: AddItemDialogProps) => {
  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [selectedTab, setSelectedTab] = useState("app");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddApp = () => {
    if (!appName.trim() || !appUrl.trim()) {
      toast.error("Please enter both name and URL");
      return;
    }

    if (!appUrl.startsWith("http://") && !appUrl.startsWith("https://")) {
      toast.error("URL must start with http:// or https://");
      return;
    }

    onAddApp(appName, appUrl);
    toast.success(`${appName} added!`);
    resetForm();
    onClose();
  };

  const handleQuickAdd = (name: string, url: string) => {
    onAddApp(name, url);
    toast.success(`${name} added!`);
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB for localStorage)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      onAddApp(file.name, base64Data, true, base64Data, file.type);
      toast.success(`${file.name} added!`);
      resetForm();
      onClose();
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setAppName("");
    setAppUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { resetForm(); onClose(); } }}>
      <DialogContent className="glass max-w-md border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg">Add to Workspace</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="app" className="gap-2">
              <Globe className="h-4 w-4" />
              Web App
            </TabsTrigger>
            <TabsTrigger value="file" className="gap-2">
              <File className="h-4 w-4" />
              Local File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="app" className="space-y-6 mt-4">
            {/* Manual entry */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Custom App</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="app-name" className="text-xs">
                    App Name
                  </Label>
                  <Input
                    id="app-name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., My Website"
                    className="glass h-9 text-xs"
                  />
                </div>

                <div>
                  <Label htmlFor="app-url" className="text-xs">
                    App URL
                  </Label>
                  <Input
                    id="app-url"
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                    placeholder="https://..."
                    className="glass h-9 text-xs"
                  />
                </div>

                <Button onClick={handleAddApp} className="w-full h-9 text-xs gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Add to Workspace
                </Button>
              </div>
            </div>

            {/* Quick add */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Quick Add (Embed-Friendly)</h3>
              <p className="text-xs text-muted-foreground">These sites allow iframe embedding</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_APPS.map((app) => (
                  <Button
                    key={app.name}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAdd(app.name, app.url)}
                    className="glass-hover h-9 text-xs justify-start"
                  >
                    {app.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-6 mt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Upload Local File</h3>
              <p className="text-xs text-muted-foreground">
                Files are stored in your browser's local storage (max 10MB).
                Supported: PDF, Images, Videos, Audio, HTML, Text
              </p>
              
              <div 
                className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">Click to browse files</p>
                <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={SUPPORTED_FILE_TYPES.join(',')}
                onChange={handleFileSelect}
              />
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Files are stored locally and will persist until you clear the panel. 
                Clearing a panel will prompt you before deleting stored files.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
