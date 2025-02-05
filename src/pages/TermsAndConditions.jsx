import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>
      <div className="terms-content">
        <p><strong>Welcome to Doxion Locker System</strong>, a platform developed to streamline the process of document submission, retrieval, and distribution within the university. By using this system, you agree to comply with these terms and conditions.</p>
        
        <h2>Eligibility</h2>
        <p>This system is available to all students, faculty members, and authorized staff at the university.</p>
        
        <h2>User Responsibilities</h2>
        <ul>
          <li>Users must ensure that all submitted documents are relevant to academic and administrative purposes.</li>
          <li>Users are responsible for keeping their access credentials confidential, both as senders and receivers.</li>
          <li>Users are strictly prohibited from misusing the system, including submitting inappropriate, unauthorized, and irrelevant documents or objects.</li>
        </ul>
        
        <h2>System Accessibility</h2>
        <ul>
          <li>The system allows only one sender and one receiver to be assigned to a compartment at a time.</li>
          <li>The system reserves the right to monitor usage for security purposes.</li>
          <li>The system prohibits sharing and transferring of access credentials to another person.</li>
          <li>The system is strictly for university-related document storage and submission.</li>
          <li>The system only accepts documents that fit within the existing compartment size.</li>
        </ul>
        
        <h2>Privacy and Data Protection</h2>
        <ul>
          <li>All user data such as name, email address, and OTP are securely stored and accessed only by the right users and authorized personnel.</li>
          <li>All user data will not be shared with third parties without user consent, except as required by law.</li>
        </ul>
        
        <h2>Liability</h2>
        <ul>
          <li>The system is not responsible for negligence by users, including misplacement, improper storage, and damage to documents.</li>
          <li>Users are encouraged to keep backup copies of their submitted documents to prevent issues such as technical problems and accidental loss.</li>
        </ul>
        
        <h2>System Maintenance</h2>
        <p>Scheduled maintenance may result in temporary unavailability of the locker system. Authorized personnel will provide advance notice of planned maintenance whenever possible.</p>
        
        <p>For any questions, concerns, or feedback regarding the Document Locker System, please email <strong>doxion.system@gmail.com</strong> or reach out to the developers directly.</p>
        
        <p><strong>By using this system, you acknowledge that you have read, understood, and agreed to these terms and conditions.</strong></p>
      </div>
      <div className='container-cancelbutton'>
        <button className='goHomePageButton' onClick={() => navigate(-1)}>BACK</button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
