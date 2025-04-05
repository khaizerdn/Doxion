import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './components/Button';
import SubmissionSteps from '../utils/SubmissionSteps';
import ReceiveForm from '../pages/ReceiveForm';

function Main() {
  const [showSubmissionSteps, setShowSubmissionSteps] = useState(false);
  const [showReceiveForm, setShowReceiveForm] = useState(false);

  const mainStyles = `
    .terms-link {
      color: var(--text-accent);
      text-decoration: none;
    }
    .terms-link:hover {
      text-decoration: underline;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-wrap: nowrap; /* Prevent wrapping */
    }
    .header-title {
      font-weight: 900;
      margin: 0;
      white-space: nowrap; /* Prevent title from wrapping */
      overflow: hidden; /* Hide overflow if title is too long */
      text-overflow: ellipsis; /* Add ellipsis for long titles */
      color: var(--color-accent);
    }
    .admin-button {
      height: 100%; /* Match the height of the header-container */
      aspect-ratio: 1 / 1; /* Enforce 1:1 ratio (modern browsers) */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-sizing: border-box;
      line-height: 1;
    }
    .admin-button-link {
      text-decoration: none; /* Remove underline from Link */
    }
    .admin-icon {
      width: 50%;
      height: 50%;
      fill: currentColor; /* Inherit color from Button */
    }
  `;

  return (
    <>
      <style>{mainStyles}</style>
      {showSubmissionSteps ? (
        <SubmissionSteps onClose={() => setShowSubmissionSteps(false)} />
      ) : showReceiveForm ? (
        <ReceiveForm onClose={() => setShowReceiveForm(false)} />
      ) : (
        <div className="main-container">
          <div className="content-wrapper">
            <div className="header-container">
              <h1 className="header-title">DOXION<h2 style={{ fontSize: '30px', marginBottom: 15, marginTop: 15, color: 'var(--color-accent)' }}>We find ways to pass documents シ</h2></h1>
              <Link to="/adminpanel" className="admin-button-link">
                <Button
                  type="primary"
                  className="admin-button"
                  aria-label="Go to admin panel"
                >
                  <svg
                    className="admin-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </Button>
              </Link>
            </div>
            
            <Button
              type="primary"
              onClick={() => setShowSubmissionSteps(true)}
              style={{ height: 150, fontSize: 'var(--font-size-2)' }}
            >
              SUBMIT
            </Button>
            <Button
              type="muted"
              onClick={() => setShowReceiveForm(true)}
              style={{ height: 150 }}
            >
              RECEIVE
            </Button>
            <p style={{ marginTop: 10 }}>
              By using the Doxion locker, you acknowledge and accept the{' '}
              <Link to="/termsandconditions" className="terms-link">
                <strong>terms and conditions</strong>
              </Link>{' '}
              for submitting or receiving documents.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;