import {
  Board,
  Status,
  Game,
  GameMove,
  Click,
  CellMapIndex,
  Cell,
} from "@/lib/types";

export function gameMove(move: GameMove, game: Game, board: Board) {
  // Handle game state
  if (game.status === Status.Ready) {
    game.status = Status.Started;
  }

  if (game.status === Status.Lose || game.status === Status.Win) return;

  // Route to appropriate handler
  if (move.click === Click.Right) {
    toggleFlag(move, game);
  } else {
    openCell(move, game, board);
  }
}

// Handle right-click flagging
function toggleFlag(move: GameMove, game: Game) {
  const key: CellMapIndex = `${move.row}-${move.col}`;

  // Can't flag already opened cells
  if (game.openedMap[key]) return;

  if (game.flaggedMap[key]) {
    delete game.flaggedMap[key];
  } else if (Object.keys(game.flaggedMap).length < game.minesCount) {
    game.flaggedMap[key] = true;
  }
}

// Handle left-click cell opening
function openCell(move: GameMove, game: Game, board: Board) {
  const key: CellMapIndex = `${move.row}-${move.col}`;

  // Don't open flagged cells
  if (game.flaggedMap[key]) return;

  if (game.openedMap[key]) {
    // Handle chord action on already opened number cells
    if (board[move.row][move.col] !== Cell.Blank) {
      performChord(move.row, move.col, game, board);
    }
    return;
  }

  // Game over if mine is clicked
  if (board[move.row][move.col] === Cell.Mine) {
    revealAllMines(game, board);
    return;
  }

  // Expand blank areas
  markCellOpen(game, move.row, move.col);
  expandBlankAreas(move.row, move.col, game, board);
  checkWinCondition(game, board);
}

// Mark cell as open in the game state
function markCellOpen(game: Game, row: number, col: number) {
  const key: CellMapIndex = `${row}-${col}`;
  game.openedMap[key] = true;
}

// Expand connected blank areas and reveal numbers around them
function expandBlankAreas(row: number, col: number, game: Game, board: Board) {
  let blanksToProcess: [number, number][] = [[row, col]];

  while (blanksToProcess.length > 0) {
    const newBlanks: [number, number][] = [];

    for (const [r, c] of blanksToProcess) {
      if (board[r][c] === Cell.Blank) {
        // Process all 8 adjacent cells
        for (
          let i = Math.max(0, r - 1);
          i <= Math.min(board.length - 1, r + 1);
          i++
        ) {
          for (
            let j = Math.max(0, c - 1);
            j <= Math.min(board[0]?.length - 1, c + 1);
            j++
          ) {
            const key: CellMapIndex = `${i}-${j}`;
            if ((i === r && j === c) || game.openedMap[key]) continue;

            markCellOpen(game, i, j);

            if (board[i][j] === Cell.Blank) {
              newBlanks.push([i, j]);
            }
          }
        }
      }
    }

    blanksToProcess = newBlanks;
  }
}

// Handle chord action (clicking on a number with correct flags around it)
function performChord(row: number, col: number, game: Game, board: Board) {
  const cell = board[row][col];
  if (typeof cell !== "number") return;

  const rows = board.length;
  const cols = board[0]?.length || 0;

  // Count adjacent flags
  let flagsCount = 0;
  let allMinesFlagged = true;

  for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
    for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
      if (i === row && j === col) continue;

      const key: CellMapIndex = `${i}-${j}`;

      if (board[i][j] === Cell.Mine && !game.flaggedMap[key]) {
        allMinesFlagged = false;
      }

      if (game.flaggedMap[key]) {
        flagsCount++;
      }
    }
  }

  // Don't chord if flag count doesn't match cell number
  if (flagsCount !== cell) return;

  // Game over if not all mines are correctly flagged
  if (!allMinesFlagged) {
    revealAllMines(game, board);
    return;
  }

  // Open all unflagged cells around the number
  const newBlanks: [number, number][] = [];

  for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
    for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
      if (i === row && j === col) continue;

      const key: CellMapIndex = `${i}-${j}`;
      if (!game.openedMap[key] && !game.flaggedMap[key]) {
        markCellOpen(game, i, j);

        if (board[i][j] === Cell.Blank) {
          newBlanks.push([i, j]);
        }
      }
    }
  }

  // Expand any new blank areas
  let blanksToProcess = newBlanks;
  while (blanksToProcess.length > 0) {
    const nextBlanks: [number, number][] = [];

    for (const [r, c] of blanksToProcess) {
      for (let i = Math.max(0, r - 1); i <= Math.min(rows - 1, r + 1); i++) {
        for (let j = Math.max(0, c - 1); j <= Math.min(cols - 1, c + 1); j++) {
          const key: CellMapIndex = `${i}-${j}`;
          if ((i === r && j === c) || game.openedMap[key]) continue;

          markCellOpen(game, i, j);

          if (board[i][j] === Cell.Blank) {
            nextBlanks.push([i, j]);
          }
        }
      }
    }

    blanksToProcess = nextBlanks;
  }

  checkWinCondition(game, board);
}

// Set game to lose state and reveal all mines
function revealAllMines(game: Game, board: Board) {
  game.status = Status.Lose;

  board.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell === Cell.Mine) {
        markCellOpen(game, rowIdx, colIdx);
      }
    });
  });
}

// Check if the game is won and update state accordingly
function checkWinCondition(game: Game, board: Board) {
  const totalCells = board.length * board[0]?.length;
  const openedCount = Object.keys(game.openedMap).length;

  // Win if only mines are left unopened
  if (totalCells - openedCount === game.minesCount) {
    game.status = Status.Win;

    // Flag all unflagged mines
    board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell === Cell.Mine) {
          const key: CellMapIndex = `${rowIdx}-${colIdx}`;
          game.flaggedMap[key] = true;
        }
      });
    });
  }
}
