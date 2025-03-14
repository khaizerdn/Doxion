import React, { useState, useRef, useEffect } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import Lottie from 'react-lottie';
import searchDocuAnimationData from '../assets/SearchDocuAnimation.json';

// Locker SVG Icon (reused from SubmissionForm)
const LockerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 2H17C18.1046 2 19 2.89543 19 4V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4C5 2.89543 5.89543 2 7 2Z"
      stroke="var(--color-muted-dark)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15C13.1046 15 14 14.1046 14 13C14 11.8954 13.1046 11 12 11C10.8954 11 10 11.8954 10 13C10 14.1046 10.8954 15 12 15Z"
      stroke="var(--color-muted-dark)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15V18"
      stroke="var(--color-muted-dark)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Success SVG Icon (Green Checkmark)
const SuccessIcon = () => (
  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReceiveForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    lockerNumber: '',
    pin: ['', '', '', '', '', ''], // Array for 6-digit OTP
  });
  const [errors, setErrors] = useState({
    lockerNumber: '',
    pin: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success'
  const inputRefs = useRef([]);
  const hasMounted = useRef(false);

  // Focus first PIN input on mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      inputRefs.current[0]?.focus();
    }
  }, []);

  const LoadingIcon = () => {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: searchDocuAnimationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    return <Lottie options={defaultOptions} height={250} width={250} />;
  };

  const styles = `
    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      height: var(--global-input-height);
      margin: 10px 0;
      border: 1px solid ${errors.lockerNumber ? 'var(--color-error)' : 'var(--elevation-3)'};
      border-radius: var(--global-border-radius);
      background-color: var(--elevation-1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: border-color 0.3s ease;
      overflow: hidden;
    }
    .input-wrapper:focus-within {
      border-color: ${errors.lockerNumber ? 'var(--color-error)' : 'var(--color-primary)'};
    }
    .input-field {
      flex: 1;
      height: 100%;
      padding: 30px;
      font-size: var(--font-size-2);
      color: var(--color-muted-dark);
      background: transparent;
      border: none;
      outline: none;
      border-radius: var(--global-border-radius) 0 0 var(--global-border-radius);
    }
    .select-icon {
      width: var(--global-input-height);
      height: var(--global-input-height);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      border-left: 1px solid var(--elevation-3);
      background-color: var(--elevation-1);
      cursor: pointer;
      transition: background-color 0.3s ease;
      border-radius: 0 var(--global-border-radius) var(--global-border-radius) 0;
    }
    .select-icon:hover {
      background-color: var(--elevation-2);
    }
    .pin-container {
      display: flex;
      gap: 10px;
      margin: 10px 0;
      justify-content: space-between;
    }
    .pin-input {
      width: 100px;
      height: 100px;
      text-align: center;
      font-size: var(--font-size-3);
      color: var(--color-muted-dark);
      background-color: var(--elevation-1);
      border: 1px solid ${errors.pin ? 'var(--color-error)' : 'var(--elevation-3)'};
      border-radius: var(--global-border-radius);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: border-color 0.3s ease;
    }
    .pin-input:focus {
      outline: none;
      border-color: ${errors.pin ? 'var(--color-error)' : 'var(--color-primary)'};
    }
    .action-button {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      width: 100%;
    }
    .action-button button {
      flex: 1;
    }
    .status-container {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.95);
      z-index: 1000;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
    }
    .status-container h2 {
      margin: 30px 0;
      font-size: var(--font-size-3);
      color: #333;
    }
    .status-container p {
      font-size: var(--font-size-4);
      color: #666;
      line-height: 1.5;
      max-width: 600px;
    }
    .status-container.loading h2 {
      margin: 40px 0;
      font-size: var(--font-size-3);
    }
    .status-container.loading p {
      font-size: var(--font-size-4);
    }
  `;

  const handleLockerChange = (e) => {
    setFormData((prev) => ({ ...prev, lockerNumber: e.target.value }));
    setErrors((prev) => ({ ...prev, lockerNumber: '' }));
  };

  const handlePinChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newPin = [...formData.pin];
    newPin[index] = value;
    setFormData((prev) => ({ ...prev, pin: newPin }));
    setErrors((prev) => ({ ...prev, pin: '' }));

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.lockerNumber.trim()) {
      newErrors.lockerNumber = 'Locker number is required';
    }

    const pinString = formData.pin.join('');
    if (pinString.length !== 6 || !/^\d{6}$/.test(pinString)) {
      newErrors.pin = 'Please enter a valid 6-digit OTP or PIN';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setStatus('loading');
    try {
      const submissionData = {
        lockerNumber: formData.lockerNumber,
        otp: formData.pin.join(''),
      };

      const response = await fetch('http://localhost:5000/api/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors((prev) => ({
          ...prev,
          pin: errorData.error || 'Invalid locker number or OTP.',
        }));
        setStatus('idle');
        return;
      }

      const data = await response.json();
      setStatus('success');
      setTimeout(() => {
        console.log('Documents retrieved:', data);
        onClose();
      }, 10000); // Updated to 10 seconds
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        pin: error.message || 'An error occurred. Please try again.',
      }));
      setStatus('idle');
    }
  };

  if (status === 'loading') {
    return (
      <div className="status-container loading">
        <style>{styles}</style>
        <LoadingIcon />
        <h2>Processing Reception</h2>
        <p>Searching your documents...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="status-container">
        <style>{styles}</style>
        <SuccessIcon /> {/* Added SuccessIcon */}
        <h2>Document Found</h2>
        <p>You may now retrieve the documents from locker {formData.lockerNumber}! I hope this papers doesn’t make you angry シ</p>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="main-container">
        <div className="content-wrapper">
          <p style={{ fontSize: 'var(--font-size-5)' }}>
            Receive (Step 1 of 1)
          </p>

          <h2>Receive Document</h2>

          <p style={{ marginBottom: '10px' }}>
            Please enter your locker number and 6-digit OTP below.
          </p>

          {/* Locker Input */}
          <div className="input-wrapper">
            <Input
              className="input-field"
              placeholder="Locker Number"
              value={formData.lockerNumber}
              onChange={handleLockerChange}
              aria-label="Locker Number"
            />
            <div className="select-icon">
              <LockerIcon />
            </div>
          </div>
          {errors.lockerNumber && (
            <p className="error-message" aria-live="polite">
              {errors.lockerNumber}
            </p>
          )}

          {/* OTP Input */}
          <div className="pin-container">
            {formData.pin.map((digit, index) => (
              <input
                key={index}
                type="text"
                className="pin-input"
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
          {errors.pin && (
            <p className="error-message" aria-live="polite">
              {errors.pin}
            </p>
          )}

          {/* Action Buttons */}
          <div className="action-button">
            <Button
              type="secondary"
              onClick={onClose}
              disabled={status === 'loading'}
            >
              CANCEL
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={status === 'loading'}
            >
              CONFIRM
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiveForm;