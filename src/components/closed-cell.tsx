import { memo } from "react";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClosedCellProps {
  flagged: boolean;
}

function ClosedCell({ flagged }: ClosedCellProps) {
  return (
    <div className={cn("size-8 bg-card rounded p-1 border border-border/40")}>
      {flagged && (
        <Flag className="size-6 fill-destructive text-card-foreground" />
      )}
    </div>
  );
}

export default memo(ClosedCell);
