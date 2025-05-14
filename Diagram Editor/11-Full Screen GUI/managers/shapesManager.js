import { snapToGrid } from "../utilities/gridUtils.js";

export let selectedShape = null;
export const shapes = [];

export function addShape(shape) {
    shapes.push(shape);
}

export function removeShape(shape) {
    shapes.splice(shape);
}

export function setSelectedShape(shape) {
    selectedShape = shape;
}

export function selectShape(mouseX, mouseY, setIsMoving, redrawCanvas) {
    for (const shape of shapes) {
        if (shape.isInsideShape(mouseX, mouseY)) {
            if (shape.constructor.name != "Line") {
                setIsMoving(true);
            }
            setSelectedShape(shape);
            redrawCanvas();
            return;
        }
    }
}

export function handleShapeActions(mouseX, mouseY, redrawCanvas, setIsResizing,
         setIsRotating, setInitialMouse, setInitialSize) {
    if (selectedShape.isInsideResizeSelector(mouseX, mouseY)) {
        startResizing(mouseX, mouseY, setIsResizing, setInitialMouse, setInitialSize);
    } else if (selectedShape.isInsideRotationSelector(mouseX, mouseY)) {
        startRotating(setIsRotating);
    } else {
        setSelectedShape(null);
        redrawCanvas();
    }
}

function startResizing(mouseX, mouseY, setIsResizing, setInitialMouse, setInitialSize) {
    setIsResizing(true);
    let initialMouseX = mouseX;
    let initialMouseY = mouseY;
    setInitialMouse({initialMouseX, initialMouseY});
    let initialWidth = selectedShape.width;
    let initialHeight = selectedShape.widtht;
    setInitialSize({initialWidth, initialHeight});
}

function startRotating(setIsRotating) {
    setIsRotating(true);
}

export function rotateShape(mouseX, mouseY, redrawCanvas) {
    const centerX = selectedShape.x + selectedShape.width / 2;
    const centerY = selectedShape.y + selectedShape.height / 2;
    let angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    const snapAngle = Math.PI / 18;
    angle = Math.round(angle / snapAngle) * snapAngle;
    selectedShape.rotation = angle;
    redrawCanvas();
}

export function resizeShape(mouseX, mouseY, redrawCanvas) {
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

export function moveShape(mouseX, mouseY, redrawCanvas) {
    const snappedShape = snapToGrid(mouseX - selectedShape.width / 2, mouseY - selectedShape.height / 2);
    selectedShape.x = snappedShape.x;
    selectedShape.y = snappedShape.y;
    redrawCanvas();
}

export function getMousePosition(e) {
    const rectBounds = canvas.getBoundingClientRect();
    return {
        mouseX: e.clientX - rectBounds.left,
        mouseY: e.clientY - rectBounds.top,
    };
}