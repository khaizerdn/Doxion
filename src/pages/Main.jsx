import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Button from './components/Button';
import SubmissionSteps from '../utils/SubmissionSteps';

function Main() {
  const [showSubmissionSteps, setShowSubmissionSteps] = useState(false);

  const mainStyles = `
    .terms-link {
      color: var(--text-accent); /* Use accent color for terms link */
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
            <h1 style={{ fontWeight: '900' }}>DOXION</h1>
            <h2 style={{ marginBottom: 10 }}>We find ways to submit シ</h2>
            <Button type="primary" onClick={() => setShowSubmissionSteps(true)} style={{ height: 150 }}>
              SUBMIT
            </Button>
            <Button type="muted" onClick={() => console.log('Receive clicked')} style={{ height: 150 }}> 
              RECEIVE
            </Button>
            <p style={{ marginTop: 10 }}>
              By using the Doxion locker, you acknowledge and accept the{' '}
              <Link to="/termsandconditions" className="terms-link">
                <strong>terms and conditions</strong>
              </Link>{' '}
              for submitting or receiving documents.
              <br />
              <Link to="/adminpanel" className="terms-link" style={{ fontSize: 'var(--font-size-6)'}}> Click here for the admin panel.</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;