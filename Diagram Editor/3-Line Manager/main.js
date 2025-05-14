import { snapToGrid, drawGrid } from "./utilities/gridUtils.js";
import { Line } from "./shapes/Line.js";
import { shapes, selectShape } from "./managers/shapesManager.js";
import { handleLineMove, updateLineDraw } from "./managers/lineManger.js";

// Canvas variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

let selectedShape = null;

// Mouse event state variables
let isDrawingLine = false;
let isResizingLine = false;
let newLine = null;

// Mouse event handlers
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

function handleMouseDown(event) {
    const { mouseX, mouseY } = getMousePosition(event);

    if (isDrawingLine) {
        const snapped = snapToGrid(mouseX, mouseY);
        newLine = new Line(snapped.x, snapped.y, snapped.x, snapped.y);
        shapes.push(newLine);
        redrawCanvas();
        return;
    }

    selectedShape = selectShape(mouseX, mouseY);
    redrawCanvas()

    if (!selectedShape) {
        selectedShape = null;
        redrawCanvas();
        return;
    }

    if (selectedShape && selectedShape.constructor.name === "Line") {
        isResizingLine = true;
        return;
    }
}

function handleMouseMove(event) {
    const { mouseX, mouseY } = getMousePosition(event);
    const snapped = snapToGrid(mouseX, mouseY);

    if (isDrawingLine) {
        updateLineDraw(snapped.x, snapped.y, newLine);
        redrawCanvas();
        return;
    }

    if (isResizingLine) {
        handleLineMove(snapped.x, snapped.y, selectedShape);
        redrawCanvas();
        return;
    }
}

function handleMouseUp(event) {
    isDrawingLine = false;
    isResizingLine = false;
    newLine = null;
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

function createShape(type) {
    let shape = null;
    if (type === 'line') {
        isDrawingLine = true;
    }
}
window.createShape = createShape;

// Initial canvas draw to show the grid
redrawCanvas();