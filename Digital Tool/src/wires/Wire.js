export class Wire {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.color = 'white'; // Default color
        // this.state = false;
    }

    update() {
        // this.color = this.state ? 'green' : 'white';
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.stroke();
    }

    debugPrintWire() {
        console.log(`Wire start: (${this.startX}, ${this.startY}), end: (${this.endX}, ${this.endY})`);
    }
}