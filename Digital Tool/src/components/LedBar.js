import { Comp } from './Comp.js';
import { showConfigurationMenu } from '../controllers/helpers.js';

export class LedBar extends Comp {
    constructor(x, y, angle, color = 'yellow', numLeds = 8) {
        super(x, y, angle);
        this.color = color;
        this.numLeds = numLeds;
        this.width = 60;     // Component width not image width
        this.height = 90;    // Component height not image height

        // Connector locations
        this.conns = [];
        for (let i = 1; i <=8; i++) {
            this.conns.push({name: "in" + i, type: "input", x: 0, y: i * 10, state: false});
        }

        this.segW = 40;
        this.segH = 6;

        this.onColor = '#ff0';
        this.offColor = '#880';

        this.setLedColors(this.color);
        this.setHeight();
    }

    setHeight() {
        // Clamp the number of switches between 1 and 8
        if (this.numLeds < 1) this.numLeds = 1;
        if (this.numLeds > 8) this.numLeds = 8;
        this.height = this.numLeds * 10 + 10;
    }

    setLedColors(color) {
        switch (color) {
            case 'yellow':
                this.onColor = '#ff0';
                this.offColor = '#880';
                break;
            case 'red':
                this.onColor = '#f00';
                this.offColor = '#800';
                break;
            case 'green':
                this.onColor = '#0f0';
                this.offColor = '#080';
                break;
            case 'blue':
                this.onColor = '#00f';
                this.offColor = '#008';
                break;
        }
    }

    update() {

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

        this.drawOverride(context);

    // Iterate over the inputs array up to the specified numLeds
    this.conns.slice(0, this.numLeds).forEach((input, index) => {
        // Set the fillStyle based on the state field
        context.fillStyle = input.state ? this.onColor : this.offColor;

        const y = this.y + 5 + (10 * index) + (this.segH / 2);
        // Draw the segment
        context.fillRect(this.x + 10, y, this.segW, this.segH);
    });

        // Restore canvas state
        context.restore();

        // Update connector positions
        this.getConns();
    }

    drawOverride(context) {
        // Adjust the component height based on the numLeds
        let offset = 5;
        if (this.numLeds === 8) offset = 5;
        else offset = 10;
        const adjustedHeight = (this.segH + 5) * this.numLeds + offset; // Total height based on numLeds
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, adjustedHeight);
        context.fillStyle = '#200';
        context.fillRect(this.x, this.y, this.width, adjustedHeight);

        // Draw component connectors
        this.drawConn(context);
    }

    drawConn(context) {
        for (let i = 0; i < this.numLeds; i++) { // Start from index 0
            let conn = this.conns[i]; // Access the connector at index i
            if (!conn) continue; // Skip if conn is undefined
    
            context.beginPath();
            context.fillStyle = 'white';
            context.arc(this.x + conn.x, this.y + conn.y, this.radius, 0, 2 * Math.PI); // Draw circle
            context.fill();
        }
    }

    handleDblClick(x, y) {
        if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
            const configOptions = [
                {
                    label: 'Select LED Color:',
                    values: [
                        { value: 'yellow', label: 'Yellow', selected: this.color === 'yellow' },
                        { value: 'red', label: 'Red', selected: this.color === 'red' },
                        { value: 'green', label: 'Green', selected: this.color === 'green' },
                        { value: 'blue', label: 'Blue', selected: this.color === 'blue' }
                    ],
                    onChange: (value) => {
                        this.color = value;
                        this.setLedColors(this.color);
                    }
                },
                {
                    label: 'Select Number of LEDs:',
                    values: Array.from({ length: 8 }, (_, i) => ({
                        value: i + 1,
                        label: `${i + 1} LEDs`,
                        selected: this.numLeds === i + 1
                    })),
                    onChange: (value) => {
                        this.numLeds = parseInt(value, 10);
                        this.setHeight();
                    }
                }
            ];

            showConfigurationMenu(x, y, configOptions, null, 'Configure LED Bar');
        }
    }
}