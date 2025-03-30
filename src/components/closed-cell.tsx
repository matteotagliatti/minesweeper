import { memo } from "react";
import { cn } from "@/lib/utils";

interface ClosedCellProps {
  flagged: boolean;
}

function ClosedCell({ flagged }: ClosedCellProps) {
  return (
    <div
      className={cn(
        "size-10 bg-card rounded p-1 border border-border/40 hover:bg-card/80 transition-colors cursor-pointer"
      )}
    >
      {flagged && <span className="size-6">🚩</span>}
    </div>
  );
}

export default memo(ClosedCell);
