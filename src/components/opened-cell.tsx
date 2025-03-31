import { Cell, BoardCell } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  cell: BoardCell;
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

export default function OpenedCell({ cell }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center size-8 sm:size-10 select-none rounded-sm border border-border/50 bg-background font-medium",
        typeof cell === "number" &&
          numberColors[cell as keyof typeof numberColors]
      )}
    >
      {cell === Cell.Mine ? "💣" : cell === Cell.Blank ? "" : cell}
    </span>
  );
}
