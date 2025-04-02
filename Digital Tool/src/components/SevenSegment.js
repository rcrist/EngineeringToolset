import { Comp } from './Comp.js';
import { showConfigurationMenu } from '../controllers/helpers.js';

export class SevenSegment extends Comp {
    constructor(x, y, angle, color = 'red') {
        super(x, y, angle);
        this.color = color;
        this.width = 90;     // Component width not image width
        this.height = 110;    // Component height not image height

        // Connector locations
        this.conns = [
            "a", "b", "c", "d", "e", "f", "g", "dp"
        ].map((name, index) => ({
            name,
            type: "input",
            x: 0,
            y: 10 + 10 * (index + 1),
            state: false
        }));

        const horSegW = 40;
        const horSegH = 8;
        const vertSegW = 8;
        const vertSegH = 30;
        const start = { x: 20, y: 10 }

        // Segment dimensions object
        this.segmentDimensions = {
            A: { x: start.x + vertSegW, y: start.y, width: horSegW, height: horSegH },
            B: { x: start.x + vertSegW + horSegW, y: start.y + horSegH, width: vertSegW, height: vertSegH },
            C: { x: start.x + vertSegW + horSegW, y: start.y + horSegH * 2 + vertSegH, width: vertSegW, height: vertSegH },
            D: { x: start.x + vertSegW, y: start.y + horSegH * 2 + vertSegH * 2, width: horSegW, height: horSegH },
            E: { x: start.x, y: start.y + horSegH * 2 + vertSegH, width: vertSegW, height: vertSegH },
            F: { x: start.x, y: start.y + horSegH, width: vertSegW, height: vertSegH },
            G: { x: start.x + vertSegW, y: start.y + horSegH + vertSegH, width: horSegW, height: horSegH },
            DP: { x: start.x + vertSegW * 2 + horSegW, y: start.y + horSegH * 3 + vertSegH * 2, width: horSegH, height: horSegH },
        };

        // Letters object
        this.letters = { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e', F: 'f', G: 'g', DP: 'dp' };

        this.onColor = '#f00';
        this.offColor = '#800';
        this.setSegColors(this.color);
    }

    setSegColors(color) {
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

        // Draw component filled border
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.fillStyle = '#333';
        context.fillRect(this.x, this.y, this.width, this.height);

        // Iterate over the segmentDimensions and set the fillStyle based on inputs
        Object.entries(this.segmentDimensions).forEach(([key, seg], index) => {
            // Set the fillStyle based on the corresponding input value
            context.fillStyle = this.conns[index].state ? this.onColor : this.offColor;

            // Draw the segment
            context.fillRect(this.x + seg.x, this.y + seg.y, seg.width, seg.height);
        });

        // Iterate over the letters object and draw each letter at the inConns position
        context.fillStyle = 'white';
        context.font = 'normal 8px Arial';

        this.conns.forEach(conn => {
            context.fillText(conn.name, this.x + conn.x + 7, this.y + conn.y + 2);
        });

        // Draw component connectors
        super.drawConn(context);

        // Restore canvas state
        context.restore();
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
                        this.setSegColors(this.color);
                    }
                }
            ];

            showConfigurationMenu(x, y, configOptions, null, 'Configure LED');
        }
    }
}