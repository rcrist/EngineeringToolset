import { Shape } from "./Shape.js";

export class Rectangle extends Shape {
    constructor(x, y, width, height, rotation) {
        super(x, y, width, height, rotation)
    }

    draw(ctx) {
        // Draw rectangle
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        ctx.fillStyle = this.fillColor;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }

    serialize() {
        return {
            type: "Rectangle",
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
        const shape = new Rectangle(data.x, data.y, data.width, data.height, data.rotation);
        shape.fillColor = data.fillColor;
        shape.borderColor = data.borderColor;
        shape.borderWidth = data.borderWidth;
        return shape;
    }
}