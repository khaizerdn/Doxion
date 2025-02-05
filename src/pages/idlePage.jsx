import React from 'react';

const IdlePage = ({ onStart }) => {
  return (
    <div 
      className="idle-page"
      onClick={onStart}
      onTouchStart={onStart} // For touch devices
    >
      <div className="idle-content">
        <p>TOUCH ANYWHERE TO START</p>
      </div>
    </div>
  );
};

export default IdlePage;