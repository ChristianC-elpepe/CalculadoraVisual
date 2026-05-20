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

    updateDisplay(firstOperand + ' ' + op);
}

// Nueva función para operaciones científicas instantáneas
function scientificOp(op) {
    if (display.value === '' && op !== 'pi') return;
    
    let val = parseFloat(display.value);
    let result;

    switch (op) {
        case 'sin':  result = Math.sin(val); break;
        case 'cos':  result = Math.cos(val); break;
        case 'tan':  result = Math.tan(val); break;
        case 'sqrt': result = Math.sqrt(val); break;
        case 'log':  result = Math.log10(val); break;
        case 'ln':   result = Math.log(val); break;
        case 'pi':   result = Math.PI; break;
    }

    if (isNaN(result) || result === Infinity || result === -Infinity) {
        updateDisplay('Error');
        clearDisplay();
        return;
    }

    result = parseFloat(result.toFixed(10));
    updateDisplay(result);
    firstOperand = result;
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
                updateDisplay('Error');
                currentOperator = null;
                firstOperand = '';
                return;
            }
            result = a / b;
            break;
        case '^': // Operación de potencia añadida
            result = Math.pow(a, b);
            break;
    }

    result = parseFloat(result.toFixed(10));

    updateDisplay(result);
    firstOperand = result;
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

// Soporte para teclado
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') appendNumber(e.key);
    else if (e.key === '+') setOperator('+');
    else if (e.key === '-') setOperator('-');
    else if (e.key === '*') setOperator('*');
    else if (e.key === '^') setOperator('|');
    else if (e.key === '/') { e.preventDefault(); setOperator('/'); }
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape') clearDisplay();
});
