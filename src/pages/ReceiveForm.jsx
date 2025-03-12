import React, { useState, useRef, useEffect } from 'react';
import Button from './components/Button';
import Input from './components/Input';

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

const ReceiveForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    lockerNumber: '',
    pin: ['', '', '', '', '', ''], // Array for 6-digit PIN
  });
  const [errors, setErrors] = useState({
    lockerNumber: '',
    pin: '',
  });
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const hasMounted = useRef(false);

  // Focus first PIN input on mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      inputRefs.current[0]?.focus();
    }
  }, []);

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
      overflow: hidden; /* Ensures content respects border-radius */
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
      border-radius: var(--global-border-radius) 0 0 var(--global-border-radius); /* Matches SubmissionForm */
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
      transition: background-color 0.2s ease;
      border-radius: 0 var(--global-border-radius) var(--global-border-radius) 0; /* Adds right-side radius */
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
      newErrors.pin = 'Please enter a valid 6-digit PIN';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submissionData = {
        lockerNumber: formData.lockerNumber,
        pin: formData.pin.join(''),
      };

      const response = await fetch('http://localhost:5000/api/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to verify receive request');
      }

      console.log('Receive request successful:', submissionData);
      onClose();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        pin: error.message || 'Invalid locker number or PIN',
      }));
      console.error('Receive error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="main-container">
        <div className="content-wrapper">
          <p style={{ fontSize: 'var(--font-size-5)' }}>
            Receive (Step 1 of 1)
          </p>
          
          <h2>Receive Documents</h2>
          
          <p style={{ marginBottom: '10px' }}>
            Please enter your locker number and 6-digit PIN below.
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

          {/* PIN/OTP Input */}
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
                aria-label={`PIN digit ${index + 1}`}
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
              disabled={loading}
            >
              CANCEL
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'VERIFYING...' : 'CONFIRM'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiveForm;