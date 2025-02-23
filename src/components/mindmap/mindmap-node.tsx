import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
} from "@/components/ui/dialog";
import React from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";

// MindMap Node Component
export function MindMapNode({ data, id }: { data: any; id: string }) {
  const [showExplanation, setShowExplanation] = React.useState(false);

  // Define color based on level
  const getNodeColor = (level: number) => {
    const colors = {
      0: "bg-blue-200 hover:bg-blue-300", // Soft blue
      1: "bg-emerald-200 hover:bg-emerald-300", // Soft green
      2: "bg-violet-200 hover:bg-violet-300", // Soft purple
      3: "bg-rose-200 hover:bg-rose-300", // Soft rose
      4: "bg-amber-200 hover:bg-amber-300", // Soft amber
    };
    return (
      colors[level as keyof typeof colors] || "bg-slate-200 hover:bg-slate-300"
    );
  };

  return (
    <div className="relative rounded-lg p-4">
      <Handle type="target" position={Position.Top} />
      <div
        className={cn(
          "rounded-lg border p-4 shadow-sm cursor-pointer transition-all duration-200",
          getNodeColor(data.level)
        )}
        onClick={() => setShowExplanation(true)}
      >
        <div className="text-sm font-medium text-gray-800">{data.label}</div>
      </div>

      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{data.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="prose dark:prose-invert">{data.explanation}</div>
            {data.canExpand && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  data.onExpand();
                  setShowExplanation(false);
                }}
                className="w-full"
              >
                Expand this topic
              </Button>
            )}
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
