import { create } from "zustand";
import { produce } from "structurajs";
import { useBoardStore } from "./board";
import { newGame } from "@/lib/minesweeper/new-game";
import { gameMove } from "@/lib/minesweeper/game-move";
import { Board, BoardSettings, Game, GameMove } from "@/lib/types";
import { GameLevel } from "@/lib/types";
import { EASY_MODE, MEDIUM_MODE, HARD_MODE } from "@/lib/constants";

interface GameState {
  game: Game;
  duration: number;
  startedAt: number;
  gameLevel: GameLevel;

  // Actions
  setGameLevel: (gameLevel: GameLevel) => void;
  newGame: (gameLevel: GameLevel) => void;
  newCustomGame: (settings: BoardSettings) => void;
  resetGame: () => void;
  handleMove: (move: GameMove, board: Board) => void;
  setDuration: (duration: number) => void;
  setStartedAt: (startedAt: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  game: newGame(EASY_MODE.mines),
  duration: 0,
  startedAt: 0,
  gameLevel: GameLevel.Easy,

  setGameLevel: (gameLevel) => {
    set({ gameLevel });
  },

  newGame: (gameLevel) => {
    if (gameLevel === GameLevel.Custom) {
      set({
        gameLevel: GameLevel.Custom,
      });
      return;
    }

    let settings = EASY_MODE;
    if (gameLevel === GameLevel.Medium) {
      settings = MEDIUM_MODE;
    }
    if (gameLevel === GameLevel.Hard) {
      settings = HARD_MODE;
    }

    useBoardStore.getState().newBoard(settings);
    set({
      game: newGame(settings.mines),
      duration: 0,
      startedAt: 0,
      gameLevel: gameLevel,
    });
  },

  newCustomGame: (settings) => {
    useBoardStore.getState().newBoard(settings);
    set({
      game: newGame(settings.mines),
      duration: 0,
      startedAt: 0,
      gameLevel: GameLevel.Custom,
    });
  },

  resetGame: () => {
    const board = useBoardStore.getState().board;
    set((state) => {
      useBoardStore.getState().newBoard({
        rows: board.length,
        cols: board[0].length,
        mines: state.game.minesCount,
      });
      return {
        game: newGame(state.game.minesCount),
        duration: 0,
        startedAt: 0,
      };
    });
  },

  handleMove: (move, board) => {
    set((state) => {
      return produce(state, (draft) => {
        gameMove(move, draft.game, board);
      });
    });
  },

  setDuration: (duration) => {
    set({ duration });
  },

  setStartedAt: (startedAt) => {
    set({ startedAt });
  },
}));
