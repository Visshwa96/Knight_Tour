// script.js
const maze = [
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0]
];

const rows = maze.length;
const cols = maze[0].length;

const start = { x: 0, y: 0 };
const end = { x: 9, y: 9 };

const createMaze = () => {
    const mazeContainer = document.getElementById('maze');
    mazeContainer.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (maze[r][c] === 1) cell.classList.add('wall');
            if (r === start.x && c === start.y) cell.classList.add('start');
            if (r === end.x && c === end.y) cell.classList.add('end');
            mazeContainer.appendChild(cell);
        }
    }
};

const logMessage = (message) => {
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += message + '<br>';
    logDiv.scrollTop = logDiv.scrollHeight; // Scroll to bottom
};

const solveMaze = () => {
    const directions = [
        { x: 0, y: 1 },  // right
        { x: 1, y: 0 },  // down
        { x: 0, y: -1 }, // left
        { x: -1, y: 0 }  // up
    ];
    const stack = [{ x: start.x, y: start.y }];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);

    logMessage('Starting maze solving...');

    while (stack.length > 0) {
        const { x, y } = stack.pop();
        logMessage(`Visiting (${x}, ${y})`);

        if (x === end.x && y === end.y) {
            logMessage('Reached the destination!');
            markPath(x, y);
            return;
        }

        for (const dir of directions) {
            const newX = x + dir.x;
            const newY = y + dir.y;
            if (isInBounds(newX, newY) && maze[newX][newY] === 0 && !visited.has(`${newX},${newY}`)) {
                stack.push({ x: newX, y: newY });
                visited.add(`${newX},${newY}`);
                if (markPath(newX, newY)) {
                    logMessage('Path found to destination!');
                    return true;
                }
            }
        }
    }

    logMessage('No path found.');
};

const isInBounds = (x, y) => x >= 0 && x < rows && y >= 0 && y < cols;

const markPath = (x, y) => {
    const cellIndex = x * cols + y;
    const cell = document.querySelectorAll('.cell')[cellIndex];
    if (cell.classList.contains('start') || cell.classList.contains('end')) return false;
    cell.classList.add('path');
    logMessage(`Marking path at (${x}, ${y})`);
    return x === end.x && y === end.y;
};

createMaze();
