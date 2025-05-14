export const shapes = [];

export function addShape(shape) {
    shapes.push(shape);
}

export function removeShape(shape) {
    shapes.splice(shape);
}