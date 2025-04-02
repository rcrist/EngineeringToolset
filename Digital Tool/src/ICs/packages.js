export function pkg_14(context, self) {
        // Draw IC body rectangle
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(self.x, self.y, self.width, self.height);
        context.fillStyle = '#444';
        context.fillRect(self.x, self.y, self.width, self.height);

        // Draw pin 1 indicator circle
        context.beginPath();
        context.arc(self.x + 5, self.y + 18, 2, 0, 2 * Math.PI);
        context.strokeStyle = 'white';
        context.stroke();

        // Draw IC name box
        context.fillStyle = 'white';
        context.fillRect(self.x, self.y, self.width, 12);
}

export function pkg(context, self) {
        // Draw IC body rectangle
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(self.x, self.y, self.width, self.height);
        context.fillStyle = '#444';
        context.fillRect(self.x, self.y, self.width, self.height);

        // Draw pin 1 indicator circle
        context.beginPath();
        context.arc(self.x + 5, self.y + 18, 2, 0, 2 * Math.PI);
        context.strokeStyle = 'white';
        context.stroke();

        // Draw IC name box
        context.fillStyle = 'white';
        context.fillRect(self.x, self.y, self.width, 12);
}