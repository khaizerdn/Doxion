// src/components/BackButton.jsx
import React, { useState } from 'react';

const BackButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseColor = 'var(--elevation-1)';
  const hoverColor = 'var(--elevation-2)';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '40px',
        height: '40px',
        padding: '8px',
        border: 'none',
        backgroundColor: isHovered ? hoverColor : baseColor,
        borderRadius: 'var(--global-border-radius)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isHovered 
          ? '0 2px 4px rgba(0, 0, 0, 0.05)' // Matches primary button hover
          : '0 1px 2px rgba(0, 0, 0, 0.05)', // Matches secondary button
        transition: 'background-color 0.3s, box-shadow 0.3s' // Matches button transition
      }}
      title="Go Back"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="var(--color-muted-dark)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackButton;