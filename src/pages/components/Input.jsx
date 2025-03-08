import React from 'react';

const Input = ({ placeholder, value, onChange, className = '' }) => {
  const inputStyles = `
    .input-field {
      width: 100%;
      height: 120px;
      padding: 30px; /* Changed from 0 to 10px - adjust this value as needed */
      font-size: 2rem;
      color: var(--color-muted-dark);
      background-color: var(--elevation-1);
      border: 1px solid var(--elevation-3);
      border-radius: var(--global-border-radius);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      margin: 10px 0;
    }
    .input-field::placeholder {
      color: var(--color-muted-light);
    }
    .input-field:focus {
      outline: none;
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
      />
    </>
  );
};

export default Input;