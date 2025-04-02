import { CircuitEditor } from './controllers/CircuitEditor.js';

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', function () {
        const menuBarHeight = document.getElementById('menu-bar').offsetHeight;
        const buttonFrameWidth = document.getElementById('button-frame').offsetWidth;

        canvas.width = window.innerWidth - buttonFrameWidth;
        canvas.height = window.innerHeight - menuBarHeight;
    });

    const editor = new CircuitEditor();

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        editor.update();
        editor.draw(context);           
        if (!editor.editMode) {
            editor.simulator.update();
        }

        requestAnimationFrame(animate);
    }
    animate(0);
});