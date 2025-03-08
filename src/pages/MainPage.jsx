// src/pages/Main/MainPage.jsx
import React, { useState } from 'react';
import Button from './components/Button';
import SubmissionSteps from '../utils/SubmissionSteps';

function MainPage() {
  const [showSubmissionSteps, setShowSubmissionSteps] = useState(false);

  const mainStyles = `
    .disclaimer {
      font-size: 1.2rem;
      color: var(--color-muted-dark);
      max-width: 600px;
      margin-top: 20px;
      line-height: 1.6;
      width: 100%;
    }
  `;

  return (
    <>
      <style>{mainStyles}</style>
      {showSubmissionSteps ? (
        <SubmissionSteps onClose={() => setShowSubmissionSteps(false)} />
      ) : (
        <div className="main-container">
          <div className="content-wrapper">
            <h1>DOXION</h1>
            <h2>We find ways to submit</h2>
            <Button type="primary" onClick={() => setShowSubmissionSteps(true)}>
              SUBMIT
            </Button>
            <Button type="muted" onClick={() => console.log('Receive clicked')}>
              RECEIVE
            </Button>
            <div className="disclaimer">
              By using the Doxion locker, you acknowledge and accept the terms and
              conditions for submitting or receiving documents.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MainPage;