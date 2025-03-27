import { Game, Status } from "@/lib/types";

export function newGame(minesCount: number): Game {
  return {
    openedMap: {},
    flaggedMap: {},
    status: Status.Ready,
    minesCount,
  };
}
