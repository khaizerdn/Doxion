import React, { useState, useEffect } from 'react';

function ReceiveComplete({ onCountdownComplete, goBack}) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onCountdownComplete();
    }
  }, [countdown, onCountdownComplete]);

  return (
    <>
    <div className="submission-complete-container">
      <h1>LOCKER UNLOCKED!</h1>
      <p>
        You can now retrieve your document from the assigned locker (#N). Thank you for using Doxion!
      </p>
      <div className="countdown-timer">
        <div className="countdown-circle">
          <span>{countdown}</span>
        </div>
        <p>Redirecting to the homepage...</p>
        <button className='goHomePageButton' onClick={goBack}>DONE</button>
      </div>
    </div>
    </>
  );
}

export default ReceiveComplete;
