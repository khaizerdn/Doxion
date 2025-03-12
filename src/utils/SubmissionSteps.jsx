import React, { useState } from 'react';
import ConfirmEmail from '../pages/ConfirmEmail';
import EnterOTP from '../pages/EnterOTP';
import SubmissionForm from '../pages/SubmissionForm';

const SubmissionSteps = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    activity_log_id: '',
    expires_at: '',
    expiration_timestamp: 0,
    otp: '',
    recipientEmail: '',
    note: '',
    lockerNumber: '',
  });

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));

    if (currentStep === 1 && data.email && !data.otp) {
      setCurrentStep(2);
    } else if (currentStep === 2 && data.otp) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      console.log('Activity log complete with:', { ...formData, ...data });
      onClose();
    }
  };

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <p style={{ fontSize: 'var(--font-size-5)' }}>
          Submit (Step {currentStep} of 3)
        </p>
        {currentStep === 1 && (
          <ConfirmEmail
            onNext={handleNext}
            onClose={onClose}
            initialData={{ email: formData.email }}
          />
        )}
        {currentStep === 2 && (
          <EnterOTP
            onNext={handleNext}
            onClose={onClose}
            initialData={{
              email: formData.email,
              otp: formData.otp,
              expiration_timestamp: formData.expiration_timestamp,
            }}
          />
        )}
        {currentStep === 3 && (
          <SubmissionForm
            onNext={handleNext}
            onClose={onClose}
            initialData={{
              email: formData.email,
              otp: formData.otp,
              recipientEmail: formData.recipientEmail,
              note: formData.note,
              lockerNumber: formData.lockerNumber,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SubmissionSteps;