import { memo } from "react";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClosedCellProps {
  flagged: boolean;
}

function ClosedCell({ flagged }: ClosedCellProps) {
  return (
    <div className={cn("size-8 bg-slate-600 rounded p-1")}>
      {flagged && <Flag className="size-6 fill-red-500 text-white" />}
    </div>
  );
}

export default memo(ClosedCell);
