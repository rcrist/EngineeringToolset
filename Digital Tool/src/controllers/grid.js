const gridSize = 10;

export function drawGrid(context) {
    const { width, height } = context.canvas;

    context.save();
    context.strokeStyle = '#ccc'; // Light gray color for the grid
    context.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }

    context.restore();
}

export function snapToGrid(x, y) {
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return { x: snappedX, y: snappedY };
}