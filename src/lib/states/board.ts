import { create } from "zustand";
import { newBoard } from "@/lib/minesweeper/new-board";
import { Board, BoardSettings } from "@/lib/types";
import { EASY_MODE } from "@/lib/constants";

interface BoardState {
  board: Board;
  newBoard: (settings: BoardSettings) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: newBoard(EASY_MODE),
  newBoard: (settings: BoardSettings) =>
    set({
      board: newBoard(settings),
    }),
}));
