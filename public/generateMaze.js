const mazeLen = 31;
const mazeHeight = 31;


const directions = [
    {dx: -1, dy: 0},
    {dx: 1, dy: 0},
    {dx: 0, dy: -1},
    {dx: 0, dy: 1},
];

function isInsideCanvas(x, y) {
    return x >= 0 && x < mazeLen && y >= 0 && y < mazeHeight;
}

export function generateMaze(canvas, num) {
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 32, 32);

    const maze = Array.from({length: mazeHeight}, () =>
        Array.from({length: mazeLen}, () => false)
    );

    const stack = [];
    const startX = 1;
    const startY = 1;

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

    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeLen; x++) {
            if (maze[y][x]) ctx.fillStyle = 'white';
            else ctx.fillStyle = 'black';
            ctx.fillRect(x, y, 1, 1);
        }
    }

    // Generate invisible walls
    const invisWallCount = Math.floor(Math.random() * 8);
    ctx.fillStyle = 'red';
    for (let i = 0; i < invisWallCount; i++) {
        while (true) {
            let x = Math.floor(1 + Math.random() * (mazeLen - 3));
            let y = Math.floor(1 + Math.random() * (mazeHeight - 3));
            if ((x !== 1 || y !== 1) && (x !== mazeLen - 2 || y !== mazeHeight - 2) && maze[y][x]) {
                ctx.fillRect(x, y, 1, 1);
                break;
            }
        }
    }

    ctx.fillStyle = `rgb(0, 255, 0)`;
    ctx.fillRect(1, 1, 1, 1);

    ctx.fillStyle = 'blue';
    ctx.fillRect(mazeLen - 2, mazeHeight - 2, 1, 1);
    const buffer = ctx.getImageData(0, 0, 32, 32);

    console.log(`Generated maze${num}.png`);

    return buffer
}
