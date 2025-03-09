import React, { useState } from 'react';
import ConfirmEmail from '../pages/ConfirmEmail';
import EnterOTP from '../pages/EnterOTP';
import SubmissionForm from '../pages/SubmissionForm';

const SubmissionSteps = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        submission_id: '',
        expires_at: '',
        expiration_timestamp: 0,
        otp: '',
        firstName: '',
        lastName: '',
        recipientEmail: '',
        note: '',
        lockerNumber: ''
    });

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));

        // Increment step based on current step and data provided
        if (currentStep === 1 && data.email && !data.otp) {
            // First call from ConfirmEmail (email only)
            setCurrentStep(2);
        } else if (currentStep === 2 && data.otp) {
            // Call from EnterOTP with matching OTP
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // Final submission from SubmissionForm
            console.log('Submission complete with:', { ...formData, ...data });
            onClose();
        }
    };

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <div className="step-indicator">
                    Submit (Step {currentStep} of 3)
                </div>
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
                        initialData={{ otp: formData.otp, expiration_timestamp: formData.expiration_timestamp }}
                    />
                )}
                {currentStep === 3 && (
                    <SubmissionForm
                        onNext={handleNext}
                        onClose={onClose}
                        initialData={{
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            recipientEmail: formData.recipientEmail,
                            note: formData.note,
                            lockerNumber: formData.lockerNumber
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SubmissionSteps;