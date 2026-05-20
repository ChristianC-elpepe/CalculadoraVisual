let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let shouldResetDisplay = false;

const display = document.getElementById('calc-display');

function updateDisplay(value) {
    display.value = value;
}

function appendNumber(num) {
    if (shouldResetDisplay) {
        updateDisplay('');
        shouldResetDisplay = false;
    }

    // Evitar múltiples ceros al inicio
    if (display.value === '0' && num === '0') return;
    // Evitar múltiples puntos decimales
    if (num === '.' && display.value.includes('.')) return;

    updateDisplay(display.value + num);
}

function setOperator(op) {
    if (display.value === '') return;

    if (currentOperator && !shouldResetDisplay) {
        calculate();
    }

    firstOperand = display.value;
    currentOperator = op;
    shouldResetDisplay = true;

    // Indicador visual temporal en pantalla
    updateDisplay(firstOperand + ' ' + op);
}

// Operaciones científicas instantáneas
function scientificOp(op) {
    if (display.value === '' && op !== 'pi') return;
    
    let val = parseFloat(display.value);
    let result;

    // Función auxiliar para calcular directamente en grados
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    switch (op) {
        case 'sin':  result = Math.sin(toRadians(val)); break;
        case 'cos':  result = Math.cos(toRadians(val)); break;
        case 'tan':  result = Math.tan(toRadians(val)); break;
        case 'sqrt': 
            if (val < 0) {
                showError();
                return;
            }
            result = Math.sqrt(val); 
            break;
        case 'log':  
            if (val <= 0) { showError(); return; }
            result = Math.log10(val); 
            break;
        case 'ln':   
            if (val <= 0) { showError(); return; }
            result = Math.log(val); 
            break;
        case 'pi':   result = Math.PI; break;
    }

    if (isNaN(result) || result === Infinity || result === -Infinity) {
        showError();
        return;
    }

    // Limpieza de imprecisiones de coma flotante (ej. cos(90) dando 6.12e-17)
    result = parseFloat(result.toFixed(10));
    
    updateDisplay(result);
    firstOperand = result.toString();
    shouldResetDisplay = true;
}

function calculate() {
    if (!currentOperator || shouldResetDisplay) return;

    secondOperand = display.value;
    const a = parseFloat(firstOperand);
    const b = parseFloat(secondOperand);
    let result;

    switch (currentOperator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/':
            if (b === 0) {
                showError();
                return;
            }
            result = a / b;
            break;
        case '^': 
            result = Math.pow(a, b);
            break;
    }

    result = parseFloat(result.toFixed(10));

    updateDisplay(result);
    firstOperand = result.toString();
    currentOperator = null;
    shouldResetDisplay = true;
}

function clearDisplay() {
    updateDisplay('');
    firstOperand = '';
    secondOperand = '';
    currentOperator = null;
    shouldResetDisplay = false;
}

function showError() {
    updateDisplay('Error');
    setTimeout(clearDisplay, 1500);
}

// Soporte completo para teclado
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    } else if (e.key === '+') {
        setOperator('+');
    } else if (e.key === '-') {
        setOperator('-');
    } else if (e.key === '*') {
        setOperator('*');
    } else if (e.key === '^') { 
        setOperator('^'); // Corregido el mapeo de la tecla
    } else if (e.key === '/') { 
        e.preventDefault(); 
        setOperator('/'); 
    } else if (e.key === 'Enter' || e.key === '=') { 
        e.preventDefault(); 
        calculate(); 
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        if (!shouldResetDisplay && display.value.length > 0) {
            updateDisplay(display.value.slice(0, -1));
        }
    }
});
