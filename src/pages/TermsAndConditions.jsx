// src/pages/TermsAndConditions/TermsAndConditions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function TermsAndConditions() {
  const termsStyles = `
    .terms-content {
      max-width: 700px; /* Constrain content width */
      width: 100%;
      text-align: left;
      margin: 50px 0px;
    }
    .terms-content h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }
    .terms-content h2 {
      font-size: 1.75rem;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .terms-content p {
      margin-bottom: 15px;
    }
    .back-link {
      color: var(--text-accent);
      text-decoration: none;
      margin-top: 20px;
      display: inline-block;
    }
    .back-link:hover {
      text-decoration: underline;
    }
  `;

  return (
    <>
      <style>{termsStyles}</style>
      <div className="main-container">
        <div className="terms-content">
          <h1>Terms and Conditions</h1>
          <p>Last Updated: March 07, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Doxion service, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our service.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            Doxion provides a platform for submitting and receiving documents. You agree to use the service only for lawful purposes and in accordance with these terms.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of any information submitted or received through Doxion and for all activities that occur under your usage.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            Doxion is not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the service.
          </p>

          <h2>5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective upon posting to this page.
          </p>

          <h2>6. Privacy Policy</h2>
          <p>
            Your use of Doxion is also governed by our Privacy Policy, which can be found on our website. Please review it to understand how we handle your data.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your access to the service at our sole discretion, without notice, for conduct that we believe violates these terms.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>

          <Link to="/main" className="back-link">
            Back to Main Page
          </Link>
        </div>
      </div>
    </>
  );
}

export default TermsAndConditions;