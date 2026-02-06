import { useState } from "react";
import { cn } from "@/lib/utils";

interface DraggablePanelProps {
  panelId: string;
  children: React.ReactNode;
  onSwap: (sourcePanelId: string, targetPanelId: string) => void;
  className?: string;
}

export const DraggablePanel = ({ 
  panelId, 
  children, 
  onSwap,
  className 
}: DraggablePanelProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("panelId", panelId);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    
    // Add a slight delay to show dragging state
    setTimeout(() => {
      const el = e.currentTarget as HTMLElement;
      el.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set false if we're leaving the panel itself, not a child
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const sourcePanelId = e.dataTransfer.getData("panelId");
    if (sourcePanelId && sourcePanelId !== panelId) {
      onSwap(sourcePanelId, panelId);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "h-full w-full transition-all duration-200",
        isDragOver && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[0.98]",
        isDragging && "opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
};
