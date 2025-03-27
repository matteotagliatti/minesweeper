import { memo } from "react";
import { Bomb } from "lucide-react";
import { BoardCell, Cell } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorMap: { [key: number]: string } = {
  1: "text-chart-1",
  2: "text-chart-2",
  3: "text-chart-3",
  4: "text-chart-4",
  5: "text-chart-5",
  6: "text-destructive",
  7: "text-primary",
  8: "text-secondary-foreground",
};

interface OpenedCellProps {
  cell: BoardCell;
}

function OpenedCell({ cell }: OpenedCellProps) {
  return (
    <div
      className={cn(
        "size-8 rounded-sm p-1 text-xl font-semibold flex justify-center items-center overflow-hidden bg-secondary",
        typeof cell === "number" && colorMap[cell]
      )}
    >
      {cell === Cell.Mine && (
        <Bomb className="fill-destructive text-destructive size-6" />
      )}
      {typeof cell === "number" && cell}
    </div>
  );
}

export default memo(OpenedCell);
