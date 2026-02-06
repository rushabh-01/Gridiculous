import { useEffect } from "react";
import { LayoutGrid, Plus, X, Keyboard, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavbarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenLayoutManager: () => void;
  onOpenAppInserter: () => void;
}

export const Navbar = ({ isOpen, onToggle, onOpenLayoutManager, onOpenAppInserter }: NavbarProps) => {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + L = Layouts
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        onOpenLayoutManager();
      }
      // Ctrl/Cmd + K = Add Item
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenAppInserter();
      }
      // Ctrl/Cmd + B = Toggle Navbar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenLayoutManager, onOpenAppInserter, onToggle]);

  return (
    <>
      {/* Always-visible toggle button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="fixed top-3 left-3 z-50 glass glass-hover glow h-8 w-8 rounded-full"
          >
            {isOpen ? <X className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isOpen ? "Hide navbar" : "Show navbar"} <kbd className="ml-2 text-[10px] opacity-60">⌘B</kbd>
        </TooltipContent>
      </Tooltip>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 h-12 glass border-b border-white/10 z-40 flex items-center px-4 gap-3 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-2 ml-10">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Command className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <h1 className="text-sm font-semibold text-gradient">MultiApp Workspace</h1>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenLayoutManager}
                className="glass-hover h-8 text-xs gap-1.5"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Layouts
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Manage layouts <kbd className="ml-2 text-[10px] opacity-60">⌘L</kbd>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenAppInserter}
                className="glass-hover h-8 text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Add app or file <kbd className="ml-2 text-[10px] opacity-60">⌘K</kbd>
            </TooltipContent>
          </Tooltip>

          {/* Keyboard shortcuts hint */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="glass-hover h-8 w-8"
              >
                <Keyboard className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-1 text-xs">
                <p className="font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between gap-4">
                  <span>Toggle navbar</span>
                  <kbd className="opacity-60">⌘B</kbd>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Add app/file</span>
                  <kbd className="opacity-60">⌘K</kbd>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Manage layouts</span>
                  <kbd className="opacity-60">⌘L</kbd>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </>
  );
};
