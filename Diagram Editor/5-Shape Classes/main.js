import { Rectangle } from "./shapes/Rectangle.js";
import { Triangle } from "./shapes/Triangle.js";
import { Oval } from "./shapes/Oval.js";
import { Line } from "./shapes/Line.js";
import { shapes } from "./managers/shapesManager.js";
import { snapToGrid, drawGrid } from "./utilities/gridUtils.js";
import { handleLineMove, updateLineDraw } from "./managers/lineManager.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let currentTheme = "light";

// Group state variables
let isRotating = false;
let isResizing = false;
let isMoving = false;
let isDrawingLine = false;
let isResizingLine = false;
let startLineDraw = false;
let selectedShape = null;
let newLine = null;
let initialMouseX = null;
let initialMouseY = null;
let initialWidth = null;
let initialHeight = null;

redrawCanvas();

const fillColorPicker = document.getElementById("fillColorPicker");
const borderColorPicker = document.getElementById("borderColorPicker");

// Add event listeners for color pickers
fillColorPicker.addEventListener("input", (event) => {
    const selectedFillColor = event.target.value;
    if (selectedShape) {
        selectedShape.fillColor = selectedFillColor;
        redrawCanvas();
    }
});

borderColorPicker.addEventListener("input", (event) => {
    const selectedBorderColor = event.target.value;
    if (selectedShape) {
        selectedShape.borderColor = selectedBorderColor;
        redrawCanvas();
    }
});

// Centralized mouse event handlers
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

function handleMouseDown(e) {
    const { mouseX, mouseY } = getMousePosition(e);

    if (startLineDraw) {
        const snapped = snapToGrid(mouseX, mouseY);
        newLine = new Line(snapped.x, snapped.y, snapped.x, snapped.y);
        shapes.push(newLine);
        startLineDraw = false;
        isDrawingLine = true;
        redrawCanvas();
        return;
    }

    if (!selectedShape) {
        selectShape(mouseX, mouseY);
        return;
    }

    if (selectedShape.constructor.name === "Line") {
        if (selectedShape.isInsideShape(mouseX, mouseY)) {
            isResizingLine = true;
        } else {
            selectedShape = null;
            redrawCanvas();
        }
        return;
    }

    handleShapeActions(mouseX, mouseY);
}

function handleMouseMove(e) {
    const { mouseX, mouseY } = getMousePosition(e);
    const snapped = snapToGrid(mouseX, mouseY);

    if (isDrawingLine) {
        updateLineDraw(snapped.x, snapped.y, newLine);
        redrawCanvas();
    } else if (isResizingLine) {
        handleLineMove(snapped.x, snapped.y, selectedShape);
        redrawCanvas();
    } else if (isRotating) {
        rotateShape(mouseX, mouseY);
    } else if (isResizing) {
        resizeShape(mouseX, mouseY);
    } else if (isMoving) {
        moveShape(mouseX, mouseY);
    }
}

function handleMouseUp() {
    isRotating = false;
    isResizing = false;
    isMoving = false;
    isDrawingLine = false;
    isResizingLine = false;
    newLine = null;
}

function selectShape(mouseX, mouseY) {
    for (const shape of shapes) {
        if (shape.isInsideShape(mouseX, mouseY)) {
            if (shape.constructor.name != "Line") {
                isMoving = true;
            }
            selectedShape = shape;
            redrawCanvas();
            return;
        }
    }
}

function handleShapeActions(mouseX, mouseY) {
    if (selectedShape.isInsideResizeSelector(mouseX, mouseY)) {
        startResizing(mouseX, mouseY);
    } else if (selectedShape.isInsideRotationSelector(mouseX, mouseY)) {
        startRotating();
    } else {
        selectedShape = null;
        redrawCanvas();
    }
}

function startResizing(mouseX, mouseY) {
    isResizing = true;
    initialMouseX = mouseX;
    initialMouseY = mouseY;
    initialWidth = selectedShape.width;
    initialHeight = selectedShape.height;
}

function startRotating() {
    isRotating = true;
}

function updateLineDrawing(mouseX, mouseY) {
    newLine.endX = mouseX;
    newLine.endY = mouseY;
    redrawCanvas();
}

function rotateShape(mouseX, mouseY) {
    const centerX = selectedShape.x + selectedShape.width / 2;
    const centerY = selectedShape.y + selectedShape.height / 2;
    let angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    const snapAngle = Math.PI / 10;
    angle = Math.round(angle / snapAngle) * snapAngle;
    selectedShape.rotation = angle;
    redrawCanvas();
}

function resizeShape(mouseX, mouseY) {
    const centerX = selectedShape.x + selectedShape.width / 2;
    const centerY = selectedShape.y + selectedShape.height / 2;
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const rotatedDx = dx * Math.cos(-selectedShape.rotation) - dy * Math.sin(-selectedShape.rotation);
    const rotatedDy = dx * Math.sin(-selectedShape.rotation) + dy * Math.cos(-selectedShape.rotation);
    selectedShape.width = Math.max(20, Math.round(rotatedDx * 2 / 10) * 10);
    selectedShape.height = Math.max(20, Math.round(rotatedDy * 2 / 10) * 10);
    selectedShape.x = centerX - selectedShape.width / 2;
    selectedShape.y = centerY - selectedShape.height / 2;
    redrawCanvas();
}

function moveShape(mouseX, mouseY) {
    const snappedShape = snapToGrid(mouseX - selectedShape.width / 2, mouseY - selectedShape.height / 2);
    selectedShape.x = snappedShape.x;
    selectedShape.y = snappedShape.y;
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

    if (type == "line") {
        startLineDraw = true;
    }
    else {
        if (type === "rectangle") {
            shape = new Rectangle(100, 100, 50, 50, 0);
        } else if (type === "circle") {
            shape = new Oval(100, 100, 50, 50, 0);
        } else if (type === "triangle") {
            shape = new Triangle(100, 100, 50, 50, 0);
        }

        shapes.push(shape);
        redrawCanvas();
    }
}
window.addShape = addShape;

function updateBorderWidth() {
    const borderWidthRange = document.getElementById("borderWidthRange");
    const newBorderWidth = parseInt(borderWidthSelect.value, 10);

    if (selectedShape) {
        selectedShape.borderWidth = newBorderWidth; // Update the border width of the selected shape
        redrawCanvas(); // Redraw the canvas to reflect the changes
    }
}
window.updateBorderWidth = updateBorderWidth;

function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.body.className = `${currentTheme}-mode`;
    console.log(`Theme changed to ${currentTheme}`);
}
window.toggleTheme = toggleTheme;