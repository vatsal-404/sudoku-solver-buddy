import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Board } from "@/lib/sudoku-solver";

interface Props {
  board: Board;
  originalBoard: Board;
  solved: boolean;
  onChange: (r: number, c: number, val: number | null) => void;
}

const SudokuGrid = ({ board, originalBoard, solved, onChange }: Props) => {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );

  const handleKey = useCallback(
    (r: number, c: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;
      if (key >= "1" && key <= "9") {
        e.preventDefault();
        onChange(r, c, parseInt(key));
        // Move to next cell
        const nc = c < 8 ? c + 1 : 0;
        const nr = c < 8 ? r : r < 8 ? r + 1 : 0;
        inputRefs.current[nr][nc]?.focus();
      } else if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        onChange(r, c, null);
      } else if (key === "ArrowRight" && c < 8) inputRefs.current[r][c + 1]?.focus();
      else if (key === "ArrowLeft" && c > 0) inputRefs.current[r][c - 1]?.focus();
      else if (key === "ArrowDown" && r < 8) inputRefs.current[r + 1][c]?.focus();
      else if (key === "ArrowUp" && r > 0) inputRefs.current[r - 1][c]?.focus();
    },
    [onChange]
  );

  return (
    <div className="inline-grid grid-cols-9 border-2 border-grid-line-thick rounded-lg overflow-hidden shadow-lg">
      {board.map((row, r) =>
        row.map((cell, c) => {
          const isOriginal = originalBoard[r][c] !== null;
          const isSolved = solved && !isOriginal && cell !== null;

          return (
            <motion.div
              key={`${r}-${c}`}
              initial={isSolved ? { scale: 0, opacity: 0 } : false}
              animate={isSolved ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: (r * 9 + c) * 0.012, duration: 0.3 }}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
                ${c % 3 === 2 && c !== 8 ? "border-r-2 border-r-grid-line-thick" : c !== 8 ? "border-r border-r-grid-line" : ""}
                ${r % 3 === 2 && r !== 8 ? "border-b-2 border-b-grid-line-thick" : r !== 8 ? "border-b border-b-grid-line" : ""}
              `}
            >
              <input
                ref={(el) => { inputRefs.current[r][c] = el; }}
                type="text"
                inputMode="numeric"
                readOnly={solved}
                value={cell ?? ""}
                onKeyDown={(e) => handleKey(r, c, e)}
                onChange={() => {}}
                className={`
                  w-full h-full text-center text-lg font-semibold outline-none bg-transparent
                  ${isSolved ? "text-solved" : isOriginal ? "text-foreground" : "text-muted-foreground"}
                  ${!solved ? "focus:bg-primary/10 cursor-text" : "cursor-default"}
                  transition-colors
                `}
              />
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default SudokuGrid;
