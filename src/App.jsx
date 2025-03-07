// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import IdlePage from './pages/idlePage';
import UserVerification from './pages/userVerification';
import OTPVerification from './pages/OTPVerification';
import SubmissionForm from './pages/SubmissionForm';
import SubmissionComplete from './pages/SubmissionComplete';
import ReceiveForm from './pages/ReceiveForm';
import ReceiveComplete from './pages/ReceiveComplete';
import TermsAndConditions from './pages/TermsAndConditions';
import Recipient from './pages/Recipient'; // New page for Recipient Email Address
import LockerNumber from './pages/LockerNumber'; // New page for Locker Number

function App() {
  const [step, setStep] = useState(0);
  const [processType, setProcessType] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [idleTime, setIdleTime] = useState(9999999); // Set initial idle time to a large number

  const handleStart = () => setStep(1);
  const handleSubmitClick = () => { setProcessType('submit'); setStep(2); };
  const handleReceiveClick = () => { setProcessType('receive'); setStep(4); };
  const handleVerificationComplete = (email) => { setUserEmail(email); setStep(3); };
  const handleOTPComplete = () => setStep(4);
  const handleFormSubmit = () => setStep(5);
  const goBack = () => setStep(0); // Go back to IdlePage (step 0)
  const resetIdleTimer = () => setIdleTime(9999999); // Reset idle time

  // Idle timer logic
  useEffect(() => {
    if (step === 0) return; // No idle timer on the IdlePage

    const idleInterval = setInterval(() => {
      setIdleTime((prev) => {
        if (prev <= 1) {
          goBack(); // Redirect to IdlePage when timer reaches 0
          clearInterval(idleInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Reset idle timer on user interaction
    const resetEvents = () => resetIdleTimer();
    ['mousemove', 'keydown', 'click'].forEach(event => window.addEventListener(event, resetEvents));

    // Cleanup
    return () => {
      clearInterval(idleInterval);
      ['mousemove', 'keydown', 'click'].forEach(event => window.removeEventListener(event, resetEvents));
    };
  }, [step]);

  return (
    <Router>
      <Routes>
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/recipient" element={<Recipient />} />
        <Route path="/lockernumber" element={<LockerNumber />} />
        <Route path="/" element={
          <div className="container">
            {step === 0 && <IdlePage onStart={handleStart} idleTime={idleTime} />}
            {step === 1 && (
              <div className='content-container'>
                <div className="homepage">
                  <header className="header">
                    <h1>DOXION</h1>
                    <p>We find ways to submit</p>
                  </header>
                  <div className="button-container">
                    <button className="submit-btn" onClick={handleSubmitClick}>SUBMIT</button>
                    <button className="receive-btn" onClick={handleReceiveClick}>RECEIVE</button>
                  </div>
                  <footer className="footer">
                    <p>
                      By using the Doxion locker, you acknowledge and accept the <Link to="/terms" className='text-link'>terms and conditions</Link> for submitting or receiving documents.
                    </p>
                  </footer>
                </div>
              </div>
            )}
            {step === 2 && <UserVerification processType={processType} onVerificationComplete={handleVerificationComplete} goBack={goBack} />}
            {step === 3 && <OTPVerification email={userEmail} onOTPComplete={handleOTPComplete} goBack={goBack} />}
            {step === 4 && processType === 'submit' && <SubmissionForm onFormSubmit={handleFormSubmit} goBack={goBack} />}
            {step === 4 && processType === 'receive' && <ReceiveForm onFormSubmit={handleFormSubmit} goBack={goBack} />}
            {step === 5 && processType === 'submit' && <SubmissionComplete onCountdownComplete={goBack} goBack={goBack} />}
            {step === 5 && processType === 'receive' && <ReceiveComplete onCountdownComplete={goBack} goBack={goBack} />}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
