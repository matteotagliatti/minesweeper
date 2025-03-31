import { cn } from "@/lib/utils";

interface Props {
  flagged?: boolean;
  onLongPress?: () => void;
}

export default function ClosedCell({ flagged, onLongPress }: Props) {
  let touchTimeout: NodeJS.Timeout;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchTimeout = setTimeout(() => {
      e.preventDefault();
      onLongPress?.();
    }, 300);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimeout);
  };

  const handleTouchMove = () => {
    clearTimeout(touchTimeout);
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center size-8 sm:size-10 select-none rounded-sm border border-border/50 bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer touch-none",
        flagged && "bg-muted"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {flagged && "🚩"}
    </span>
  );
}
