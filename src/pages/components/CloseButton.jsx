// src/components/CloseButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define styles as a constant for better maintainability
const styles = `
  .close-button {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid var(--elevation-3);
    background: transparent;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #666;
    padding: 0;
    margin: 0;
    line-height: 1;
    transition: all 0.2s ease;
  }

  .close-button:hover {
    border-color: var(--elevation-5);
    color: var(--color-primary-dark);
  }
`;

const CloseButton = ({ onClose }) => {
  const navigate = useNavigate();

  // Handle close action with both navigation and optional callback
  const handleClose = () => {
    navigate('/main');
    if (onClose) onClose();
  };

  return (
    <>
      <style>{styles}</style>
      <button
        className="close-button"
        onClick={handleClose}
        aria-label="Close and return to main page"
      >
        X
      </button>
    </>
  );
};

export default CloseButton;