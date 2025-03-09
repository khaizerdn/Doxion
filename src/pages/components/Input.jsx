// src/pages/components/Input.jsx
import React from 'react';

const Input = ({ placeholder, value, onChange, emailError, className = '' }) => {
  const inputStyles = `
    .input-field {
      width: 100%;
      height: 120px;
      padding: 30px;
      font-size: 2rem;
      color: var(--color-muted-dark);
      background-color: var(--elevation-1);
      border: 1px solid ${emailError ? 'var(--color-error)' : 'var(--elevation-3)'};
      border-radius: var(--global-border-radius);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      margin: 10px 0;
      transition: border-color 0.3s ease; /* Smooth transition for border color change */
    }
    .input-field::placeholder {
      color: var(--color-muted-light);
    }
    .input-field:focus {
      outline: none;
      border-color: ${emailError ? 'var(--color-error)' : 'var(--elevation-3)'}; /* Maintain error state on focus */
    }
    .input-field:invalid {
      border-color: var(--color-error); /* Fallback for native validation */
    }
    /* When inside input-wrapper, remove border and adjust styles */
    .input-wrapper .input-field {
      border: none;
      background: transparent;
      border-radius: var(--global-border-radius) 0 0 var(--global-border-radius);
    }
  `;

  return (
    <>
      <style>{inputStyles}</style>
      <input
        className={`input-field ${className}`}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={emailError ? 'true' : 'false'}
        aria-describedby={emailError ? `${placeholder.toLowerCase().replace(' ', '-')}-error` : undefined}
      />
    </>
  );
};

export default Input;