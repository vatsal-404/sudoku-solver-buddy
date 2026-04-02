import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SudokuGrid from "@/components/SudokuGrid";
import { solveSudoku, createEmptyBoard, type Board } from "@/lib/sudoku-solver";
import { toast } from "sonner";

const EXAMPLE: Board = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

const Index = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [originalBoard, setOriginalBoard] = useState<Board>(createEmptyBoard);
  const [solved, setSolved] = useState(false);

  const handleChange = useCallback((r: number, c: number, val: number | null) => {
    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
    setOriginalBoard((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  }, []);

  const handleSolve = () => {
    const result = solveSudoku(board);
    if (result) {
      setBoard(result);
      setSolved(true);
      toast.success("Puzzle solved!");
    } else {
      toast.error("No solution exists for this puzzle.");
    }
  };

  const handleClear = () => {
    setBoard(createEmptyBoard());
    setOriginalBoard(createEmptyBoard());
    setSolved(false);
  };

  const handleExample = () => {
    setBoard(EXAMPLE.map((r) => [...r]));
    setOriginalBoard(EXAMPLE.map((r) => [...r]));
    setSolved(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
          Sudoku <span className="text-primary">Solver</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Enter your puzzle and let the algorithm solve it instantly
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 sm:p-8 shadow-xl border border-border"
      >
        <SudokuGrid
          board={board}
          originalBoard={originalBoard}
          solved={solved}
          onChange={handleChange}
        />

        <div className="flex gap-3 mt-6 justify-center flex-wrap">
          {!solved ? (
            <>
              <Button onClick={handleSolve} size="lg">
                Solve Puzzle
              </Button>
              <Button onClick={handleExample} variant="secondary" size="lg">
                Load Example
              </Button>
              <Button onClick={handleClear} variant="outline" size="lg">
                Clear
              </Button>
            </>
          ) : (
            <Button onClick={handleClear} size="lg">
              New Puzzle
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
