import { Shape } from "./Shape.js";

export class Oval extends Shape {
    constructor(x, y, width, height, rotation) {
        super(x, y, width, height, rotation)
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

    serialize() {
        return {
            type: "Oval",
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rotation: this.rotation,
            fillColor: this.fillColor,
            borderColor: this.borderColor,
            borderWidth: this.borderWidth
        };
    }

    static deserialize(data) {
        const shape = new Oval(data.x, data.y, data.width, data.height, data.rotation);
        shape.fillColor = data.fillColor;
        shape.borderColor = data.borderColor;
        shape.borderWidth = data.borderWidth;
        return shape;
    }
}