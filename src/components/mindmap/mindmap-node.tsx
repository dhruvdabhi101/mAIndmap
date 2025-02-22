import * as React from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MindMapNodeProps {
  data: {
    content: string;
    explanation: string;
    isExpanded?: boolean;
    onExpand?: () => void;
  };
  isConnectable: boolean;
}

export default function MindMapNode({ data, isConnectable }: MindMapNodeProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="relative rounded-lg border bg-card p-4 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minWidth: "200px", maxWidth: "300px" }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-primary"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{data.content}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {data.explanation}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[300px]">
                <p className="text-sm">{data.explanation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {data.onExpand && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              data.onExpand();
            }}
          >
            {data.isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-primary"
      />
    </div>
  );
}
