import { Comp } from './Comp.js';

export class NotGate extends Comp {
    constructor(x, y, angle) {
        super(x, y, angle);
        this.image = document.getElementById('not-image');

        // Define the connector locations in world coordinates
        this.conns = [
            { name: "in1", type: "input", x: 0, y: 20, state: false },
            { name: "out", type: "output", x: this.width, y: 20, state: false },
        ];
    }

    update() {
        const in1 = this.conns.find(conn => conn.name === "in1");
        const out = this.conns.find(conn => conn.name === "out");
        out.state = !(in1.state); 
    }
}