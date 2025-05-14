import { Shape } from "./Shape.js";

export class Image extends Shape {
    constructor(x, y, width, height, rotation, image, filename) {
        super(x, y, width, height, rotation)

        this.image = image;
        this.filename = filename;
    }

    draw(ctx) {
        ctx.save();
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);

        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }

    isInsideShape(mouseX, mouseY) {
        // Translate the mouse coordinates relative to the shape's center
        const centerX = this.x;
        const centerY = this.y;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        // Rotate the mouse coordinates back by the negative of the shape's rotation
        const rotatedX = dx * Math.cos(-this.rotation) - dy * Math.sin(-this.rotation);
        const rotatedY = dx * Math.sin(-this.rotation) + dy * Math.cos(-this.rotation);

        // Check if the rotated point is within the unrotated shape's bounds
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        return (
            rotatedX >= this.x - this.width &&
            rotatedX <= this.x + this.width &&
            rotatedY >= this.y - this.height &&
            rotatedY <= this.y + this.height
        );
    }

    serialize() {
        // Convert the image to a base64 string
        const canvas = document.createElement("canvas");
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.image, 0, 0);

        return {
            type: "Image",
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rotation: this.rotation,
            filename: this.filename,
            src: canvas.toDataURL() // Convert to base64
        };
    }

    static deserialize(data) {
        const img = new window.Image();
        img.src = data.src; // Use the base64 string as the source
        return new Image(data.x, data.y, data.width, data.height, data.rotation, img, data.filename);
    }
}