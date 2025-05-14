// Line Class
export class Line {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        this.borderColor = "black";
        this.borderWidth = 2;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }

    drawSelectors(ctx) {
        const selectorSize = 4;

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.startX - selectorSize, this.startY - selectorSize, selectorSize * 2, selectorSize * 2); // Start selector
        ctx.strokeRect(this.endX - selectorSize, this.endY - selectorSize, selectorSize * 2, selectorSize * 2); // End selector
    }

    isInsideShape(mouseX, mouseY) {
        const threshold = 5; // Allowable distance from the line

        // Calculate the distance from the point to the line
        const numerator = Math.abs((this.endY - this.startY) * mouseX - (this.endX - this.startX) * mouseY +
            this.endX * this.startY - this.endY * this.startX);
        const denominator = Math.sqrt((this.endY - this.startY) ** 2 + (this.endX - this.startX) ** 2);

        const distance = numerator / denominator;

        // Check if the distance is within the threshold
        return distance <= threshold;
    }

    isInsideStartSelector(mouseX, mouseY) {
        const selectorSize = 10;
        const result = mouseX >= this.startX - selectorSize && mouseX <= this.startX + selectorSize &&
            mouseY >= this.startY - selectorSize && mouseY <= this.startY + selectorSize;
        return mouseX >= this.startX - selectorSize && mouseX <= this.startX + selectorSize &&
            mouseY >= this.startY - selectorSize && mouseY <= this.startY + selectorSize
    }

    isInsideEndSelector(mouseX, mouseY) {
        const selectorSize = 10;
        const result = mouseX >= this.endX - selectorSize && mouseX <= this.endX + selectorSize &&
            mouseY >= this.endY - selectorSize && mouseY <= this.endY + selectorSize;
        return mouseX >= this.endX - selectorSize && mouseX <= this.endX + selectorSize &&
            mouseY >= this.endY - selectorSize && mouseY <= this.endY + selectorSize
    }
}