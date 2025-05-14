import { snapToGrid, drawGrid } from "./utilities/gridUtils.js";
import { Line } from "./shapes/Line.js";

// Canvas variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
const shapes = [];

// Mouse event state variables
let isDrawingLine = false;
let isResizingLine = false;
let newLine = null;
let selectedShape = null;

// Mouse event handlers
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

function handleMouseDown(event) {
    const { mouseX, mouseY } = getMousePosition(event);

    if (isDrawingLine) {
        const snapped = snapToGrid(mouseX, mouseY);
        startLineDraw(snapped.x, snapped.y);
        return;
    }

    selectShape(mouseX, mouseY);

    if (!selectedShape) {
        selectedShape = null;
        redrawCanvas();
        return
    }

    if (selectedShape && selectedShape.constructor.name === "Line") {
        isResizingLine = true;
    }
}

function handleMouseMove(event) {
    const { mouseX, mouseY } = getMousePosition(event);
    const snapped = snapToGrid(mouseX, mouseY);

    if (isDrawingLine) {
        updateLineDraw(snapped.x, snapped.y);
        return;
    }

    if (isResizingLine) {
        handleLineMove(snapped.x, snapped.y);
    }
}

function handleMouseUp(event) {
    isDrawingLine = false;
    isResizingLine = false;
    newLine = null;
}

function selectShape(mouseX, mouseY) {
    selectedShape = null;
    for (const shape of shapes) {
        if (shape.isInsideShape(mouseX, mouseY)) {
            selectedShape = shape;
            redrawCanvas();
            return;
        }
    }
}

function handleLineMove(mouseX, mouseY) {
    if (selectedShape.isInsideStartSelector(mouseX, mouseY))
        updateLineStartDraw(mouseX, mouseY);
    else if (selectedShape.isInsideEndSelector(mouseX, mouseY))
        updateLineEndDraw(mouseX, mouseY);
}

function startLineDraw(mouseX, mouseY) {
    newLine = new Line(mouseX, mouseY, mouseX, mouseY);
    shapes.push(newLine);
    redrawCanvas();
}

function updateLineDraw(mouseX, mouseY) {
    if (newLine) {
        newLine.endX = mouseX;
        newLine.endY = mouseY;
        redrawCanvas();
    }
}

function updateLineStartDraw(mouseX, mouseY) {
    selectedShape.startX = mouseX;
    selectedShape.startY = mouseY;
    redrawCanvas();
}

function updateLineEndDraw(mouseX, mouseY) {
    selectedShape.endX = mouseX;
    selectedShape.endY = mouseY;
    redrawCanvas();
}

function getMousePosition(e) {
    const rectBounds = canvas.getBoundingClientRect();
    return {
        mouseX: e.clientX - rectBounds.left,
        mouseY: e.clientY - rectBounds.top,
    };
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx);

    for (const shape of shapes) {
        shape.draw(ctx);

        if (shape === selectedShape) {
            shape.drawSelectors(ctx);
        }
    }
}

function addShape(type) {
    let shape = null;
    if (type === 'line') {
        isDrawingLine = true;
    }
}
window.addShape = addShape;

// Initial canvas draw to show the grid
redrawCanvas();