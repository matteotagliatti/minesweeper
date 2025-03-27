import { memo } from "react";
import { Bomb } from "lucide-react";
import { BoardCell, Cell } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorMap: { [key: number]: string } = {
  1: "text-green-400",
  2: "text-green-500",
  3: "text-orange-400",
  4: "text-orange-500",
  5: "text-red-400",
  6: "text-red-500",
  7: "text-violet-400",
  8: "text-violet-500",
};

interface OpenedCellProps {
  cell: BoardCell;
}

function OpenedCell({ cell }: OpenedCellProps) {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-sm p-1 text-xl font-semibold flex justify-center items-center overflow-hidden bg-neutral-800",
        typeof cell === "number" && colorMap[cell]
      )}
    >
      {cell === Cell.Mine && <Bomb className="fill-white text-white size-6" />}
      {typeof cell === "number" && cell}
    </div>
  );
}

export default memo(OpenedCell);
