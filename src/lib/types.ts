export type Game = {
  status: Status;
  openedMap: CellMap;
  flaggedMap: CellMap;
  minesCount: number;
};

export type GameMove = {
  row: number;
  col: number;
  click: Click;
};

export type BoardSettings = {
  rows: number;
  cols: number;
  mines: number;
};

export type Board = BoardCell[][];
export type BoardCell = number | Cell;
export type CellMapIndex = `${number}-${number}`;
export type CellMap = { [key: CellMapIndex]: boolean };

export enum Click {
  Right = "Right",
  Left = "Left",
}

export enum Cell {
  Blank = "B",
  Mine = "M",
}

export enum Status {
  Win = "win",
  Lose = "lose",
  Started = "started",
  Ready = "ready",
}

export enum GameLevel {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Custom = "custom",
}

export type CountsMap = {
  total_attempts: number;
  solved_boards: number;
};

export type CountType = keyof CountsMap;
