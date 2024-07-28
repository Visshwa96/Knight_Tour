// solver.js

// Function to get the Sudoku grid from the HTML
function getSudokuGrid() {
    const grid = [];
    const inputs = document.querySelectorAll('#sudoku-grid input');
    
    for (let i = 0; i < 81; i += 9) {
        const row = [];
        for (let j = i; j < i + 9; j++) {
            const value = parseInt(inputs[j].value) || 0;
            row.push(value);
        }
        grid.push(row);
    }
    
    return grid;
}

// Function to set the Sudoku grid into the HTML
function setSudokuGrid(grid) {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    
    for (let i = 0; i < 81; i++) {
        inputs[i].value = grid[Math.floor(i / 9)][i % 9] || '';
    }
}

// Function to check if a number is valid in a specific position
function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num || board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

// Backtracking Sudoku solver
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Event listener for the Solve button
document.getElementById('solve-btn').addEventListener('click', () => {
    const board = getSudokuGrid();
    if (solveSudoku(board)) {
        setSudokuGrid(board);
    } else {
        alert('No solution exists');
    }
});
