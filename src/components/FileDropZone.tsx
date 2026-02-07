import { useState, useCallback } from "react";
import { FileUp } from "lucide-react";
import { toast } from "sonner";

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

interface FileDropZoneProps {
  onFileDropped: (name: string, url: string, isLocalFile: boolean, fileData: string, fileType: string) => void;
  children: React.ReactNode;
  isEmpty?: boolean;
}

export const FileDropZone = ({ onFileDropped, children, isEmpty }: FileDropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only show drop zone for files, not panel drags
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're leaving the actual container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0]; // Only handle first file

    // Check file type
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      toast.error(`Unsupported file type: ${file.type || 'unknown'}`);
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      onFileDropped(file.name, base64Data, true, base64Data, file.type);
      toast.success(`${file.name} added!`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  }, [onFileDropped]);

  return (
    <div
      className="relative h-full w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drop overlay - only show when dragging files over an empty panel */}
      {isDragOver && isEmpty && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-primary/20 border-2 border-dashed border-primary rounded-lg backdrop-blur-sm transition-all">
          <FileUp className="h-10 w-10 text-primary mb-2 animate-bounce" />
          <p className="text-sm font-medium text-primary">Drop file here</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, Image, Video, Audio</p>
        </div>
      )}

      {/* Subtle indicator for non-empty panels */}
      {isDragOver && !isEmpty && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg pointer-events-none">
          <div className="bg-card/90 px-3 py-2 rounded-lg">
            <p className="text-xs font-medium text-primary">Drop to replace</p>
          </div>
        </div>
      )}
    </div>
  );
};
