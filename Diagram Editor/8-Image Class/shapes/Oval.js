import { Shape } from "./Shape.js";

export class Oval extends Shape {
    constructor(x, y, width, height, rotation) {
        super(x, y, width, height, rotation)

        this.fillColor = "purple";
        this.borderColor = "black";
        this.borderWidth = 5;
    }

    draw(ctx) {
        // Draw the Oval
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
  
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.beginPath(); // Start a new path
        ctx.ellipse(0, 0, this.width/2, this.height/2, 0, 0, Math.PI * 2); // Draw an oval
        ctx.fill();
        ctx.stroke(); // Draw a stroke oval

        // Draw rectangle
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }
}