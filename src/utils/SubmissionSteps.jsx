// src/components/SubmissionSteps.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailStep from '../pages/EmailStep';
import CloseButton from '../pages/components/CloseButton';

const SubmissionSteps = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ email: '' });
  const navigate = useNavigate();

  const handleNext = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className="main-container">
      {/* <CloseButton onClose={onClose} navigate={navigate} /> */}
      <div className="content-wrapper">

        <div className="step-indicator">
          Step {currentStep} of 1

        </div>
        {currentStep === 1 && (
          <EmailStep
            onNext={handleNext}
            onClose={onClose}
            initialData={{ email: formData.email }}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
};

export default SubmissionSteps;