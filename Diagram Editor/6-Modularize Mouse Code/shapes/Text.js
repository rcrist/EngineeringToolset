import { Shape } from "./Shape.js";

export class Text extends Shape {
    constructor(x, y, textStr) {
        super(x, y, 0, 0)
        this.textStr = textStr;

        this.fillColor = "white";
        this.strokeColor = "#444444";
        this.lineWidth = 1;

        this.font = '20px Arial'
        this.width = 0;
        this.height = 20;
    }

    draw(ctx) {
        ctx.save();

        // Calculate the center of the text
        const centerX = this.x + this.width / 2;
        const centerY = this.y - this.height / 2;

        // Translate to the center, rotate, and translate back
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width / 2, this.height / 2);

        // Set styles and draw the text
        ctx.font = this.font;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;

        ctx.fillText(this.textStr, 0, 0);
        ctx.strokeText(this.textStr, 0, 0);

        ctx.restore();
    }

    drawSelectors(ctx) {
        const selectorSize = 3;

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;

        let points = [
            { x: this.x, y: this.y },                            // Top left
            { x: this.x + this.width, y: this.y },               // Top right
            { x: this.x + this.width, y: this.y - this.height }, // Bottom right
            { x: this.x, y: this.y - this.height },              // Bottom left
        ]

        points.forEach(point => {
            ctx.strokeRect(point.x - selectorSize, point.y - selectorSize, selectorSize * 2, selectorSize * 2);
        });
        ctx.stroke();
    }

    isInsideShape(mouseX, mouseY) {
        // Ensure the width is updated based on the current text
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = this.font;
        this.getTextWidth(ctx);

        // Translate the mouse coordinates relative to the rectangle's center
        const centerX = this.x + this.width / 2;
        const centerY = this.y - this.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        // Rotate the mouse coordinates back by the negative of the rectangle's rotation
        const rotatedX = dx * Math.cos(-this.rotation) - dy * Math.sin(-this.rotation);
        const rotatedY = dx * Math.sin(-this.rotation) + dy * Math.cos(-this.rotation);

        // Check if the rotated point is within the unrotated rectangle's bounds
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        return (
            rotatedX >= -halfWidth &&
            rotatedX <= halfWidth &&
            rotatedY >= -halfHeight &&
            rotatedY <= halfHeight
        );
    }

    getTextWidth(ctx) {
        const metrics = ctx.measureText(this.textStr);
        this.width = metrics.width;
    }
}