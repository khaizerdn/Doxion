// src/components/SubmissionSteps.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmEmail from '../pages/ConfirmEmail';
import EnterOTP from '../pages/EnterOTP'; // Import the new page
import CloseButton from '../pages/components/CloseButton';

const SubmissionSteps = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ email: '' });
  const navigate = useNavigate();

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="main-container">
      {/* <CloseButton onClose={onClose} navigate={navigate} /> */}
      <div className="content-wrapper">
        <div className="step-indicator">
          Step {currentStep} of 2 {/* Updated total steps */}
        </div>
        {currentStep === 1 && (
          <ConfirmEmail
            onNext={handleNext}
            onClose={onClose}
            initialData={{ email: formData.email }}
            navigate={navigate}
          />
        )}
        {currentStep === 2 && (
          <EnterOTP
            onNext={handleNext}
            onClose={onClose}
            onPrevious={handlePrevious} // Optional: if you want to allow going back
            initialData={{ otp: formData.otp || '' }}
          />
        )}
      </div>
    </div>
  );
};

export default SubmissionSteps;