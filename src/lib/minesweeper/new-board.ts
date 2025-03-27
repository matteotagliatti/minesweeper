import { BoardSettings, Board, Cell, BoardCell } from "../types";

export function newBoard(settings: BoardSettings): Board {
  // Create empty board
  const matrix = Array.from({ length: settings.rows }, () =>
    Array(settings.cols).fill(Cell.Blank)
  );

  // Place mines
  const minePositions = generateMines(settings);
  minePositions.forEach(([row, col]) => {
    matrix[row][col] = Cell.Mine;
  });

  // Calculate numbers for cells
  for (let row = 0; row < settings.rows; row++) {
    for (let col = 0; col < settings.cols; col++) {
      if (matrix[row][col] === Cell.Mine) continue;

      const minesCount = countAdjacentMines(row, col, matrix);
      if (minesCount > 0) {
        matrix[row][col] = minesCount;
      }
    }
  }

  return matrix;
}

function countAdjacentMines(
  row: number,
  col: number,
  matrix: BoardCell[][]
): number {
  let count = 0;
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  // Check all 8 surrounding cells
  for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
      if (r === row && c === col) continue;
      if (matrix[r][c] === Cell.Mine) count++;
    }
  }

  return count;
}

function generateMines(settings: BoardSettings): [number, number][] {
  const positions = new Set<string>();
  const mines: [number, number][] = [];

  while (mines.length < settings.mines) {
    const row = Math.floor(Math.random() * settings.rows);
    const col = Math.floor(Math.random() * settings.cols);
    const key = `${row}-${col}`;

    if (!positions.has(key)) {
      positions.add(key);
      mines.push([row, col]);
    }
  }

  return mines;
}
