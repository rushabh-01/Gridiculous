import { useState, useEffect, useRef } from "react";
import { StickyNote, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PanelNotesProps {
  panelId: string;
  note: string;
  onNoteChange: (note: string) => void;
}

export const PanelNotes = ({ panelId, note, onNoteChange }: PanelNotesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localNote, setLocalNote] = useState(note);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = () => {
    onNoteChange(localNote);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalNote("");
    onNoteChange("");
  };

  const hasNote = note.trim().length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-5 w-5 ${hasNote ? 'text-yellow-400' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
            >
              <StickyNote className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {hasNote ? "View note" : "Add note"}
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-64 p-3 glass" align="end">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <StickyNote className="h-3 w-3 text-yellow-400" />
              Panel Note
            </h4>
            {hasNote && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-5 w-5"
                title="Clear note"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Textarea
            ref={textareaRef}
            value={localNote}
            onChange={(e) => setLocalNote(e.target.value)}
            placeholder="Add a note about this panel..."
            className="min-h-[80px] text-xs resize-none glass"
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-7 text-xs gap-1"
            >
              <Check className="h-3 w-3" />
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
