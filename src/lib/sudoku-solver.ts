export type Board = (number | null)[][];

export function solveSudoku(board: Board): Board | null {
  const grid = board.map(row => [...row]);

  function isValid(r: number, c: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (grid[r][i] === num || grid[i][c] === num) return false;
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let i = br; i < br + 3; i++)
      for (let j = bc; j < bc + 3; j++)
        if (grid[i][j] === num) return false;
    return true;
  }

  function solve(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(r, c, num)) {
              grid[r][c] = num;
              if (solve()) return true;
              grid[r][c] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  return solve() ? grid : null;
}

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(null));
}
