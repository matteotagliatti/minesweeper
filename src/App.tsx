import { Click, GameLevel, Status } from "./lib/types";
import OpenedCell from "./components/opened-cell";
import ClosedCell from "./components/closed-cell";
import { useEffect, useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { BOARD_MAX_SIZE } from "./lib/constants";
import { BOARD_MIN_SIZE } from "./lib/constants";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useGameState } from "./lib/states";
import { Bomb } from "lucide-react";

function App() {
  const {
    board,
    game,
    gameLevel,
    status,
    handleMove,
    newGame,
    newCustomGame,
    saveCount,
    getCounts,
    total,
    solved,
  } = useGameState();

  const [rows, setRows] = useState("5");
  const [cols, setCols] = useState("5");
  const [mines, setMines] = useState("10");
  const [errMsg, setErrMsg] = useState("");

  const handleOpenCell = (
    ev: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    const el = ev.currentTarget;
    const { row, col } = el.dataset;
    if (row === undefined || col === undefined) return;
    handleMove(
      { row: parseInt(row, 10), col: parseInt(col, 10), click: Click.Left },
      board
    );
  };

  const handleFlagCell = (
    ev: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    ev.preventDefault();
    const el = ev.currentTarget;
    const { row, col } = el.dataset;
    if (row === undefined || col === undefined) return;
    handleMove(
      { row: parseInt(row), col: parseInt(col), click: Click.Right },
      board
    );
  };

  const gameLevelOpts = useMemo(
    () => [
      { value: GameLevel.Easy, label: "Easy" },
      { value: GameLevel.Medium, label: "Medium" },
      { value: GameLevel.Hard, label: "Hard" },
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
      <div className="max-w-screen-lg mx-auto p-2 flex flex-col items-center gap-4">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2">
            <Bomb className="size-6 fill-foreground" />
            <h1 className="font-heading text-xl">Minesweeper</h1>
          </div>
        </header>

        {/* Counter */}
        <section className="text-sm grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
          <p>
            Total attempts: <span>{total}</span>
          </p>
          <p>
            Solved boards: <span>{solved}</span>
          </p>
        </section>

        {/* Game settings */}
        <section className="px-2 pb-4">
          <div>
            <div className="text-lg font-semibold mb-2">Game Level</div>
            <RadioGroup
              value={gameLevel}
              onValueChange={newGame}
              className="flex flex-wrap gap-3"
            >
              {gameLevelOpts.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`level-${opt.value}`} />
                  <label
                    htmlFor={`level-${opt.value}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {opt.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {gameLevel === GameLevel.Custom && (
            <>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Input value={rows} onChange={(e) => setRows(e.target.value)} />
                <Input value={cols} onChange={(e) => setCols(e.target.value)} />
                <Input
                  value={mines}
                  onChange={(e) => setMines(e.target.value)}
                />
                <Button onClick={handlePlayCustomGame}>Play</Button>
              </div>
              {errMsg.length > 0 && (
                <p className="text-sm text-destructive italic mt-2">{errMsg}</p>
              )}
            </>
          )}
        </section>
        {/* Board */}
        <main>
          <div
            className="flex flex-col gap-0.5"
            onContextMenu={(e) => e.preventDefault()}
          >
            {board.map((row, i) => (
              <div key={i} className="flex gap-0.5">
                {row.map((cell, j) => (
                  <div
                    key={j}
                    onClick={handleOpenCell}
                    onContextMenu={handleFlagCell}
                    data-row={i}
                    data-col={j}
                  >
                    {game.openedMap[`${i}-${j}`] ? (
                      <OpenedCell cell={cell} />
                    ) : (
                      <ClosedCell flagged={game.flaggedMap[`${i}-${j}`]} />
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
