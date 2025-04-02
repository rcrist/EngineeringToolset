import { Comp } from './Comp.js';
import { showConfigurationMenu } from '../controllers/helpers.js';

export class SwitchBar extends Comp {
    constructor(x, y, angle, numSwitches = 8) {
        super(x, y, angle);
        this.numSwitches = numSwitches;
        this.width = 60;     // Component width not image width
        this.height = 90;    // Component height not image height

        // Connector locations
        this.conns = [];
        for (let i = 1; i <=8; i++) {
            this.conns.push({name: "out" + i, type: "output", x: this.width, y: i * 10, state: false});
        }

        this.isOns = [false, false, false, false, false, false, false, false];

        this.setHeight();
    }

    setHeight() {
        // Clamp the number of switches between 1 and 8
        if (this.numSwitches < 1) this.numSwitches = 1;
        if (this.numSwitches > 8) this.numSwitches = 8;
        this.height = this.numSwitches * 10 + 10;
    }
    update() {
        this.conns.forEach((conn, index) => {
            conn.state = this.isOns[index] ? 1 : 0;
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

        this.setHeight();

        // Draw component filled border
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.fillStyle = '#400';
        context.fillRect(this.x, this.y, this.width, this.height);

        // Draw the switches based on states
        for (let i = 0; i < this.numSwitches; i++) {
            context.fillStyle = this.isOns[i] ? '#000' : 'white';
            context.fillRect(this.x + 10, this.y + (5 + i * 10), 20, 8);
            context.fillStyle = this.isOns[i] ? 'white' : '#000';
            context.fillRect(this.x + 30, this.y + (5 + i * 10), 20, 8);
        }

        this.drawConn(context);

        // Restore canvas state
        context.restore();
    }

    drawConn(context) {
        for (let i = 0; i < this.numSwitches; i++) { // Start from index 0
            let conn = this.conns[i]; // Access the connector at index i
            if (!conn) continue; // Skip if conn is undefined
    
            context.beginPath();
            context.fillStyle = 'white';
            context.arc(this.x + conn.x, this.y + conn.y, this.radius, 0, 2 * Math.PI); // Draw circle
            context.fill();
        }
    }

    handleClick(x, y) {
        for (let i = 0; i < this.numSwitches; i++) {
            // Calculate the bounds of the current switch
            const bounds = {
                x: this.x + 5,
                y: this.y + (5 + i * 10),
                w: 40, // Total width of the switch (20 + 20)
                h: 8   // Height of the switch
            };

            // Check if the click is within the bounds of the current switch
            if (x >= bounds.x && x <= bounds.x + bounds.w &&
                y >= bounds.y && y <= bounds.y + bounds.h) {
                this.isOns[i] = !this.isOns[i]; // Toggle the state of the clicked switch
                break; // Exit the loop once a match is found
            }
        }
    }

    handleDblClick(x, y) {
        if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
            const configOptions = [
                {
                    label: 'Select Number of Switches:',
                    values: Array.from({ length: 8 }, (_, i) => ({
                        value: i + 1,
                        label: `${i + 1} Switches`,
                        selected: this.numSwitches === i + 1
                    })),
                    onChange: (value) => {
                        this.numSwitches = parseInt(value, 10);
                        this.setHeight();
                    }
                }
            ];
    
            showConfigurationMenu(x, y, configOptions, null, 'Configure Switch Bar');
        }
    }
}