import { Comp } from './Comp.js';

export class XnorGate extends Comp {
    constructor(x, y, angle) {
        super(x, y, angle);
        this.image = document.getElementById('xnor-image');
    }

    update() {
        const in1 = this.conns.find(conn => conn.name === "in1");
        const in2 = this.conns.find(conn => conn.name === "in2");
        const out = this.conns.find(conn => conn.name === "out");
        out.state = !(in1.state ^ in2.state);
    }
}