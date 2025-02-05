/* filepath: /c:/EngineeringTools/CalculatorTool/script.js */
document.addEventListener('DOMContentLoaded', function() {
    const display = document.querySelector('.display input');
    const buttons = document.querySelectorAll('.buttons button');
    let isDegrees = true; // Default to degrees
    let isShifted = false; // Default to non-shifted state
    let memory = 0; // Memory storage
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;
            
            if (value === 'CLR') {
                display.value = '';
            } else if (value === '=') {
                try {
                    display.value = eval(display.value);
                } catch {
                    display.value = 'Error';
                }
            } else if (value === 'SIN') {
                display.value = isDegrees ? Math.sin(toRadians(parseFloat(display.value))) : Math.sin(parseFloat(display.value));
            } else if (value === 'COS') {
                display.value = isDegrees ? Math.cos(toRadians(parseFloat(display.value))) : Math.cos(parseFloat(display.value));
            } else if (value === 'TAN') {
                display.value = isDegrees ? Math.tan(toRadians(parseFloat(display.value))) : Math.tan(parseFloat(display.value));
            } else if (value === 'SIN⁻¹') {
                display.value = isDegrees ? toDegrees(Math.asin(parseFloat(display.value))) : Math.asin(parseFloat(display.value));
            } else if (value === 'COS⁻¹') {
                display.value = isDegrees ? toDegrees(Math.acos(parseFloat(display.value))) : Math.acos(parseFloat(display.value));
            } else if (value === 'TAN⁻¹') {
                display.value = isDegrees ? toDegrees(Math.atan(parseFloat(display.value))) : Math.atan(parseFloat(display.value));
            } else if (value === 'SINH') {
                display.value = Math.sinh(parseFloat(display.value));
            } else if (value === 'COSH') {
                display.value = Math.cosh(parseFloat(display.value));
            } else if (value === 'TANH') {
                display.value = Math.tanh(parseFloat(display.value));
            } else if (value === 'SINH⁻¹') {
                display.value = Math.asinh(parseFloat(display.value));
            } else if (value === 'COSH⁻¹') {
                display.value = Math.acosh(parseFloat(display.value));
            } else if (value === 'TANH⁻¹') {
                display.value = Math.atanh(parseFloat(display.value));
            } else if (value === 'π') {
                display.value += Math.PI;
            } else if (value === 'e') {
                display.value += Math.E;
            } else if (value === 'k') {
                display.value += 1.380649e-23; // Boltzmann's constant in J/K
            } else if (value === 'C') {
                display.value += 2.99792458e8 // Speed of light in m/s
            } else if (value === 'x^2') {
                display.value = Math.pow(parseFloat(display.value), 2);
            } else if (value === 'x^y') {
                display.value += '**';
            } else if (value === '10^x') {
                display.value = Math.pow(10, parseFloat(display.value));
            } else if (value === '2^x') {
                display.value = Math.pow(2, parseFloat(display.value));
            } else if (value === 'e^x') {
                display.value = Math.exp(parseFloat(display.value));
            } else if (value === 'log') {
                display.value = Math.log10(parseFloat(display.value));
            } else if (value === 'ln') {
                display.value = Math.log(parseFloat(display.value));
            } else if (value === '1/x') {
                display.value = 1 / parseFloat(display.value);
            } else if (value === '|x|') {
                display.value = Math.abs(parseFloat(display.value));
            } else if (value === 'exp') {
                display.value = Math.exp(parseFloat(display.value));
            } else if (value === 'mod') {
                display.value += '%';
            } else if (value === 'DEL') {
                display.value = display.value.slice(0, -1);
            } else if (value === 'n!') {
                display.value = factorial(parseInt(display.value));
            } else if (value === '√x') {
                display.value = Math.sqrt(parseFloat(display.value));
            } else if (value === '+/-') {
                display.value = parseFloat(display.value) * -1;
            } else if (value === 'DEG' || value === 'RAD') {
                isDegrees = !isDegrees;
                this.textContent = isDegrees ? 'DEG' : 'RAD';
            } else if (value === 'SHIFT') {
                isShifted = !isShifted;
                toggleShiftButtons(isShifted);
            } else if (value === 'MC') {
                memory = 0;
            } else if (value === 'MR') {
                display.value = memory;
            } else if (value === 'M+') {
                memory += parseFloat(display.value);
            } else if (value === 'M-') {
                memory -= parseFloat(display.value);
            } else if (value === 'MS') {
                memory = parseFloat(display.value);
            } else if (value === 'HEX') {
                display.value = parseInt(display.value).toString(16).toUpperCase();
            } else if (value === 'DEC') {
                display.value = parseInt(display.value, 16).toString(10);
            } else if (value === 'OCT') {
                display.value = parseInt(display.value).toString(8);
            } else if (value === 'BIN') {
                display.value = parseInt(display.value).toString(2);
 
            } else {
                display.value += value;
            }
        });
    });

    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    function factorial(n) {
        if (n < 0) return 'Error';
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    function toggleShiftButtons(isShifted) {
        const sinButton = Array.from(buttons).find(button => button.textContent.includes('SIN'));
        const cosButton = Array.from(buttons).find(button => button.textContent.includes('COS'));
        const tanButton = Array.from(buttons).find(button => button.textContent.includes('TAN'));
        const sinhButton = Array.from(buttons).find(button => button.textContent.includes('SINH'));
        const coshButton = Array.from(buttons).find(button => button.textContent.includes('COSH'));
        const tanhButton = Array.from(buttons).find(button => button.textContent.includes('TANH'));

        if (isShifted) {
            sinButton.textContent = 'SIN⁻¹';
            cosButton.textContent = 'COS⁻¹';
            tanButton.textContent = 'TAN⁻¹';
            sinhButton.textContent = 'SINH⁻¹';
            coshButton.textContent = 'COSH⁻¹';
            tanhButton.textContent = 'TANH⁻¹';
        } else {
            sinButton.textContent = 'SIN';
            cosButton.textContent = 'COS';
            tanButton.textContent = 'TAN';
            sinhButton.textContent = 'SINH';
            coshButton.textContent = 'COSH';
            tanhButton.textContent = 'TANH';
        }
    }
});