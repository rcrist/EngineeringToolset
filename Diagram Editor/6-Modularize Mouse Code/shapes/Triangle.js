import { Shape } from "./Shape.js";

export class Triangle extends Shape {
    constructor(x, y, width, height, rotation) {
        super(x, y, width, height, rotation)

        this.fillColor = "yellow";
        this.borderColor = "black";
        this.borderWidth = 5;
    }

    draw(ctx) {
        // Draw the triangle
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, this.height / 2);
        ctx.lineTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.closePath();
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.fill();
        ctx.stroke();

        // Draw rectangle
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }
}