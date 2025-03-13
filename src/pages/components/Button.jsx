import React, { useState } from 'react';

const Button = ({ type, children, onClick, width = '100%', height = 'var(--global-button-height)', fontSize = 'var(--font-size-3)', className = '', style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseColor = type === 'primary' ? 'var(--color-accent)' : 'var(--elevation-2)';
  const hoverColor = type === 'primary' ? 'var(--color-accent-hover)' : 'var(--elevation-1)';

  // Use a unique class name to scope styles
  const buttonClass = `custom-button-${type || 'default'}`;

  const buttonStyles = `
    .${buttonClass} {
      padding: 0;
      width: ${width};
      height: ${height};
      font-size: ${fontSize};
      font-weight: 700;
      font-family: var(--font-family);
      border: none;
      border-radius: var(--global-border-radius);
      cursor: pointer;
      transition: background-color 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: ${type === 'primary' ? '0 2px 4px rgba(0, 0, 0, 0.05)' : '0 1px 2px rgba(0, 0, 0, 0.05)'};
    }

    .${buttonClass}:focus {
      outline: none;
    }
  `;

  return (
    <>
      <style>{buttonStyles}</style>
      <button
        className={`${buttonClass} ${className}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? hoverColor : baseColor,
          color: type === 'primary' ? '#ffffff' : 'var(--color-muted-dark)',
          height, // Ensure height prop is applied inline
          ...style, // Merge additional styles
        }}
      >
        {children}
      </button>
    </>
  );
};

export default Button;