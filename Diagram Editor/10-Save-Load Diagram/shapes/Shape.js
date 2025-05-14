import { defaultFillColor, defaultBorderColor, defaultBorderWidth } from "../utilities/defaultUtils.js";

export class Shape {
    constructor(x, y, width, height, rotation) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;

        this.fillColor = defaultFillColor;
        this.borderColor = defaultBorderColor;
        this.borderWidth = defaultBorderWidth;
    }

    drawSelectors(ctx) {
        // Draw resize selector
        const selectorSize = 10;
        ctx.fillStyle = '#ffffff88';
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 1;

        // Calculate rotated position for the resize selector
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const resizeX = centerX + Math.cos(this.rotation) * (this.width / 2) - Math.sin(this.rotation) * (this.height / 2);
        const resizeY = centerY + Math.sin(this.rotation) * (this.width / 2) + Math.cos(this.rotation) * (this.height / 2);

        ctx.save(); // Save the current context state
        ctx.translate(resizeX, resizeY); // Move to the rotated position
        ctx.rotate(this.rotation); // Apply the rotation
        ctx.fillRect(-selectorSize / 2, -selectorSize / 2, selectorSize, selectorSize);
        ctx.strokeRect(-selectorSize / 2, -selectorSize / 2, selectorSize, selectorSize);
        ctx.restore(); // Restore the context state

        // Draw rotation selector - line
        const rightCenterX = centerX + Math.cos(this.rotation) * (this.width / 2);
        const rightCenterY = centerY + Math.sin(this.rotation) * (this.width / 2);
        const selectorX = rightCenterX + Math.cos(this.rotation) * 30;
        const selectorY = rightCenterY + Math.sin(this.rotation) * 30;

        ctx.strokeStyle = '#888888';
        ctx.beginPath();
        ctx.moveTo(rightCenterX, rightCenterY); // Start from the right center
        ctx.lineTo(selectorX, selectorY); // End at the selector position
        ctx.stroke();

        // Draw rotation selector - circle
        ctx.beginPath();
        ctx.arc(selectorX, selectorY, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
    }

    isInsideResizeSelector(mouseX, mouseY) {
        const rectBounds = canvas.getBoundingClientRect();
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        const resizeX = centerX + Math.cos(this.rotation) * (this.width / 2) - Math.sin(this.rotation) * (this.height / 2);
        const resizeY = centerY + Math.sin(this.rotation) * (this.width / 2) + Math.cos(this.rotation) * (this.height / 2);

        const dx = mouseX - resizeX;
        const dy = mouseY - resizeY;
        return Math.sqrt(dx * dx + dy * dy) < 10;
    }

    isInsideRotationSelector(mouseX, mouseY) {
        const selectorX = this.x + this.width / 2 + Math.cos(this.rotation) * (this.width / 2 + 30);
        const selectorY = this.y + this.height / 2 + Math.sin(this.rotation) * (this.width / 2 + 30);

        const dx = mouseX - selectorX;
        const dy = mouseY - selectorY;
        return Math.sqrt(dx * dx + dy * dy) < 10;
    }

    isInsideShape(mouseX, mouseY) {
        // Translate the mouse coordinates relative to the rectangle's center
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
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
}