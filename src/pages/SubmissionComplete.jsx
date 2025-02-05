import React, { useState, useEffect } from 'react';

function SubmissionComplete({ onCountdownComplete, goBack }) {
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
        Please place your document in the assigned locker (#N). The recipient has been notified of your submission, and you will receive an email confirming after the recipient has successfully received the document.
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

export default SubmissionComplete;
