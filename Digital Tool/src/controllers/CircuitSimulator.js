import { WireGroup } from '../wires/WireGroup.js';

export class Simulator {
    constructor(editor) {
        this.editor = editor;
        this.connections = [];
        this.numScans = 1;
    }

    update() {
        this.propagateSignals();
    }

    updateCompConnectors() {
        // Iterate over all components and calculate their world connector positions
        this.editor.components.forEach(component => {
            component.getConns(); // Updates the `worldConns` property of each component
        });
    }

    createWireGroups() {
        // Clear existing wire groups for each simulation
        this.editor.wireGroups = [];

        // A helper function to recursively find all connected wire segments
        const findConnectedWires = (wire, visited, group) => {
            if (visited.has(wire)) return;
            visited.add(wire);
            group.push(wire);

            // Check all wires to find connected ones
            this.editor.wires.forEach(otherWire => {
                if (!visited.has(otherWire) &&
                    (wire.endX === otherWire.startX && wire.endY === otherWire.startY ||
                        wire.startX === otherWire.endX && wire.startY === otherWire.endY)) {
                    findConnectedWires(otherWire, visited, group);
                }
            });
        };

        // Track visited wires
        const visited = new Set();

        // Iterate over all wires to group them
        this.editor.wires.forEach(wire => {
            if (!visited.has(wire)) {
                const group = [];
                findConnectedWires(wire, visited, group);

                // Create a new WireGroup for the connected wires
                const wireGroup = new WireGroup(group);
                this.editor.wireGroups.push(wireGroup);
            }
        });
    }

    createConnections() {
        // Clear the connections array for each simulation
        this.connections = [];

        // Iterate over all wires and connect them to the component connectors
        this.editor.wireGroups.forEach(wireGroup => {
            this.editor.components.forEach(comp => {
                comp.worldConns.forEach(conn => {
                    if ((conn.x === wireGroup.startX && conn.y === wireGroup.startY) ||
                        (conn.x === wireGroup.endX && conn.y === wireGroup.endY)) {
                        let type = conn.type;
                        this.connections.push({ wireGroup, comp, conn, type });
                    }
                });
            });
        });
    }

    propagateSignals() {
        this.connections.forEach(connection => {
            if (connection.type === "input") {
                // Set the component input state to the wire group state
                connection.comp.setInputState(connection.conn.name, connection.wireGroup.state);
            } else if (connection.type === "output") {
                // Set the wire group state to the component output state
                connection.wireGroup.state = connection.comp.getOutputState(connection.conn.name);
            }
        });
    }

    simulate() {
        // Perform a full simulation step
        this.updateCompConnectors();
        this.createWireGroups();
        this.createConnections();

        for (let i = 0; i < this.numScans; i++)
            this.propagateSignals();
    }

    printConnections() {
        this.connections.forEach(connection => {
            console.log(`Connections:
                    Wire Start(${connection.wireGroup.startX}, ${connection.wireGroup.startY}),
                    Wire End(${connection.wireGroup.endX}, ${connection.wireGroup.endY}),
                    Comp: ${connection.comp.constructor.name}, `);

            connection.comp.worldConns.forEach(worldConn => {
                console.log(`Comp world conns: ${worldConn.name}, ${worldConn.type},
                    ${worldConn.x}, ${worldConn.y}`);
            });

            console.log(`Type: ${connection.type}`);
        });
    }
}