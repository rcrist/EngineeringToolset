import { Comp } from '../components/Comp.js';
import { pkg_14 } from './packages.js';

/**
 * Quad And Gate in 14-pin pkg
 */
export class SN7400 extends Comp {
    constructor(x, y, angle) {
        super(x, y, angle);
        this.width = 60;
        this.height = 100;

        // Connector locations
        const offX = 0;
        const offY = 30;
        this.conns = [
            { name: "A1", type: "input", x: 0, y: offY, state: false },
            { name: "B1", type: "input", x: 0, y: offY + 10, state: false },
            { name: "Y1", type: "output", x: 0, y: offY + 20, state: false },
            { name: "A2", type: "input", x: 0, y: offY + 30, state: false },
            { name: "B2", type: "input", x: 0, y: offY + 40, state: false },
            { name: "Y2", type: "output", x: 0, y: offY + 50, state: false },
            { name: "GND", type: "input", x: 0, y: offY + 60, state: false },

            { name: "VCC", type: "input", x: this.width, y: offY, state: false },
            { name: "B4", type: "input", x: this.width, y: offY + 10, state: false },
            { name: "A4", type: "input", x: this.width, y: offY + 20, state: false },
            { name: "Y4", type: "output", x: this.width, y: offY + 30, state: false },
            { name: "B3", type: "input", x: this.width, y: offY + 40, state: false },
            { name: "A3", type: "input", x: this.width, y: offY + 50, state: false },
            { name: "Y3", type: "output", x: this.width, y: offY + 60, state: false },
        ];
    }

    update() {
        const gates = [
            { A: "A1", B: "B1", Y: "Y1" },
            { A: "A2", B: "B2", Y: "Y2" },
            { A: "A3", B: "B3", Y: "Y3" },
            { A: "A4", B: "B4", Y: "Y4" }
        ];
    
        gates.forEach(gate => {
            const A = this.conns.find(conn => conn.name === gate.A);
            const B = this.conns.find(conn => conn.name === gate.B);
            const Y = this.conns.find(conn => conn.name === gate.Y);
            if (A && B && Y) {
                Y.state = A.state && B.state;
            }
        });
    }

    draw(context) {
        // Calculate the center point
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Save canvas state
        context.save();

        // Translate to center and rotate in place
        context.translate(centerX, centerY);
        const rad = this.angle * (Math.PI / 180); // Convert degrees to radians
        context.rotate(rad);

        // Adjust drawing to account for translation
        context.translate(-centerX, -centerY);

        pkg_14(context, this);

        // Helper function to draw a connector
        const drawConnector = (conn, name) => {
            const x = conn.x; const y = conn.y;
            context.beginPath();
            context.fillStyle = 'white';
            context.arc(this.x + x, this.y + y, 3, 0, 2 * Math.PI); // Draw circle
            context.fill();


            // Determine text position
            const textOffsetX = x > this.width / 2 ? -20 : 8; // Left of pin for right-side connectors
            const textOffsetY = 3;

            // Draw connector name
            name = conn.name;
            context.fillStyle = 'white';
            context.font = '8px Arial';
            context.fillText(name, this.x + x + textOffsetX, this.y + y + textOffsetY);
        };

        // Draw connectors
        this.conns.forEach(conn => {
            drawConnector(conn);
        });

        // Draw IC Name
        const textOffsetX = this.width / 4 - 8;
        const textOffsetY = 10;
        context.fillStyle = 'black';
        context.font = '12px Arial';
        context.fillText('SN7400', this.x + textOffsetX, this.y + textOffsetY);

        // Restore canvas state
        context.restore();
    }
}