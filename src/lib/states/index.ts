import { useBoardStore } from "./board";
import { useCounterStore } from "./count";
import { useGameStore } from "./game";

export function useGameState() {
  const board = useBoardStore((s) => s.board);

  const game = useGameStore((s) => s.game);
  const gameLevel = useGameStore((s) => s.gameLevel);
  const handleMove = useGameStore((s) => s.handleMove);
  const newGame = useGameStore((s) => s.newGame);
  const newCustomGame = useGameStore((s) => s.newCustomGame);
  const resetGame = useGameStore((s) => s.resetGame);
  const setGameLevel = useGameStore((s) => s.setGameLevel);
  const getFlagsCount = useGameStore((s) => s.getFlagsCount);
  const getMaxFlags = useGameStore((s) => s.getMaxFlags);
  const saveCount = useCounterStore((s) => s.saveCount);
  const getCounts = useCounterStore((s) => s.getCounts);
  const total = useCounterStore((s) => s.total);
  const solved = useCounterStore((s) => s.solved);

  return {
    board,
    game,
    gameLevel,
    status: game.status,
    handleMove,
    newGame,
    newCustomGame,
    resetGame,
    setGameLevel,
    getFlagsCount,
    getMaxFlags,
    saveCount,
    getCounts,
    total,
    solved,
  };
}
