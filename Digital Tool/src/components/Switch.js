import { Comp } from './Comp.js';

export class Switch extends Comp {
    constructor(x, y) {
        super(x, y);
        this.width = 40;
        this.height = 20;

        // Connector draw points - includes inputs and outputs - doesn't change with rotation
        this.conns = [{ name: "out", type: "output", x: this.width, y: 10 , state: false}];

        // Logic states
        this.isOn = false;  // Use a boolean here: On - true, Off - false
    }

    update() {
        const conn = this.conns.find(conn => conn.name === "out");
        conn.state = this.isOn ? 1 : 0;
    }

    handleClick(x, y) {
        // Check if the click is within the bounds of the switch
        if (this.isPointInside(x, y)) {
            this.isOn = !this.isOn; // Toggle the state
            this.update(); // Update the output state
            return true; // Indicate that the switch was clicked
        }
        return false;
    }

    drawContent(context) {
        // Draw component filled border
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.fillStyle = '#400';
        context.fillRect(this.x, this.y, this.width, this.height);

        // Draw component connectors
        this.conns.forEach(conn => {
            this.drawConn(context, conn);
        });

        // Draw the switch based on its state
        context.fillStyle = this.isOn ? '#000' : 'white';
        context.fillRect(this.x + 5, this.y + 5, 15, 10);
        context.fillStyle = this.isOn ? 'white' : '#000';
        context.fillRect(this.x + 20, this.y + 5, 15, 10);
    }
}