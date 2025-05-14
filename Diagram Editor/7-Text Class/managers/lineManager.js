export function handleLineMove(mouseX, mouseY, selectedShape) {
    if (selectedShape.isInsideStartSelector(mouseX, mouseY))
        updateLineStart(mouseX, mouseY, selectedShape);
    else if (selectedShape.isInsideEndSelector(mouseX, mouseY))
        updateLineEnd(mouseX, mouseY, selectedShape);
}

function updateLineEnd(mouseX, mouseY, selectedShape) {
    selectedShape.endX = mouseX;
    selectedShape.endY = mouseY;
}

function updateLineStart(mouseX, mouseY, selectedShape) {
    selectedShape.startX = mouseX;
    selectedShape.startY = mouseY;
}

export function updateLineDraw(mouseX, mouseY, newLine) {
    if (newLine) {
        newLine.endX = mouseX;
        newLine.endY = mouseY;
    }
}