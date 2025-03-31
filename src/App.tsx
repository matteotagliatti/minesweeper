import { Click, GameLevel, Status } from "./lib/types";
import OpenedCell from "./components/opened-cell";
import ClosedCell from "./components/closed-cell";
import { useEffect, useMemo, useState } from "react";
import { BOARD_MAX_SIZE } from "./lib/constants";
import { BOARD_MIN_SIZE } from "./lib/constants";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useGameState } from "./lib/states";
import { RefreshCw, Flag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

function App() {
  const {
    board,
    game,
    gameLevel,
    status,
    handleMove,
    newGame,
    newCustomGame,
    resetGame,
    saveCount,
    getCounts,
    total,
    solved,
    setGameLevel,
    getFlagsCount,
    getMaxFlags,
  } = useGameState();

  const [rows, setRows] = useState("5");
  const [cols, setCols] = useState("5");
  const [mines, setMines] = useState("10");
  const [errMsg, setErrMsg] = useState("");
  const [isFlagMode, setIsFlagMode] = useState(false);

  const handleCellInteraction = (row: number, col: number) => {
    if (isFlagMode) {
      handleMove({ row, col, click: Click.Right }, board);
    } else {
      handleMove({ row, col, click: Click.Left }, board);
    }
  };

  const handleLongPress = (row: number, col: number) => {
    handleMove({ row, col, click: Click.Right }, board);
  };

  const gameLevelOpts = useMemo(
    () => [
      { value: GameLevel.Easy, label: "Easy (9x9, 10 mines)" },
      { value: GameLevel.Medium, label: "Medium (16x16, 40 mines)" },
      { value: GameLevel.Hard, label: "Hard (16x30, 99 mines)" },
      { value: GameLevel.Custom, label: "Custom" },
    ],
    []
  );

  // clear error message when editing
  useEffect(() => {
    if (errMsg) {
      setErrMsg("");
    }
  }, [rows, cols, mines, errMsg]);

  const handlePlayCustomGame = () => {
    const rowsNum = parseInt(rows, 10);
    const colsNum = parseInt(cols, 10);
    const minesNum = parseInt(mines, 10);
    if (isNaN(rowsNum) || isNaN(colsNum) || isNaN(minesNum)) {
      setErrMsg("Not a number");
      return;
    }
    if (!isBoardSizeValid(rowsNum, colsNum)) {
      setErrMsg("Invalid row and column range");
      return;
    }
    const boardCells = rowsNum * colsNum;
    const minMines = Math.round(boardCells / 10);
    const maxMines = boardCells - 1;
    if (minesNum < minMines || minesNum > maxMines) {
      setErrMsg(`Invalid mines range: ${minMines} - ${maxMines}`);
      return;
    }
    newCustomGame({
      rows: parseInt(rows),
      cols: parseInt(cols),
      mines: parseInt(mines),
    });
  };

  useEffect(() => {
    if (status === Status.Win) {
      saveCount("solved_boards");
      saveCount("total_attempts");
    }
    if (status === Status.Lose) {
      saveCount("total_attempts");
    }
  }, [saveCount, status]);

  useEffect(() => {
    getCounts();
  }, [getCounts]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="container mx-auto p-4 flex flex-col items-center gap-6">
        {/* Header */}
        <header className="w-full max-w-xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Minesweeper</h1>
            {(status === Status.Win || status === Status.Lose) && (
              <Button onClick={resetGame} className="flex items-center gap-2">
                <RefreshCw className="size-4" />
                Play Again
              </Button>
            )}
          </div>
        </header>

        {/* Game status */}
        {(status === Status.Win || status === Status.Lose) && (
          <div className="text-lg font-semibold">
            {status === Status.Win ? "You Won! 🎉" : "Game Over! 💣"}
          </div>
        )}

        {/* Stats */}
        <section className="w-full max-w-xl text-sm grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-lg border bg-card">
          <div>
            <div className="text-muted-foreground">Total attempts</div>
            <div className="text-xl font-medium">{total}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Solved boards</div>
            <div className="text-xl font-medium">{solved}</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-muted-foreground">Flags</div>
            <div className="text-xl font-medium">
              {getFlagsCount()} / {getMaxFlags()} 🚩
            </div>
          </div>
        </section>

        {/* Game settings */}
        <section className="w-full max-w-xl space-y-4">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-end sm:justify-between gap-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1.5">
                <label htmlFor="game-level" className="text-sm font-medium">
                  Game Level
                </label>
                <Select
                  name="game-level"
                  value={gameLevel}
                  onValueChange={(value) => setGameLevel(value as GameLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select game level" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameLevelOpts.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {gameLevel !== GameLevel.Custom && (
                <Button
                  onClick={() => newGame(gameLevel)}
                  className="flex-1 sm:flex-none"
                >
                  New Game
                </Button>
              )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant={isFlagMode ? "secondary" : "outline"}
                onClick={() => setIsFlagMode(!isFlagMode)}
                className="flex items-center gap-2 flex-1 sm:flex-none"
              >
                <Flag className="size-4" />
                {isFlagMode ? "Flag Mode" : "Dig Mode"}
              </Button>
            </div>
          </div>

          {gameLevel === GameLevel.Custom && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  placeholder="Rows"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                />
                <Input
                  placeholder="Columns"
                  value={cols}
                  onChange={(e) => setCols(e.target.value)}
                />
                <Input
                  placeholder="Mines"
                  value={mines}
                  onChange={(e) => setMines(e.target.value)}
                />
              </div>
              <Button
                onClick={handlePlayCustomGame}
                className="w-full sm:w-auto"
              >
                Play Custom Game
              </Button>
              {errMsg.length > 0 && (
                <p className="text-sm text-destructive italic">{errMsg}</p>
              )}
            </div>
          )}
        </section>

        {/* Board */}
        <main className="w-full lg:w-fit lg:mx-auto overflow-x-auto rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-0.5 min-w-fit mx-auto">
            {board.map((row, i) => (
              <div key={i} className="flex gap-0.5">
                {row.map((cell, j) => (
                  <div
                    key={j}
                    onClick={() => handleCellInteraction(i, j)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleMove({ row: i, col: j, click: Click.Right }, board);
                    }}
                  >
                    {game.openedMap[`${i}-${j}`] ? (
                      <OpenedCell cell={cell} status={status} />
                    ) : (
                      <ClosedCell
                        flagged={game.flaggedMap[`${i}-${j}`]}
                        onLongPress={() => handleLongPress(i, j)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function isBoardSizeValid(rows: number, cols: number) {
  if (rows < BOARD_MIN_SIZE || cols < BOARD_MIN_SIZE) {
    return false;
  }
  if (rows > BOARD_MAX_SIZE || cols > BOARD_MAX_SIZE) {
    return false;
  }
  return true;
}

export default App;
