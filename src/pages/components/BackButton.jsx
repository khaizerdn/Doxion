import React, { useState } from 'react';

const BackButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseColor = 'var(--elevation-2)'; // Matches secondary button in Button.jsx
  const hoverColor = 'var(--elevation-1)'; // Matches secondary button hover in Button.jsx

  // Define a unique class name for scoped styles
  const buttonClass = 'custom-back-button';

  const buttonStyles = `
    .${buttonClass} {
      padding: 0; /* Remove padding to use full 100x100px space */
      width: 100px;
      height: 100px;
      border: none;
      border-radius: var(--global-border-radius);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Matches secondary button shadow */
      transition: background-color 0.3s; /* Matches Button.jsx transition */
    }

    .${buttonClass}:focus {
      outline: none;
    }
  `;

  return (
    <>
      <style>{buttonStyles}</style>
      <button
        className={buttonClass}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? hoverColor : baseColor,
        }}
        title="Go Back"
      >
        <svg
          width="50" // Increased size to better fill the button
          height="50"
          viewBox="0 0 24 24" // Keep viewBox for coordinate system
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5" // Adjusted path to center the arrow
            stroke="var(--color-muted-dark)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
};

export default BackButton;