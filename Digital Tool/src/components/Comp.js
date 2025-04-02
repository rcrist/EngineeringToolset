export class Comp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.imageWidth = 32;
        this.imageHeight = 32;
        this.radius = 3;
        this.angle = 0;
        this.image = null;

        // Define the connector locations in local coordinates
        this.conns = [
            { name: "in1", type: "input", x: 0, y: 10, state: false },
            { name: "in2", type: "input", x: 0, y: 30, state: false },
            { name: "out", type: "output", x: this.width, y: 20, state: false },
        ];

        // Container for connector locations in world coordinates
        this.worldConns = [];
    }

    update() {

    }

    draw(context) {
        this.rotateContent(context);
    }

    rotateContent(context) {
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

        this.drawContent(context);

        // Restore canvas state
        context.restore();
    }

    drawContent(context) {
        // Draw the component here
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.fillStyle = '#222';
        context.fillRect(this.x, this.y, this.width, this.height);

        this.conns.forEach(conn => {
            this.drawConn(context, conn);
        });

        context.drawImage(
            this.image,
            this.x + (this.width - this.imageWidth) / 2,
            this.y + (this.height - this.imageHeight) / 2,
            this.imageWidth,
            this.imageHeight
        );
    }

    drawConn(context) {
        this.conns.forEach(conn => {
            context.beginPath();
            context.fillStyle = 'white';
            context.arc(this.x + conn.x, this.y + conn.y, this.radius, 0, 2 * Math.PI);
            context.fill();
        });
    }

    isPointInside(x, y) {  // Hit test
        // Calculate the center point
        const center = this.calcCenter();

        return x >= center.x - this.width / 2 &&
               x <= center.x + this.width / 2 &&
               y >= center.y - this.height / 2 &&
               y <= center.y + this.height / 2;
    }

    getConns() {
        // Clear previous world coords
        this.worldConns = [];

        // Calculate the center point
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const rad = this.angle * (Math.PI / 180); // Convert degrees to radians

        // Print rotated connector locations
        this.conns.forEach(conn => {
            const name = conn.name;
            const type = conn.type;
            let x = this.x + conn.x;
            let y = this.y + conn.y
            const dx = x - centerX;
            const dy = y - centerY;

            // Apply rotation transformation
            x = centerX + dx * Math.cos(rad) - dy * Math.sin(rad);
            y = centerY + dx * Math.sin(rad) + dy * Math.cos(rad);

            this.worldConns.push({ name, type, x, y });
            // console.log(`Connector ${conn.name}: Type: ${type} at (${x}, ${y})`);
        });

        return [...this.worldConns];
    }

    calcCenter() {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        return { x: centerX, y: centerY };
    }

    setInputState(connName, state) {
        const conn = this.conns.find(conn => conn.name === connName);
        if (conn) {
            conn.state = state;
        }
    }

    getOutputState(connName) {
        const conn = this.conns.find(conn => conn.name === connName);
        return conn.state;
    }

    debugPrintConnLoc() {
        const worldConns = this.getConns();

        this.conns.forEach(conn => {
            console.log(`Local Conn Point: name = ${conn.name}, type = ${conn.type}, x = ${conn.x.toFixed(2)}, y = ${conn.y.toFixed(2)}`);
        });

        this.getConns();

        console.log(`this.x: ${this.x}, this.y: ${this.y}`);

        worldConns.forEach(conn => {
            console.log(`World Conn Point: name = ${conn.name}, type = ${conn.type}, x = ${conn.x.toFixed(2)}, y = ${conn.y.toFixed(2)}`);
        });
    }
}