import { Comp } from '../components/Comp.js';
import { pkg } from './packages.js';

export class SN74161 extends Comp {
    constructor(x, y) {
        super(x, y);
        this.width = 80;
        this.height = 110;
        this.count = 0;
        this.bCount = "";
        this.oldClkState = false;

        // Connector locations
        const offX = 0;
        const offY = 30;
        this.conns = [
            { name: "CLR", type: "input", x: 0, y: offY, state: false },
            { name: "CLK", type: "input", x: 0, y: offY + 10, state: false },
            { name: "A", type: "input", x: 0, y: offY + 20, state: false },
            { name: "B", type: "input", x: 0, y: offY + 30, state: false },
            { name: "C", type: "input", x: 0, y: offY + 40, state: false },
            { name: "D", type: "input", x: 0, y: offY + 50, state: false },
            { name: "ENP", type: "input", x: 0, y: offY + 60, state: false },
            { name: "GND", type: "input", x: 0, y: offY + 70, state: false },

            { name: "VCC", type: "input", x: this.width, y: offY, state: false },
            { name: "RCO", type: "output", x: this.width, y: offY + 10, state: false },
            { name: "QA", type: "output", x: this.width, y: offY + 20, state: false },
            { name: "QB", type: "output", x: this.width, y: offY + 30, state: false },
            { name: "QC", type: "output", x: this.width, y: offY + 40, state: false },
            { name: "QD", type: "output", x: this.width, y: offY + 50, state: false },
            { name: "ENT", type: "input", x: this.width, y: offY + 60, state: false },
            { name: "LOAD", type: "input", x: this.width, y: offY + 70, state: false },
        ];
    }

    update() {
        const clrConn = this.conns.find(conn => conn.name === "CLR");
        const loadConn = this.conns.find(conn => conn.name === "LOAD");
        const enpConn = this.conns.find(conn => conn.name === "ENP");
        const entConn = this.conns.find(conn => conn.name === "ENT");
        const aConn = this.conns.find(conn => conn.name === "A");
        const bConn = this.conns.find(conn => conn.name === "B");
        const cConn = this.conns.find(conn => conn.name === "C");
        const dConn = this.conns.find(conn => conn.name === "D");
        const qaConn = this.conns.find(conn => conn.name === "QA");
        const qbConn = this.conns.find(conn => conn.name === "QB");
        const qcConn = this.conns.find(conn => conn.name === "QC");
        const qdConn = this.conns.find(conn => conn.name === "QD");
        const qRcoConn = this.conns.find(conn => conn.name === "RCO");

        const qConns = {
            QA: this.conns.find(conn => conn.name === "QA"),
            QB: this.conns.find(conn => conn.name === "QB"),
            QC: this.conns.find(conn => conn.name === "QC"),
            QD: this.conns.find(conn => conn.name === "QD"),
        };

        // Clear state
        if (!clrConn.state) {
            this.count = 0;
            this.bCount = 0b000;
            // Set device outputs based on the binary count
            qaConn.state = 0;
            qbConn.state = 0;
            qcConn.state = 0;
            qdConn.state = 0;
        }
        else if (!loadConn.state) {
            this.bCount = `${dConn.state}${cConn.state}${bConn.state}${aConn.state}`; // D is MSB, A is LSB
            this.count = parseInt(this.bCount, 2);
            qaConn.state = aConn.state;
            qbConn.state = bConn.state;
            qcConn.state = cConn.state;
            qdConn.state = dConn.state;
        }
        // Count state
        else if (enpConn.state && entConn.state & this.clkRisingEdge()) {
            this.count++;
            if (this.count > 15) this.count = 0;
            console.log(`Count: ${this.count}`);

            // Convert count to binary and pad to 4 bits
            this.bCount = this.count.toString(2).padStart(4, '0');
            console.log(`bCount: ${this.bCount}`);

            // Set device outputs based on the binary count
            qaConn.state = this.bCount[3] === '1' ? 1 : 0;
            qbConn.state = this.bCount[2] === '1' ? 1 : 0;
            qcConn.state = this.bCount[1] === '1' ? 1 : 0;
            qdConn.state = this.bCount[0] === '1' ? 1 : 0;

            console.log(`QA: ${qaConn.state}, QB: ${qbConn.state}, QC: ${qcConn.state}, QD: ${qdConn.state}`);

            // Check for RCO output when count = 15 = 0b1111
            qRcoConn.state = this.count === 15 ? 1 : 0;
        }
    }

    clkRisingEdge() {
        const clkConn = this.conns.find(conn => conn.name === "CLK");
        const currentClkState = clkConn.state;
        const isRisingEdge = !this.oldClkState && currentClkState; // Detect rising edge
        this.oldClkState = currentClkState; // Update old clock state
        return isRisingEdge;
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

        pkg(context, this);

        // Helper function to draw a connector
        const drawConnector = (conn, name) => {
            const x = conn.x; const y = conn.y;
            context.beginPath();
            context.fillStyle = 'white';
            context.arc(this.x + x, this.y + y, 3, 0, 2 * Math.PI); // Draw circle
            context.fill();

            // Determine text position
            const textOffsetX = x > this.width / 2 ? -27 : 8; // Left of pin for right-side connectors
            const textOffsetY = 3;

            // Draw connector name
            name = conn.name;
            context.fillStyle = 'white';
            context.font = '8px Arial';
            context.fillText(name, this.x + x + textOffsetX, this.y + y + textOffsetY);

            // Draw a line over specific connector names
            const lineMappings = {
                "CLR": { startX: 7, startY: -5, endX: 25, endY: -5 },
                "LOAD": { startX: -28, startY: -5, endX: -2, endY: -5 }
            };

            if (lineMappings[name]) {
                const { startX, startY, endX, endY } = lineMappings[name];
                context.beginPath();
                context.strokeStyle = 'white';
                context.moveTo(this.x + x + startX, this.y + y + startY); // Start of the line
                context.lineTo(this.x + x + endX, this.y + y + endY); // End of the line
                context.stroke();
            }
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
        context.fillText('SN74161', this.x + textOffsetX, this.y + textOffsetY);

        // Restore canvas state
        context.restore();
    }
}