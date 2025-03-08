// src/pages/EnterOTP.jsx
import React, { useState, useRef, useEffect } from 'react';
import Button from './components/Button';

const EnterOTP = ({ onNext, onClose, initialData }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store each digit
  const [otpError, setOtpError] = useState('');
  const inputRefs = useRef([]); // Refs for each input to manage focus

  // Define styles inline
  const otpStyles = `
    .otp-instruction {
      font-size: 1rem;
      color: var(--color-muted-dark);
      margin-bottom: 20px;
    }

    .otp-container {
      display: flex;
      gap: 10px;
      margin: 10px 0 20px;
      justify-content: space-between;
    }

    .otp-input {
      width: 60px;
      height: 60px;
      text-align: center;
      font-size: 1.5rem;
      color: var(--color-muted-dark);
      background-color: var(--elevation-1);
      border: 1px solid var(--elevation-3);
      border-radius: var(--global-border-radius);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: border-color 0.3s ease;
    }

    .otp-input:focus {
      outline: none;
      border-color: var(--elevation-3);
    }

    .otp-input-error {
      border-color: var(--color-error);
    }

    .otp-input:invalid {
      border-color: var(--color-error);
    }
  `;

  // Handle input change for each digit
  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) { // Allow only single digits or empty
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Clear error when user starts typing
      setOtpError('');

      // Move focus to the next input if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle keydown for backspace to move to the previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Focus the first input on component mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle form submission
  const handleSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpError('');
    onNext({ otp: otpValue }); // Pass the OTP to the next step
  };

  return (
    <>
      <style>{otpStyles}</style>
      <h2>ENTER YOUR OTP</h2>
      <p className="otp-instruction">
        Please enter the 6-digit OTP sent to your email.
      </p>
      <div className="otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            className={`otp-input ${otpError ? 'otp-input-error' : ''}`}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      {otpError && (
        <p className="error-message" aria-live="polite">
          {otpError}
        </p>
      )}
      <div className="action-button">
        <Button type="secondary" onClick={onClose}>
          CANCEL
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          CONTINUE
        </Button>
      </div>
    </>
  );
};

export default EnterOTP;