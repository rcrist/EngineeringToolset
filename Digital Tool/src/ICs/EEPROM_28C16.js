import { Comp } from '../components/Comp.js';
import { pkg } from './packages.js';

export class EEPROM_28C16 extends Comp {
    constructor(x, y) {
        super(x, y);
        this.width = 80;
        this.height = 150;

        // Define the IC pin-outs
        const offX = 0;
        const offY = 30;
        this.conns = [
            { name: "A7", type: "input", x: 0, y: offY, state: false },
            { name: "A6", type: "input", x: 0, y: offY + 10, state: false },
            { name: "A5", type: "input", x: 0, y: offY + 20, state: false },
            { name: "A4", type: "input", x: 0, y: offY + 30, state: false },
            { name: "A3", type: "input", x: 0, y: offY + 40, state: false },
            { name: "A2", type: "input", x: 0, y: offY + 50, state: false },
            { name: "A1", type: "input", x: 0, y: offY + 60, state: false },
            { name: "A0", type: "input", x: 0, y: offY + 70, state: false },
            { name: "I/O0", type: "output", x: 0, y: offY + 80, state: false },
            { name: "I/O1", type: "output", x: 0, y: offY + 90, state: false },
            { name: "I/O2", type: "output", x: 0, y: offY + 100, state: false },
            { name: "GND", type: "input", x: 0, y: offY + 110, state: false },

            { name: "VCC", type: "input", x: this.width, y: offY, state: false },
            { name: "A8", type: "input", x: this.width, y: offY + 10, state: false },
            { name: "A9", type: "input", x: this.width, y: offY + 20, state: false },
            { name: "WE", type: "input", x: this.width, y: offY + 30, state: false },
            { name: "OE", type: "input", x: this.width, y: offY + 40, state: false },
            { name: "A10", type: "input", x: this.width, y: offY + 50, state: false },
            { name: "CE", type: "input", x: this.width, y: offY + 60, state: false },
            { name: "I/O7", type: "output", x: this.width, y: offY + 70, state: false },
            { name: "I/O6", type: "output", x: this.width, y: offY + 80, state: false },
            { name: "I/O5", type: "output", x: this.width, y: offY + 90, state: false },
            { name: "I/O4", type: "output", x: this.width, y: offY + 100, state: false },
            { name: "I/O3", type: "output", x: this.width, y: offY + 110, state: false },
        ];

        // Define the lookup table for addresses A4-A0 (key) that output codes I/O7 to I/O0 (value)
        this.lookupTable = {
            "00000": "01111110", // Hex 0
            "00001": "00110000", // Hex 1
            "00010": "01101101", // Hex 2
            "00011": "01111001", // Hex 3
            "00100": "00110011", // Hex 4
            "00101": "01011011", // Hex 5
            "00110": "01011111", // Hex 6
            "00111": "01110000", // Hex 7
            "01000": "01111111", // Hex 8
            "01001": "01111011", // Hex 9
            "01010": "00011101", // Hex A
            "01011": "00011111", // Hex B
            "01100": "00001101", // Hex C
            "01101": "00111101", // Hex D
            "01110": "01001111", // Hex E
            "01111": "01000111", // Hex F
            "10000": "10000000", // Turns on dp
        };
    }

    update() {
        // Get the states of control signals
        const ceConn = this.conns.find(conn => conn.name === "CE");
        const oeConn = this.conns.find(conn => conn.name === "OE");
    
        // If WE is low, disable all outputs
        if (oeConn.state === 0) {
            this.conns.filter(conn => conn.name.startsWith("I/O")).forEach(conn => {
                conn.state = false; // Disable all outputs
            });
            return; // Exit early
        }
    
        // If CE is high, disable all outputs
        if (ceConn.state) {
            this.conns.filter(conn => conn.name.startsWith("I/O")).forEach(conn => {
                conn.state = false; // Disable all outputs
            });
            return; // Exit early
        }
    
        // Get the states of address lines A0 to A4
        const a0 = this.conns.find(conn => conn.name === "A0").state ? 1 : 0;
        const a1 = this.conns.find(conn => conn.name === "A1").state ? 1 : 0;
        const a2 = this.conns.find(conn => conn.name === "A2").state ? 1 : 0;
        const a3 = this.conns.find(conn => conn.name === "A3").state ? 1 : 0;
        const a4 = this.conns.find(conn => conn.name === "A4").state ? 1 : 0;
    
        // Create the binary address string
        const address = `${a4}${a3}${a2}${a1}${a0}`;
    
        // Look up the code for the given address
        const code = this.lookupTable[address] || "00000000"; // Default to 0 if address not found
    
        // Set the states of I/O7 to I/O0 based on the code
        this.conns.find(conn => conn.name === "I/O7").state = code[0] === "1";
        this.conns.find(conn => conn.name === "I/O6").state = code[1] === "1";
        this.conns.find(conn => conn.name === "I/O5").state = code[2] === "1";
        this.conns.find(conn => conn.name === "I/O4").state = code[3] === "1";
        this.conns.find(conn => conn.name === "I/O3").state = code[4] === "1";
        this.conns.find(conn => conn.name === "I/O2").state = code[5] === "1";
        this.conns.find(conn => conn.name === "I/O1").state = code[6] === "1";
        this.conns.find(conn => conn.name === "I/O0").state = code[7] === "1";
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
                "WE": { startX: -28, startY: -5, endX: -15, endY: -5 },
                "OE": { startX: -28, startY: -5, endX: -15, endY: -5 },
                "CE": { startX: -28, startY: -5, endX: -15, endY: -5 },
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
        const textOffsetX = this.width / 4 + 4;
        const textOffsetY = 10;
        context.fillStyle = 'black';
        context.font = '12px Arial';
        context.fillText('28C16', this.x + textOffsetX, this.y + textOffsetY);

        // Restore canvas state
        context.restore();
    }
}