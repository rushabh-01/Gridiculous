import { useState } from "react";
import { Plus, Minus, Grid, RotateCcw, Rows, Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomLayoutCreatorProps {
  onCreateLayout: (name: string, rowsConfig: number[], isColumnBased?: boolean) => void;
}

export const CustomLayoutCreator = ({ onCreateLayout }: CustomLayoutCreatorProps) => {
  const [layoutName, setLayoutName] = useState("");
  const [rows, setRows] = useState<number[]>([2]);
  const [columns, setColumns] = useState<number[]>([2]);
  const [mode, setMode] = useState<"rows" | "columns">("rows");

  const addRow = () => {
    if (rows.length < 6) {
      setRows([...rows, 2]);
    }
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateRowColumns = (index: number, delta: number) => {
    const newRows = [...rows];
    const newValue = newRows[index] + delta;
    if (newValue >= 1 && newValue <= 6) {
      newRows[index] = newValue;
      setRows(newRows);
    }
  };

  const addColumn = () => {
    if (columns.length < 6) {
      setColumns([...columns, 2]);
    }
  };

  const removeColumn = (index: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== index));
    }
  };

  const updateColumnRows = (index: number, delta: number) => {
    const newColumns = [...columns];
    const newValue = newColumns[index] + delta;
    if (newValue >= 1 && newValue <= 6) {
      newColumns[index] = newValue;
      setColumns(newColumns);
    }
  };

  const resetLayout = () => {
    setRows([2]);
    setColumns([2]);
    setLayoutName("");
  };

  const handleCreate = () => {
    if (!layoutName.trim()) return;
    
    if (mode === "rows") {
      onCreateLayout(layoutName, rows, false);
    } else {
      onCreateLayout(layoutName, columns, true);
    }
    resetLayout();
  };

  const totalPanelsRows = rows.reduce((a, b) => a + b, 0);
  const totalPanelsColumns = columns.reduce((a, b) => a + b, 0);
  const totalPanels = mode === "rows" ? totalPanelsRows : totalPanelsColumns;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="custom-layout-name" className="text-xs">
          Layout Name
        </Label>
        <Input
          id="custom-layout-name"
          value={layoutName}
          onChange={(e) => setLayoutName(e.target.value)}
          placeholder="e.g., My Custom Layout"
          className="glass h-9 text-xs mt-1"
        />
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as "rows" | "columns")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rows" className="text-xs gap-1">
            <Rows className="h-3 w-3" />
            Row-based
          </TabsTrigger>
          <TabsTrigger value="columns" className="text-xs gap-1">
            <Columns className="h-3 w-3" />
            Column-based
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rows" className="space-y-3 mt-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Configure Rows</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetLayout}
              className="h-7 text-xs gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          <div className="space-y-2">
            {rows.map((columnCount, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <span className="text-xs text-muted-foreground w-16">
                  Row {rowIndex + 1}:
                </span>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRowColumns(rowIndex, -1)}
                    disabled={columnCount <= 1}
                    className="h-7 w-7"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="text-xs font-medium w-8 text-center">
                    {columnCount}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRowColumns(rowIndex, 1)}
                    disabled={columnCount >= 6}
                    className="h-7 w-7"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <span className="text-xs text-muted-foreground flex-1">
                  panel{columnCount > 1 ? "s" : ""}
                </span>

                {rows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(rowIndex)}
                    className="h-7 w-7 text-destructive hover:text-destructive"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={rows.length >= 6}
            className="w-full h-8 text-xs gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Row
          </Button>
        </TabsContent>

        <TabsContent value="columns" className="space-y-3 mt-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Configure Columns</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetLayout}
              className="h-7 text-xs gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          <div className="space-y-2">
            {columns.map((rowCount, colIndex) => (
              <div
                key={colIndex}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <span className="text-xs text-muted-foreground w-16">
                  Col {colIndex + 1}:
                </span>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateColumnRows(colIndex, -1)}
                    disabled={rowCount <= 1}
                    className="h-7 w-7"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="text-xs font-medium w-8 text-center">
                    {rowCount}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateColumnRows(colIndex, 1)}
                    disabled={rowCount >= 6}
                    className="h-7 w-7"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <span className="text-xs text-muted-foreground flex-1">
                  panel{rowCount > 1 ? "s" : ""}
                </span>

                {columns.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColumn(colIndex)}
                    className="h-7 w-7 text-destructive hover:text-destructive"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={addColumn}
            disabled={columns.length >= 6}
            className="w-full h-8 text-xs gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Column
          </Button>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <div className="space-y-2">
        <Label className="text-xs">Preview ({totalPanels} panels)</Label>
        <div className="border border-white/20 rounded-lg p-2 bg-muted/30 min-h-[100px]">
          {mode === "rows" ? (
            <div className="space-y-1 h-full">
              {rows.map((columnCount, rowIndex) => (
                <div key={rowIndex} className="flex gap-1" style={{ height: `${100 / rows.length}%`, minHeight: "24px" }}>
                  {Array.from({ length: columnCount }).map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex-1 rounded bg-primary/20 border border-primary/30 flex items-center justify-center"
                    >
                      <span className="text-[10px] text-muted-foreground">
                        {rows.slice(0, rowIndex).reduce((a, b) => a + b, 0) + colIndex + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-1 h-full min-h-[100px]">
              {columns.map((rowCount, colIndex) => (
                <div key={colIndex} className="flex-1 flex flex-col gap-1">
                  {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex-1 rounded bg-primary/20 border border-primary/30 flex items-center justify-center"
                      style={{ minHeight: "24px" }}
                    >
                      <span className="text-[10px] text-muted-foreground">
                        {columns.slice(0, colIndex).reduce((a, b) => a + b, 0) + rowIndex + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleCreate}
        disabled={!layoutName.trim()}
        className="w-full h-9 text-xs gap-1.5"
      >
        <Grid className="h-3.5 w-3.5" />
        Create Custom Layout
      </Button>
    </div>
  );
};
