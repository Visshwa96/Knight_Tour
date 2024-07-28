// script.js

const size = 8; // Size of the chessboard
const moves = [
    { x: 2, y: 1 }, { x: 1, y: 2 }, { x: -1, y: 2 }, { x: -2, y: 1 },
    { x: -2, y: -1 }, { x: -1, y: -2 }, { x: 1, y: -2 }, { x: 2, y: -1 }
];

// Create the chessboard
const createBoard = () => {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            chessboard.appendChild(cell);
        }
    }
};

// Log messages
const logMessage = (message) => {
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += message + '<br>';
    logDiv.scrollTop = logDiv.scrollHeight; // Scroll to bottom
};

// Check if a cell is within bounds
const isInBounds = (x, y) => x >= 0 && x < size && y >= 0 && y < size;

// Start the Knight's Tour
const startTour = () => {
    createBoard();
    const path = [];
    const visited = Array(size).fill().map(() => Array(size).fill(false));

    // Start the tour from the initial position
    const startX = 0;
    const startY = 0;
    visited[startX][startY] = true;
    path.push({ x: startX, y: startY });

    if (solveKnightTour(startX, startY, 1, path, visited)) {
        logMessage('Knight\'s Tour completed!');
    } else {
        logMessage('No valid Knight\'s Tour found.');
    }
    animatePath(path);
};

// Solve Knight's Tour using backtracking
const solveKnightTour = (x, y, moveCount, path, visited) => {
    if (moveCount === size * size) {
        return true; // All squares visited
    }

    const possibleMoves = moves.map(move => ({ x: x + move.x, y: y + move.y }))
                               .filter(({ x, y }) => isInBounds(x, y) && !visited[x][y]);

    // Sort moves by Warnsdorff's heuristic (least number of onward moves)
    possibleMoves.sort((a, b) => {
        const countA = moves.filter(move => isInBounds(a.x + move.x, a.y + move.y) && !visited[a.x + move.x][a.y + move.y]).length;
        const countB = moves.filter(move => isInBounds(b.x + move.x, b.y + move.y) && !visited[b.x + move.x][b.y + move.y]).length;
        return countA - countB;
    });

    for (const { x: newX, y: newY } of possibleMoves) {
        visited[newX][newY] = true;
        path.push({ x: newX, y: newY });

        if (solveKnightTour(newX, newY, moveCount + 1, path, visited)) {
            return true;
        }

        // Backtrack
        visited[newX][newY] = false;
        path.pop();
    }

    return false;
};

// Animate the path step by step
const animatePath = (path) => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('knight', 'visited', 'current')); // Clear previous path

    let step = 0;
    const interval = setInterval(() => {
        if (step < path.length) {
            const pos = path[step];
            const cellIndex = pos.x * size + pos.y;
            const cell = cells[cellIndex];

            // Clear previous knight positions and current cell highlights
            cells.forEach(c => c.classList.remove('knight', 'current'));

            // Highlight the current position
            cell.classList.add('current');
            logMessage(`Move ${step + 1}: (${pos.x}, ${pos.y})`);

            // Mark the previous cells as visited
            if (step > 0) {
                const prevPos = path[step - 1];
                const prevCellIndex = prevPos.x * size + prevPos.y;
                cells[prevCellIndex].classList.add('visited');
            }

            step++;
        } else {
            clearInterval(interval);
            logMessage('Tour completed.');
        }
    }, 500); // Update every 500 milliseconds
};

document.addEventListener('DOMContentLoaded', startTour); // Start the tour automatically when the page loads
