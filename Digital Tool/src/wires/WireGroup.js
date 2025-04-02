export class WireGroup {
    constructor(group) {
        this.group = group;
        this.startX = group[0].startX;
        this.startY = group[0].startY;
        this.endX = group[group.length - 1].endX;
        this.endY = group[group.length - 1].endY;;
        this.color = 'white'; // Default color
        this.state = false;
    }

    update() {
        this.color = this.state ? 'green' : 'white';
    }

    draw(context) {
        this.group.forEach(segment => {
            context.beginPath();
            context.moveTo(segment.startX, segment.startY);
            context.lineTo(segment.endX, segment.endY);
            context.strokeStyle = this.color;
            context.lineWidth = 2;
            context.stroke();
        });
    }

    debugPrintWireGroup() {
        console.log(`WireGroup start: (${this.startX}, ${this.startY}), end: (${this.endX}, ${this.endY})`);

        console.log(`WireGroup state: ${this.state}`)
    }
}