import { Cell, BoardCell, Status } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  cell: BoardCell;
  status?: Status;
}

const numberColors = {
  1: "text-blue-500",
  2: "text-green-500",
  3: "text-red-500",
  4: "text-purple-500",
  5: "text-yellow-500",
  6: "text-cyan-500",
  7: "text-orange-500",
  8: "text-pink-500",
};

export default function OpenedCell({ cell, status }: Props) {
  const isLostMine = status === Status.Lose && cell === Cell.Mine;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center size-8 sm:size-10 select-none rounded-sm border border-border/50 bg-background font-medium",
        typeof cell === "number" &&
          numberColors[cell as keyof typeof numberColors],
        isLostMine && "bg-red-500/20"
      )}
    >
      {cell === Cell.Mine ? "💣" : cell === Cell.Blank ? "" : cell}
    </span>
  );
}
