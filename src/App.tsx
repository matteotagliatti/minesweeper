import { useBoardStore } from "./lib/states/board";
import { useGameStore } from "./lib/states/game";
import { Click } from "./lib/types";
import OpenedCell from "./components/opened-cell";
import ClosedCell from "./components/closed-cell";

function App() {
  const board = useBoardStore((s) => s.board);
  const game = useGameStore((s) => s.game);
  const handleMove = useGameStore((s) => s.handleMove);

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
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main>
        <div className="flex justify-center">
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
        </div>
      </main>
    </div>
  );
}

export default App;
