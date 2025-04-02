import { Comp } from './Comp.js';

export class Clock extends Comp {
    constructor(x, y) {
        super(x, y);
        this.image = document.getElementById('clock-image');

       // Connector draw points - includes inputs and outputs - doesn't change with rotation
       this.conns = [{ name: "out", type: "output", x: this.width, y: 20 , state: false}];

        // Logic states
        this.isOn = false;  // Use a boolean here: On - true, Off - false
        this.isToggling = false;

        // Frequency and timer
        this.frequency = 1; // Default frequency in Hz
        this.timer = null;
    }

    update() {
        const conn = this.conns.find(conn => conn.name === "out");
        conn.state = this.isOn ? 1 : 0;
    }

    handleClick(x, y) {
        // Check if the click is inside the clock
        this.isToggling ? this.stopToggling() : this.startToggling();
    }

    startToggling() {
        const interval = 1000 / (2 * this.frequency); // Half-period in milliseconds
        this.timer = setInterval(() => {
            this.isOn = !this.isOn;
            this.isToggling = true;
            this.update();
        }, interval);
    }

    stopToggling() {
        if (this.timer) {
            clearInterval(this.timer);
            this.isToggling = false;
            this.timer = null;
        }
    }
}