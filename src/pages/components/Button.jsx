import React, { useState } from 'react';

const Button = ({ type, children, onClick, width = '100%', height = '120px', fontSize = '2rem' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseColor = type === 'primary' ? 'var(--color-primary-dark)' : 'var(--elevation-2)';
  const hoverColor = type === 'primary' ? '#6e6e6e' : 'var(--elevation-1)';

  const buttonStyles = `
    button {
      padding: 0;
      width: ${width};
      height: ${height};
      font-size: ${fontSize};
      font-weight: 800;
      border: none;
      border-radius: var(--global-border-radius);
      cursor: pointer;
      transition: background-color 0.3s;
      margin: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: ${type === 'primary' ? '0 2px 4px rgba(0, 0, 0, 0.05)' : '0 1px 2px rgba(0, 0, 0, 0.05)'};
    }

    button:focus {
      outline: none;
    }
  `;

  return (
    <>
      <style>{buttonStyles}</style>
      <button
        className={type === 'primary' ? 'primary-button' : 'muted-button'}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? hoverColor : baseColor,
          color: type === 'primary' ? '#ffffff' : 'var(--color-muted-dark)',
        }}
      >
        {children}
      </button>
    </>
  );
};

export default Button;