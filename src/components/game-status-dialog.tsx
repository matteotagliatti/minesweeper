import { Status } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GameStatusDialogProps {
  status: Status;
  isOpen: boolean;
  onNewGame: () => void;
}

export function GameStatusDialog({
  status,
  isOpen,
  onNewGame,
}: GameStatusDialogProps) {
  if (status !== Status.Win && status !== Status.Lose) {
    return null;
  }

  const isWin = status === Status.Win;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isWin ? "Congratulations! 🎉" : "Game Over! 💣"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isWin
              ? "You successfully cleared all mines. Great job!"
              : "You hit a mine. Better luck next time!"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onNewGame}>Play Again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
