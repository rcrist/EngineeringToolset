export const shapes = [];

export function addShape(shape) {
    shapes.push(shape);
}

export function removeShape(shape) {
    shapes.splice(shape);
}

export function selectShape(mouseX, mouseY) {
    for (const shape of shapes) {
        if (shape.isInsideShape(mouseX, mouseY)) {
            return shape;
        }
    }
}