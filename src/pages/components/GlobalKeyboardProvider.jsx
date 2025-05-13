import React, { useState, useEffect, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const GlobalKeyboardProvider = () => {
  const [inputElement, setInputElement] = useState(null);
  const [layout, setLayout] = useState('default');
  const keyboardRef = useRef(null);
  const wrapperRef = useRef(null);

  const insertTextAtCursor = (input, text) => {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newValue = input.value.slice(0, start) + text + input.value.slice(end);
  
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(input, newValue);
  
    const newCaretPos = start + text.length;
    input.setSelectionRange(newCaretPos, newCaretPos);
  
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  

  const deleteTextAtCursor = (input) => {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start === 0 && end === 0) return;
  
    let newStart = start;
    let newValue;
  
    if (start === end) {
      newValue = input.value.slice(0, start - 1) + input.value.slice(end);
      newStart = start - 1;
    } else {
      newValue = input.value.slice(0, start) + input.value.slice(end);
    }
  
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(input, newValue);
  
    input.setSelectionRange(newStart, newStart);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };  

  const onKeyPress = (button) => {
    if (!inputElement) return;

    if (button === '{shift}' || button === '{lock}') {
      setLayout((prev) => (prev === 'default' ? 'shift' : 'default'));
    } else if (button === '{bksp}') {
      deleteTextAtCursor(inputElement);
    } else if (button === '{space}') {
      insertTextAtCursor(inputElement, ' ');
    } else if (button === '{numbers}') {
      setLayout('numbers');
    } else if (button === '{abc}') {
      setLayout('default');
    } else if (button === '{done}') {
      setInputElement(null); // Close the keyboard
    } else {
      insertTextAtCursor(inputElement, button);
    }
  };

  useEffect(() => {
    const handleFocusIn = (e) => {
      const el = e.target;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        setInputElement(el);
        setLayout('default'); // Reset layout when focusing input
      }
    };
  
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA'
      ) {
        setInputElement(null);
      }
    };
  
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  

  if (!inputElement) return null;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '#f8f8f8',
        zIndex: 9999,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        minHeight: '280px', // Or any preferred height
      }}      
      onMouseDown={(e) => e.preventDefault()}
    >
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layout}
        onKeyPress={onKeyPress}
        layout={{
          default: [
            'q w e r t y u i o p',
            'a s d f g h j k l',
            '{shift} z x c v b n m {bksp}',
            '{numbers} {space} .',
          ],
          shift: [
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            '{shift} Z X C V B N M {bksp}',
            '{numbers} {space} .',
          ],
          numbers: [
            '1 2 3 4 5 6 7 8 9 0',
            '- / : ; ( ) ₱ & @',
            '. , ? ! \' " # % + =',
            '{abc} {space} .',
          ],
        }}
        display={{
          '{bksp}': '⌫',
          '{space}': '␣',
          '{shift}': '⇧',
          '{numbers}': '123',
          '{abc}': 'ABC',
          '{done}': 'Done',
        }}
        theme="hg-theme-default hg-layout-default"
      />
    </div>
  );
};

export default GlobalKeyboardProvider;
