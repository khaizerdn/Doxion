// src/pages/TermsAndConditions/TermsAndConditions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function TermsAndConditions() {
  const termsStyles = {
    container: {
      maxWidth: '1000px',
      width: '100%',
      padding: '50px',
      textAlign: 'left',
    },
    heading1: {
      fontSize: '2.5rem',
      marginBottom: '20px',
    },
    heading2: {
      fontSize: '1.75rem',
      marginTop: '30px',
      marginBottom: '15px',
    },
    text: {
      marginBottom: '15px',
      lineHeight: '1.5',
      fontSize: 'var(--font-size-5)',  // 1.4rem for all non-title text
    },
    orderedList: {
      marginBottom: '15px',
      paddingLeft: '20px',
      fontSize: 'var(--font-size-5)',  // 1.4rem
      lineHeight: '1.5',
    },
    listItem: {
      marginBottom: '8px',
    },
    separator: {
      border: 'none',
      borderTop: '1px solid var(--elevation-2)',  // Light gray line
      margin: '25px 0',  // Spacing above and below
    },
    link: {
      color: 'var(--text-accent)',
      textDecoration: 'none',
      marginTop: '20px',
      display: 'inline-block',
    },
  };

  return (
    <div className="main-container">
      <div style={termsStyles.container}>
        <h1 style={termsStyles.heading1}>Terms and Conditions</h1>
        <p style={termsStyles.text}>Last Updated: March 12, 2025</p>

        <p style={termsStyles.text}>
          Welcome to Doxion Locker System, a platform developed to streamline the process of document submission, retrieval, and distribution within the university. By using this system, you agree to comply with these terms and conditions.
        </p>

        <hr style={termsStyles.separator} />

        <h2 style={termsStyles.heading2}>Eligibility</h2>
        <p style={termsStyles.text}>
          This system is available to all students, faculty members, and authorized staff at the university.
        </p>

        <hr style={termsStyles.separator} />

        <h2 style={termsStyles.heading2}>User Responsibilities</h2>
        <ol style={termsStyles.orderedList}>
          <li style={termsStyles.listItem}>Users must ensure that all submitted documents are relevant to academic and administrative purposes.</li>
          <li style={termsStyles.listItem}>Users are responsible for keeping their access credentials confidential, both as senders and receivers.</li>
          <li style={termsStyles.listItem}>Users are strictly prohibited from misusing the system, including submitting inappropriate, unauthorized, and irrelevant documents or objects.</li>
        </ol>

        <hr style={termsStyles.separator} />

        <h2 style={termsStyles.heading2}>System Accessibility</h2>
        <ol style={termsStyles.orderedList}>
          <li style={termsStyles.listItem}>The system allows only one sender and one receiver to be assigned to a compartment at a time.</li>
          <li style={termsStyles.listItem}>The system reserves the right to monitor usage for security purposes.</li>
          <li style={termsStyles.listItem}>The system prohibits sharing and transferring of access credentials to another person.</li>
          <li style={termsStyles.listItem}>The system is strictly for university-related document storage and submission.</li>
          <li style={termsStyles.listItem}>The system only accepts documents that fit within the existing compartment size.</li>
        </ol>

        <hr style={termsStyles.separator} />

        <h2 style={termsStyles.heading2}>Privacy and Data Protection</h2>
        <ol style={termsStyles.orderedList}>
          <li style={termsStyles.listItem}>All user data such as name, email address, and OTP are securely stored and accessed only by the right users and authorized personnel.</li>
          <li style={termsStyles.listItem}>All user data will not be shared with third parties without user consent, except as required by law.</li>
        </ol>

        <hr style={termsStyles.separator} />

        <h2 style={termsStyles.heading2}>Liability</h2>
        <ol style={termsStyles.orderedList}>
          <li style={termsStyles.listItem}>The system is not responsible for negligence by users, including misplacement, improper storage, and damage to documents.</li>
          <li style={termsStyles.listItem}>Users are encouraged to keep backup copies of their submitted documents to prevent issues such as technical problems and accidental loss.</li>
        </ol>

        <hr style={termsStyles.separator} />

        <h2 style={termsStyles.heading2}>System Maintenance</h2>
        <p style={termsStyles.text}>
          Scheduled maintenance may result in temporary unavailability of the locker system. Authorized personnel will provide advance notice of planned maintenance whenever possible.
        </p>

        <hr style={termsStyles.separator} />

        <h2 style={termsStyles.heading2}>Contact Information</h2>
        <p style={termsStyles.text}>
          For any questions, concerns, or feedback regarding the Document Locker System, please email doxion.system@gmail.com or reach out to the developers directly.
        </p>

        <hr style={termsStyles.separator} />

        <p style={termsStyles.text}>
          By using this system, you acknowledge that you have read, understood, and agreed to these terms and conditions.
        </p>

        <Link
          to="/main"
          style={{
            ...termsStyles.link,
            fontSize: 'var(--font-size-5)',
            color: 'var(--color-muted-dark)',
          }}
        >
          Back to Main Page
        </Link>
      </div>
    </div>
  );
}

export default TermsAndConditions;