import { Rectangle } from "./shapes/Rectangle.js";
import { Triangle } from "./shapes/Triangle.js";
import { Oval } from "./shapes/Oval.js";
import { Line } from "./shapes/Line.js";
import { Text } from "./shapes/Text.js";
import { Image } from "./shapes/Image.js";
import {
    shapes, selectShape, selectedShape, setSelectedShape,
    handleShapeActions, rotateShape, resizeShape, moveShape,
    getMousePosition
} from "./managers/shapesManager.js";
import { snapToGrid, drawGrid } from "./utilities/gridUtils.js";
import { handleLineMove, updateLineDraw } from "./managers/lineManager.js";
import { setDarkTheme, setLightTheme } from "./utilities/defaultUtils.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let currentTheme = "light";

let isRotating = false;
let isResizing = false;
let isMoving = false;
let isDrawingLine = false;
let isResizingLine = false;
let startLineDraw = false;
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
canvas.addEventListener('dblclick', handleDoubleClick);

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
        selectShape(mouseX, mouseY, setIsMoving, redrawCanvas);
        return;
    }

    if (selectedShape.constructor.name === "Line") {
        if (selectedShape.isInsideShape(mouseX, mouseY)) {
            isResizingLine = true;
        } else {
            setSelectedShape(null);
            redrawCanvas();
        }
        return;
    }

    handleShapeActions(mouseX, mouseY, redrawCanvas, setIsResizing,
        setIsRotating, setInitialMouse, setInitialSize);
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
        rotateShape(mouseX, mouseY, redrawCanvas);
    } else if (isResizing) {
        resizeShape(mouseX, mouseY, redrawCanvas);
    } else if (isMoving) {
        moveShape(mouseX, mouseY, redrawCanvas);
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

function handleDoubleClick(e) {
    const { mouseX, mouseY } = getMousePosition(e);

    // Check if a Text object is clicked
    const clickedShape = shapes.find(shape => shape.isInsideShape(mouseX, mouseY) && shape.constructor.name === "Text");

    if (clickedShape) {
        const newText = prompt("Enter new text:", clickedShape.text || "");
        if (newText !== null) {
            clickedShape.setText(newText); // Update the text of the Text object
            redrawCanvas(); // Redraw the canvas to reflect the changes
        }
    }
}

function setIsMoving(value) {
    isMoving = value;
}

function setIsResizing(value) {
    isResizing = value;
}

function setIsRotating(value) {
    isRotating = value;
}

function setInitialMouse(value) {
    ({ initialMouseX, initialMouseY } = value);
}

function setInitialSize(value) {
    ({ initialWidth, initialHeight } = value);
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx);

    for (const shape of shapes) {
        if (shape != null) {
            shape.draw(ctx);

            if (shape === selectedShape) {
                shape.drawSelectors(ctx);
            }
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
        } else if (type === "text") {
            shape = new Text(100, 100, "Hello World!");
        } else if (type === "image") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";

            input.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    console.log(`File: ${file.name}`);
                    const img = new window.Image();
                    img.onload = () => {
                        shape = new Image(10, 10, img.width, img.height, 0, img, file.name);
                        shapes.push(shape);
                        redrawCanvas();
                    };
                    img.src = URL.createObjectURL(file);
                }
            });

            input.click();
            return; // Exit the function to wait for the file selection
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

    if (currentTheme === "light") {
        setLightTheme();
    } else if (currentTheme === "dark") {
        setDarkTheme();
    }

    redrawCanvas();
}
window.toggleTheme = toggleTheme;

function saveDiagram() {
    const diagramData = JSON.stringify(shapes.map(shape => shape.serialize()));
    const blob = new Blob([diagramData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diagram.json";
    link.click();
}
window.saveDiagram = saveDiagram;

function loadDiagram() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const diagramData = JSON.parse(e.target.result);
                shapes.length = 0; // Clear existing shapes
                diagramData.forEach(data => {
                    const shape = deserializeShape(data);
                    shapes.push(shape);
                });
                redrawCanvas();
            };
            reader.readAsText(file);
        }
    });

    input.click();
}
window.loadDiagram = loadDiagram;

// Helper function to deserialize shapes
function deserializeShape(data) {
    switch (data.type) {
        case "Rectangle":
            return Rectangle.deserialize(data);
        case "Triangle":
            return Triangle.deserialize(data);
        case "Oval":
            return Oval.deserialize(data);
        case "Line":
            return Line.deserialize(data);
        case "Text":
            return Text.deserialize(data);
        case "Image":
            return Image.deserialize(data);
        default:
            throw new Error(`Unknown shape type: ${data.type}`);
    }
}