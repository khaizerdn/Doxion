import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import Lottie from 'react-lottie';
import searchDocuAnimationData from '../assets/SearchDocuAnimation.json';
import SelectUnreceivedLocker from './SelectUnreceivedLocker';
import useKeyboardPadding from '../utils/useKeyboardPadding';
import { syncLeds } from '../utils/ledSync';

// Constants
const API_BASE_URL = 'http://localhost:5000';
const BLINK_DURATION = 5000; // 5 blinks at 500ms on + 500ms off

// Locker SVG Icon
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

// Success SVG Icon
const SuccessIcon = () => (
  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Loading Icon Component
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

// Randomized success messages
const getRandomSuccessMessage = (lockerNumber) => {
  const messages = [
    `You may now retrieve the documents in locker ${lockerNumber}!`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

const ReceiveForm = ({ onClose }) => {
  useKeyboardPadding();

  const [formData, setFormData] = useState({
    lockerNumber: '',
    pin: ['', '', '', '', '', ''],
  });
  const [errors, setErrors] = useState({
    lockerNumber: '',
    pin: '',
  });
  const [status, setStatus] = useState('idle');
  const [showLockerSelect, setShowLockerSelect] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    document.querySelector('.input-field')?.focus();
  }, []);

  const handleLockerChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, lockerNumber: e.target.value }));
    setErrors((prev) => ({ ...prev, lockerNumber: '' }));
  }, []);

  const handleLockerSelect = useCallback((data) => {
    setFormData((prev) => ({ ...prev, lockerNumber: data.lockerNumber }));
    setShowLockerSelect(false);
  }, []);

  const handleBack = useCallback(() => {
    setShowLockerSelect(false);
  }, []);

  const handlePinChange = useCallback((index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newPin = [...formData.pin];
    newPin[index] = value;
    setFormData((prev) => ({ ...prev, pin: newPin }));
    setErrors((prev) => ({ ...prev, pin: '' }));
    if (value && index < 5) inputRefs.current[index + 1].focus();
  }, [formData.pin]);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !formData.pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }, [formData.pin]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.lockerNumber.trim()) newErrors.lockerNumber = 'Locker number is required';
    const pinString = formData.pin.join('');
    if (pinString.length !== 6 || !/^\d{6}$/.test(pinString))
      newErrors.pin = 'Please enter a valid 6-digit OTP or PIN';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerLockerAndLed = async (ipAddress, lock, led) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trigger-esp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_address: ipAddress, lock, led }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to trigger ESP at ${ipAddress}`);
      }

      console.log(`Successfully triggered ${lock} and turned off ${led} at ${ipAddress}`);
    } catch (error) {
      console.error('Error triggering locker/LED:', error);
      // Do not throw; allow UI to remain in success state
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setStatus('loading');
    try {
      // Step 1: Validate OTP and update activity log
      const submissionData = {
        lockerNumber: formData.lockerNumber,
        otp: formData.pin.join(''),
      };

      const receiveResponse = await fetch(`${API_BASE_URL}/api/receive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!receiveResponse.ok) {
        const errorData = await receiveResponse.json();
        setErrors((prev) => ({ ...prev, pin: errorData.error || 'Invalid locker number or OTP.' }));
        setStatus('idle');
        return;
      }

      await receiveResponse.json();

      // Step 2: Transition to success state immediately
      setStatus('success');

      // Step 3: Fetch locker details and trigger locker/LED in the background
      const lockerResponse = await fetch(`${API_BASE_URL}/api/lockers`);
      if (!lockerResponse.ok) {
        console.error('Failed to fetch lockers:', lockerResponse.status);
        // Log error but do not affect success state
      } else {
        const lockers = await lockerResponse.json();
        const selectedLocker = lockers.find((locker) => locker.number === formData.lockerNumber);
        if (!selectedLocker) {
          console.error(`Locker ${formData.lockerNumber} not found`);
        } else {
          const { ip_address, locks, leds } = selectedLocker;
          if (ip_address && locks && leds) {
            // Trigger locker and LED in the background
            triggerLockerAndLed(ip_address, locks, leds)
              .then(() => new Promise((resolve) => setTimeout(resolve, BLINK_DURATION)))
              .then(() => syncLeds())
              .catch((error) => {
                console.error('Background LED/sync error:', error);
                // Do not affect UI; submission is already successful
              });
          } else {
            console.warn('Locker missing ip_address, locks, or leds; skipping trigger');
          }
        }
      }

      // Step 4: Close form after 10 seconds
      setTimeout(() => onClose(), 15000);
    } catch (error) {
      console.error('Error processing reception:', error);
      setErrors((prev) => ({
        ...prev,
        pin: error.message || 'An error occurred. Please try again.',
      }));
      setStatus('idle');
    }
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
      max-width: 900px;
    }
    .error-message {
      color: var(--color-error);
      font-size: var(--font-size-5);
      margin: 5px 0;
    }
  `;

  useEffect(() => {
    const mainContainer = document.querySelector('.main-container');

    const handleFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        mainContainer.style.paddingBottom = '300px'; // Match keyboard height
      }
    };

    const handleBlur = () => {
      mainContainer.style.paddingBottom = '0px';
    };

    // Check if input is focused on mount
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
      mainContainer.style.paddingBottom = '300px'; // Apply padding immediately
    }

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="status-container">
        <style>{styles}</style>
        <LoadingIcon />
        <h2>Processing Reception</h2>
        <p>Searching your documents and triggering locker...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="status-container">
        <style>{styles}</style>
        <SuccessIcon />
        <h2>Retrieve Document in Locker {formData.lockerNumber}!</h2>
        <p>{getRandomSuccessMessage(formData.lockerNumber)}</p>
      </div>
    );
  }

  if (showLockerSelect) {
    return (
      <SelectUnreceivedLocker
        onSelect={handleLockerSelect}
        onBack={handleBack}
      />
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="main-container">
        <div className="content-wrapper">
          <p style={{ fontSize: 'var(--font-size-5)' }}>Receive (Step 1 of 1)</p>
          <h2>Receive Document</h2>
          <p style={{ marginBottom: '10px' }}>
            Please enter your locker number and 6-digit OTP below.
          </p>

          <div className="input-wrapper">
            <Input
              className="input-field"
              placeholder="Locker Number"
              value={formData.lockerNumber}
              onChange={handleLockerChange}
              aria-label="Locker Number"
            />
            <div
              className="select-icon"
              onClick={() => setShowLockerSelect(true)}
              role="button"
              aria-label="Select unreceived locker"
            >
              <LockerIcon />
            </div>
          </div>
          {errors.lockerNumber && (
            <p className="error-message" aria-live="polite">
              {errors.lockerNumber}
            </p>
          )}

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

          <div className="action-button">
            <Button type="secondary" onClick={onClose} disabled={status === 'loading'}>
              CANCEL
            </Button>
            <Button type="primary" onClick={handleSubmit} disabled={status === 'loading'}>
              CONFIRM
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiveForm;