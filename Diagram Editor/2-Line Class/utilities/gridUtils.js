// Snap-to-grid function
export function snapToGrid(x, y) {
    const gridSpacing = 10;
    const snappedX = Math.round(x / gridSpacing) * gridSpacing;
    const snappedY = Math.round(y / gridSpacing) * gridSpacing;
    return { x: snappedX, y: snappedY };
}

// Draw the grid on the canvas
export function drawGrid(ctx) {
    const gridSpacing = 10;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}