import { Comp } from './Comp.js';
import { showConfigurationMenu } from '../controllers/helpers.js';

export class LED extends Comp {
    constructor(x, y, angle, color="yellow") {
        super(x, y, angle);
        this.color = color;

        // Connector draw points
        this.conns = [{ name: "in1", type: "input", x: 0, y: 20, state: false}];

        // Logic states
        this.isOn = false;  // Use a boolean here: On - true, Off - false

        // Led colors
        this.onColor = null; // default to yellow
        this.offColor = null; // default to dark yellow

        this.setLedColors(this.color);
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
        const conn = this.conns.find(conn => conn.name === "in1");
        conn.state = this.isOn;
    }

    drawContent(context) {
        // Draw the led inner and outer circles
        let radius = 20;
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + this.height / 2, radius, 0, 2 * Math.PI);
        context.fillStyle = '#400';
        context.fill();

        radius = 12;
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + this.height / 2, radius, 0, 2 * Math.PI);
        context.fillStyle = this.isOn ? this.onColor : this.offColor;
        context.fill();

        // Draw component connectors
        this.conns.forEach(conn => {
            this.drawConn(context, conn);
        });
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
                }
            ];
    
            showConfigurationMenu(x, y, configOptions, null, 'Configure LED');
        }
    }

    getConnectors() {
        return [...this.inputConnCoords];
    }

    setInputState(connName, state) {
        const conn = this.conns.find(conn => conn.name === "in1");
        conn.state = state;
        this.isOn = state;
    }
}