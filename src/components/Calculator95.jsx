import React, { useState } from 'react';

export default function Calculator95() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [memory, setMemory] = useState(0);

  const handleDigit = (digit) => {
    if (overwrite || display === '0') {
      setDisplay(digit);
      setOverwrite(false);
    } else {
      if (display.length < 14) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOp = (nextOp) => {
    const current = parseFloat(display);
    if (prevValue === null) {
      setPrevValue(current);
    } else if (operation) {
      const result = compute(prevValue, current, operation);
      setPrevValue(result);
      setDisplay(String(result));
    }
    setOperation(nextOp);
    setOverwrite(true);
  };

  const compute = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 'ERR: DIV 0';
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation === null || prevValue === null) return;
    const current = parseFloat(display);
    const result = compute(prevValue, current, operation);
    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setOverwrite(true);
  };

  const handleBackspace = () => {
    if (overwrite) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setOverwrite(true);
    }
  };

  const handleSqrt = () => {
    const val = parseFloat(display);
    if (val >= 0) {
      setDisplay(String(Math.sqrt(val)));
      setOverwrite(true);
    } else {
      setDisplay('ERR');
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    if (prevValue !== null) {
      setDisplay(String((prevValue * val) / 100));
    } else {
      setDisplay(String(val / 100));
    }
    setOverwrite(true);
  };

  const handleInvert = () => {
    const val = parseFloat(display);
    if (val !== 0) {
      setDisplay(String(1 / val));
      setOverwrite(true);
    }
  };

  const handleNegate = () => {
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  // Memory functions
  const handleMemory = (type) => {
    const current = parseFloat(display);
    if (type === 'MC') setMemory(0);
    if (type === 'MR') { setDisplay(String(memory)); setOverwrite(true); }
    if (type === 'MS') { setMemory(current); setOverwrite(true); }
    if (type === 'M+') { setMemory(memory + current); setOverwrite(true); }
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-silver)',
      border: '2px solid',
      borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
      boxShadow: 'inset 1px 1px 0px #fff, inset -1px -1px 0px #808080',
      padding: '6px',
      width: '100%'
    }}>
      {/* Title */}
      <div style={{
        backgroundColor: 'var(--color-navy-blue)',
        color: '#fff',
        padding: '2px 4px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px'
      }}>
        <span>🧮 Kalkulator Windows 95</span>
        <span style={{ fontSize: '9px', opacity: 0.8 }}>Standard</span>
      </div>

      {/* Screen Display */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px inset #000',
        padding: '4px 6px',
        textAlign: 'right',
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#000',
        minHeight: '26px',
        marginBottom: '6px',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {display}
      </div>

      {/* Memory Status & Quick controls */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        <div style={{
          flex: 1,
          border: '1px solid #808080',
          padding: '2px 4px',
          textAlign: 'center',
          fontSize: '10px',
          fontWeight: 'bold',
          backgroundColor: memory !== 0 ? '#ffffe0' : '#eee',
          color: memory !== 0 ? '#b00' : '#888'
        }}>
          {memory !== 0 ? 'M' : ''}
        </div>
        <button onClick={handleBackspace} style={{ flex: 2, padding: '2px 4px', fontSize: '10px' }}>Backspace</button>
        <button onClick={handleClearEntry} style={{ flex: 1.5, padding: '2px 4px', fontSize: '10px' }}>CE</button>
        <button onClick={handleClear} style={{ flex: 1.5, padding: '2px 4px', fontSize: '10px' }}>C</button>
      </div>

      {/* Keypad Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px' }}>
        {/* Row 1 */}
        <button onClick={() => handleMemory('MC')} style={{ fontSize: '10px', color: '#b00', padding: '3px 0' }}>MC</button>
        <button onClick={() => handleDigit('7')}>7</button>
        <button onClick={() => handleDigit('8')}>8</button>
        <button onClick={() => handleDigit('9')}>9</button>
        <button onClick={() => handleOp('/')} style={{ color: '#00007c' }}>/</button>

        {/* Row 2 */}
        <button onClick={() => handleMemory('MR')} style={{ fontSize: '10px', color: '#b00', padding: '3px 0' }}>MR</button>
        <button onClick={() => handleDigit('4')}>4</button>
        <button onClick={() => handleDigit('5')}>5</button>
        <button onClick={() => handleDigit('6')}>6</button>
        <button onClick={() => handleOp('*')} style={{ color: '#00007c' }}>*</button>

        {/* Row 3 */}
        <button onClick={() => handleMemory('MS')} style={{ fontSize: '10px', color: '#b00', padding: '3px 0' }}>MS</button>
        <button onClick={() => handleDigit('1')}>1</button>
        <button onClick={() => handleDigit('2')}>2</button>
        <button onClick={() => handleDigit('3')}>3</button>
        <button onClick={() => handleOp('-')} style={{ color: '#00007c' }}>-</button>

        {/* Row 4 */}
        <button onClick={() => handleMemory('M+')} style={{ fontSize: '10px', color: '#b00', padding: '3px 0' }}>M+</button>
        <button onClick={() => handleDigit('0')}>0</button>
        <button onClick={handleNegate}>+/-</button>
        <button onClick={handleDecimal}>.</button>
        <button onClick={() => handleOp('+')} style={{ color: '#00007c' }}>+</button>
      </div>

      {/* Equals button */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginTop: '3px' }}>
        <button onClick={handlePercent} style={{ fontSize: '10px' }}>%</button>
        <button onClick={handleEquals} style={{ fontWeight: 'bold', color: '#b00' }}>=</button>
      </div>
    </div>
  );
}
