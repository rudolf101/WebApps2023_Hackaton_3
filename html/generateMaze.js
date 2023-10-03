const {createCanvas} = require('canvas');
const fs = require('fs');


const mazeLen = 30;
const mazeHeight = 30;


const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const maze = Array.from({length: mazeHeight}, () =>
    Array.from({length: mazeLen}, () => false)
);


const directions = [
    {dx: -1, dy: 0},
    {dx: 1, dy: 0},
    {dx: 0, dy: -1},
    {dx: 0, dy: 1},
];


function isInsideCanvas(x, y) {
    return x >= 0 && x < mazeLen && y >= 0 && y < mazeHeight;
}


function generateMaze() {
    const stack = [];
    const startX = 1;
    const startY = Math.floor(Math.random() * mazeHeight);

    let currentX = startX;
    let currentY = startY;

    maze[currentY][currentX] = true;
    stack.push({x: currentX, y: currentY});

    while (stack.length > 0) {
        const neighbors = [];

        for (const direction of directions) {
            const newX = currentX + 2 * direction.dx;
            const newY = currentY + 2 * direction.dy;

            if (isInsideCanvas(newX, newY) && !maze[newY][newX]) {
                neighbors.push({x: newX, y: newY});
            }
        }

        if (neighbors.length > 0) {
            const {x, y} = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[y][x] = true;
            maze[currentY + (y - currentY) / 2][currentX + (x - currentX) / 2] = true;
            stack.push({x, y});
            currentX = x;
            currentY = y;
        } else {
            const {x, y} = stack.pop();
            currentX = x;
            currentY = y;
        }
    }
}


generateMaze();


for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeLen; x++) {
        if (maze[y][x]) ctx.fillStyle = 'white';
        else ctx.fillStyle = 'black';
        ctx.fillRect(x, y, 1, 1);
    }
}


ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 1, 1);

ctx.fillStyle = 'blue';
ctx.fillRect(mazeLen - 1, mazeHeight - 1, 1, 1);


const buffer = canvas.toBuffer('image/jpeg');
fs.writeFileSync('maze.jpg', buffer);

console.log('Generated maze.jpg');
