// src/pages/Main/Main.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Button from './components/Button';
import SubmissionSteps from '../utils/SubmissionSteps';

function Main() {
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
    .terms-link {
      color: var(--text-accent); /* Use accent color for link */
      text-decoration: none; /* Remove default underline */
    }
    .terms-link:hover {
      text-decoration: underline; /* Add underline on hover for better UX */
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
            <h2>We find ways to submit シ</h2>
            <Button type="primary" onClick={() => setShowSubmissionSteps(true)}>
              SUBMIT
            </Button>
            <Button type="muted" onClick={() => console.log('Receive clicked')}>
              RECEIVE
            </Button>
            <div className="disclaimer">
              By using the Doxion locker, you acknowledge and accept the{' '}
              <Link to="/termsandconditions" className="terms-link">
                <strong>terms and conditions</strong>
              </Link>{' '}
              for submitting or receiving documents.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;