import { drawGrid, snapToGrid } from "./grid.js";
import { MouseButton, getMousePosition } from './helpers.js';

import { Wire } from '../wires/Wire.js';
// import { WireGroup } from './WireGroup.js';
import { AndGate } from '../components/AndGate.js';
import { OrGate } from '../components/OrGate.js';
import { NandGate } from '../components/NandGate.js';
import { NorGate } from '../components/NorGate.js';
import { XorGate } from '../components/XorGate.js';
import { XnorGate } from '../components/XnorGate.js';
import { NotGate } from '../components/NotGate.js';
import { Switch } from '../components/Switch.js';
import { SwitchBar } from "../components/SwitchBar.js";
import { LED } from '../components/LED.js';
import { LedBar } from '../components/LedBar.js';
import { SevenSegment } from "../components/SevenSegment.js";
import { Clock } from '../components/Clock.js';
import { SN7400 } from '../ICs/SN7400.js';
import { SN74161 } from '../ICs/SN74161.js';
import { EEPROM_28C16 } from "../ICs/EEPROM_28C16.js";

import { Simulator } from "./CircuitSimulator.js";

// Attach imported classes to the window object
window.Switch = Switch;
window.SwitchBar = SwitchBar;
window.Clock = Clock;
window.LED = LED;
window.LedBar = LedBar;
window.SevenSegment = SevenSegment;
window.AndGate = AndGate;
window.OrGate = OrGate;
window.NandGate = NandGate;
window.NorGate = NorGate;
window.XorGate = XorGate;
window.XnorGate = XnorGate;
window.NotGate = NotGate;
window.SN7400 = SN7400;
window.SN74161 = SN74161;
window.EEPROM_28C16 = EEPROM_28C16;

export class CircuitEditor {
    constructor() {
        this.components = [];
        this.wires = [];
        this.wireGroups = [];
        this.editMode = true;

        this.canvas = document.getElementById('canvas1');
        this.simulator = new Simulator(this);

        // Mouse variables and events 
        this.isLeftButtonDown = false;
        this.isRightButtonDown = false;
        this.selectedComponent = null;
        this.selectedWire = null;
        this.dragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // Wire drawing variables
        this.isDrawingWire = false;
        this.wireStart = null;
        this.tempWireEnd = null;

        this.initMouseEventListeners();

        // Component button handlers
        this.swButton = document.getElementById('swButton');
        this.swbarButton = document.getElementById('swbarButton');
        this.clockButton = document.getElementById('clockButton');
        this.ledButton = document.getElementById('ledButton');
        this.andButton = document.getElementById('andButton');
        this.orButton = document.getElementById('orButton');
        this.nandButton = document.getElementById('nandButton');
        this.norButton = document.getElementById('norButton');
        this.notButton = document.getElementById('notButton');
        this.xorButton = document.getElementById('xorButton');
        this.xnorButton = document.getElementById('xnorButton');
        this.ledbarButton = document.getElementById('ledbarButton');
        this.sevensegButton = document.getElementById('sevensegButton');
        this.sn7400Button = document.getElementById('sn7400Button');
        this.sn74161Button = document.getElementById('sn74161Button');
        this.eepromButton = document.getElementById('eepromButton');

        this.compButtons = [
            { button: swButton, CompClass: Switch },
            { button: swbarButton, CompClass: SwitchBar },
            { button: clockButton, CompClass: Clock },
            { button: ledButton, CompClass: LED },
            { button: andButton, CompClass: AndGate },
            { button: orButton, CompClass: OrGate },
            { button: nandButton, CompClass: NandGate },
            { button: norButton, CompClass: NorGate },
            { button: notButton, CompClass: NotGate },
            { button: xorButton, CompClass: XorGate },
            { button: xnorButton, CompClass: XnorGate },
            { button: ledbarButton, CompClass: LedBar },
            { button: sevensegButton, CompClass: SevenSegment },
            { button: sn7400Button, CompClass: SN7400 },
            { button: sn74161Button, CompClass: SN74161 },
            { button: eepromButton, CompClass: EEPROM_28C16 },
        ];

        this.compButtons.forEach(({ button, CompClass }) => {
            button.addEventListener('click', () => {
                const comp = new CompClass(50, 50, 0); // comp(x, y, angle)
                this.addComponent(comp);
            });
        });

        // Add radio button event listeners
        this.radioButtons = document.querySelectorAll('input[name="mode"]'); // Assuming radio buttons have the name "mode"
        this.radioButtons.forEach((radioButton) => {
            radioButton.addEventListener('change', (event) => {
                if (event.target.checked) {
                    const selectedMode = event.target.value; // Get the value of the selected radio button

                    // Update the editor's mode based on the selected radio button
                    if (selectedMode === 'edit') {
                        this.editMode = true;
                        console.log("Switched to Edit Mode");
                    } else if (selectedMode === 'simulate') {
                        this.editMode = false;
                        console.log("Switched to Simulation Mode");
                        this.simulator.simulate(this);
                    }
                }
            });
        });

        // Add keyboard listener for the letter R
        window.addEventListener('keydown', (event) => {
            if (event.key === 'r' || event.key === 'R') {
                console.log(this.selectedComponent)
                if (this.selectedComponent) {
                    this.selectedComponent.angle = (this.selectedComponent.angle + 90) % 360;
                }
            }
            // Add event listener for the Delete key to remove the selected component
            if (event.key === 'Delete') {
                if (this.selectedComponent) {
                    this.removeComp(this.selectedComponent);
                    this.selectedComponent = null; // Clear the selection
                }

                if (this.selectedWire) {
                    this.removeWire(this.selectedWire);
                    this.selectedWire = null;
                }
            }
            if (event.key === 'p' || event.key === 'P') {
                if (this.editMode) {
                    if (this.components) {
                        this.components.forEach(comp => {
                            comp.debugPrintConnLoc();
                        });
                    }

                    if (this.wires) {
                        this.wires.forEach(wire => {
                            wire.debugPrintWire();
                        });
                    }
                } else {
                    this.wireGroups.forEach(group => {
                        group.debugPrintWireGroup();
                    })
                    this.simulator.printConnections();
                }
            }
        });

        this.canvas.addEventListener('click', (event) => {
            if (!this.editMode) return;

            const { x, y } = getMousePosition(event);

            if(this.selectedWire) this.selectedWire.color = 'white';

            // Check if a wire is selected
            this.selectedWire = this.wires.find(wire => {
                let start = {x: 0, y: 0};
                start.x = wire.startX; start.y = wire.startY;
                let end = {x: 0, y: 0};
                end.x = wire.endX; end.y = wire.endY;
                const distance = Math.abs((end.y - start.y) * x - (end.x - start.x) * y + end.x * start.y - end.y * start.x) /
                    Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
                return distance <= 5; // Adjust tolerance as needed
            });

            if (this.selectedWire) {
                this.selectedWire.color = 'blue';
                console.log(`Selected Wire:`, this.selectedWire);
            }
        });

        const saveButton = document.getElementById('save');
        const loadButton = document.getElementById('load');
        
        saveButton.addEventListener('click', () => {
            const jsonData = this.saveCircuit();
            console.log("Circuit saved:", jsonData);
        
            // Optionally, download the JSON file
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'circuit.json';
            a.click();
            URL.revokeObjectURL(url);
        });
        
        loadButton.addEventListener('click', () => {
            // Prompt the user to upload a JSON file
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.addEventListener('change', event => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.loadCircuit(reader.result);
                        // console.log("Circuit loaded:", reader.result);
                    };
                    reader.readAsText(file);
                }
            });
            input.click();
        });
    }

    addComponent(comp) {
        this.components.push(comp);
    }

    removeComp(comp) {
        const index = this.components.indexOf(comp);
        if (index > -1) {
            this.components.splice(index, 1);
        }
    }

    addWire(wire) {
        this.wires.push(wire);
    }

    removeWire(wire) {
        const index = this.wires.indexOf(wire);
        if (index > -1) {
            this.wires.splice(index, 1);
        }
    }

    update() {
        this.components.forEach(comp => { comp.update() });
        this.wires.forEach(wire => { wire.update() });
        this.wireGroups.forEach(wireGroup => { wireGroup.update() });
    }

    draw(context) {
        drawGrid(context);
        this.components.forEach(comp => {
            comp.draw(context)

            // Highlight the selected component
            if (comp === this.selectedComponent) {
                context.strokeStyle = 'blue';
                context.lineWidth = 3;
                context.strokeRect(comp.x - 2, comp.y - 2, comp.width + 4, comp.height + 4);
            }
        });

        this.wires.forEach(wire => { 
            wire.draw(context) 
        
            // Highlight the selected wire
            if (wire === this.selectedWire) {
                context.beginPath();
                context.moveTo(wire.startX, wire.startY);
                context.lineTo(wire.endX, wire.endY);
                context.strokeStyle = 'blue';
                context.lineWidth = 2;
                context.stroke();            }
        });

        this.wireGroups.forEach(wireGroup => { wireGroup.draw(context) });

        // Draw the temporary wire if one is being dragged
        if (this.isDrawingWire && this.wireStart && this.tempWireEnd) {
            context.strokeStyle = 'white'; // Temporary wire color
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(this.wireStart.x, this.wireStart.y);
            context.lineTo(this.tempWireEnd.x, this.tempWireEnd.y);
            context.stroke();
        }
    }

    //////////////////////// Mouse Event Handlers /////////////////////////////

    initMouseEventListeners() {
        this.canvas.addEventListener("mousedown", (event) => {
            if (event.button === MouseButton.LeftButton) {
                this.onLeftMouseDown(event);
            } else if (event.button === MouseButton.RightButton) {
                this.onRightMouseDown(event);
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            if (this.isLeftButtonDown) {
                this.onLeftMouseMove(event);
            } else if (this.isRightButtonDown) {
                this.onRightMouseMove(event);
            }
        });

        this.canvas.addEventListener("mouseup", (event) => {
            if (event.button === MouseButton.LeftButton) {
                this.onLeftMouseUp(event);
            } else if (event.button === MouseButton.RightButton) {
                this.onRightMouseUp(event);
            }
        });

        this.canvas.addEventListener("dblclick", (event) => {
            if (event.button === MouseButton.LeftButton) {
                this.onLeftDoubleClick(event);
            }
        });

        // Disable the default context menu on right-click
        this.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }

    onLeftMouseDown(event) {
        if (event.button === MouseButton.LeftButton) {
            this.isLeftButtonDown = true;
            const { x, y } = getMousePosition(event);

            if (this.editMode) {  // Edit mode
                // Handle component selection
                this.selectedComponent = this.components.find(component =>
                    component.isPointInside(x, y)
                );

                if (this.selectedComponent) {
                    this.isDragging = true;

                    // Calculate the offset between the mouse position and the component's position
                    this.dragOffsetX = x - this.selectedComponent.x;
                    this.dragOffsetY = y - this.selectedComponent.y;
                }
            } else {  // Simulation mode
                // In simulation mode, check if a switch is clicked
                this.components.forEach(component => {
                    if (component instanceof Switch ||
                        component instanceof SwitchBar ||
                        component instanceof Clock
                    ) {
                        component.handleClick(x, y);
                    }
                });
            }
        }
    }

    onLeftMouseMove(event) {
        if (this.isLeftButtonDown) {
            const { x, y } = getMousePosition(event);

            if (this.isDragging && this.selectedComponent && this.editMode) {
                // Dragging logic for components
                const snappedPosition = snapToGrid(x - this.dragOffsetX, y - this.dragOffsetY);
                this.selectedComponent.x = snappedPosition.x;
                this.selectedComponent.y = snappedPosition.y;
            }
        }
    }

    onLeftMouseUp(event) {
        if (event.button === MouseButton.LeftButton) {
            this.isLeftButtonDown = false;

            if (this.editMode) {
                // Reset dragging state
                this.isDragging = false;
            }
        }
    }

    onLeftDoubleClick(event) {
        if (event.button === MouseButton.LeftButton) {
            const { x, y } = getMousePosition(event);
            if (this.editMode) {
                this.components.forEach(component => {
                    if (component instanceof LED ||
                        component instanceof SevenSegment ||
                        component instanceof SwitchBar ||
                        component instanceof LedBar
                    ) {
                        component.handleDblClick(x, y);
                    }
                });
            }
        }
    }

    onRightMouseDown(event) {
        if (event.button === MouseButton.RightButton) {
            this.isRightButtonDown = true;
            const { x, y } = getMousePosition(event);

            if (this.editMode) {
                // Start drawing a wire
                this.isDrawingWire = true;
                this.wireStart = snapToGrid(x, y);
            }
        }
    }

    onRightMouseMove(event) {
        if (this.isRightButtonDown) {
            const { x, y } = getMousePosition(event);

            if (this.isDrawingWire && this.wireStart && this.editMode) {
                // Update the temporary wire end position to follow the mouse
                this.tempWireEnd = snapToGrid(x, y);
            }
        }
    }

    onRightMouseUp(event) {
        if (event.button === MouseButton.RightButton) {
            const { x, y } = getMousePosition(event);
            this.isRightButtonDown = false;

            if (this.isDrawingWire && this.editMode) {
                // Finish drawing the wire
                const wireEnd = snapToGrid(x, y);
                const wireStart = snapToGrid(this.wireStart.x, this.wireStart.y);

                // Create a new wire and add it to the wires array
                const wire = new Wire(wireStart.x, wireStart.y, wireEnd.x, wireEnd.y);
                this.wires.push(wire);

                // Reset wire drawing state
                this.isDrawingWire = false;
                this.wireStart = null;
                this.tempWireEnd = null; // Reset temporary wire end
            }
        }
    }

    //////////////////////// End Mouse Event Handlers /////////////////////////

    saveCircuit() {
        const circuitData = {
            components: this.components.map(component => ({
                type: component.constructor.name,
                x: component.x,
                y: component.y,
                inputs: component.inputs,
                output: component.output,
                color: component.color || null, // Save color if it exists
                additionalData: {
                    ...(component instanceof LedBar && { numLeds: component.numLeds }),
                    ...(component instanceof SwitchBar && { numSwitches: component.numSwitches }),
                    ...(component.getSaveData ? component.getSaveData() : {})
                }
            })),
            wires: this.wires.map(wire => ({
                startX: wire.startX,
                startY: wire.startY,
                endX: wire.endX,
                endY: wire.endY,
                color: wire.color
            }))
        };
    
        return JSON.stringify(circuitData, null, 2); // Pretty-print JSON
    }

    loadCircuit(jsonData) {
        const circuitData = JSON.parse(jsonData);
    
        // Clear existing components and wires
        this.components = [];
        this.wires = [];
    
        // Recreate components
        circuitData.components.forEach(componentData => {
            const ComponentClass = window[componentData.type]; // Get the class by name
            if (ComponentClass) {
                const component = new ComponentClass(componentData.x, componentData.y);
    
                component.inputs = componentData.inputs;
                component.output = componentData.output;
    
                // Restore color if it exists
                if (componentData.color) {
                    component.color = componentData.color;
                }
    
                // Restore additional data
                if (componentData.additionalData) {
                    if (component instanceof LedBar && componentData.additionalData.numLeds !== undefined) {
                        component.numLeds = componentData.additionalData.numLeds;
                    }
                    if (component instanceof SwitchBar && componentData.additionalData.numSwitches !== undefined) {
                        component.numSwitches = componentData.additionalData.numSwitches;
                    }
    
                    if (component.loadData) {
                        component.loadData(componentData.additionalData);
                    }
                }
    
                this.components.push(component);
            } else {
                console.error(`Component class ${componentData.type} not found.`);
            }
        });
    
        // Recreate wires
        circuitData.wires.forEach(wireData => {
            const wire = new Wire(wireData.startX, wireData.startY, wireData.endX, wireData.endY);
            wire.color = wireData.color;
            this.wires.push(wire);
        });
    }
}