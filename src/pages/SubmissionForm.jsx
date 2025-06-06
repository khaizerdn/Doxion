import React, { useState, useEffect, useCallback } from 'react';
import Lottie from 'react-lottie';
import loadingAnimationData from '../assets/LoadingAnimation.json';
import Input from '../pages/components/Input';
import Button from '../pages/components/Button';
import SelectRecipient from './SelectRecipient';
import SelectLocker from './SelectLocker';
import SelectDocumentType from './SelecDocumentType';
import { validateRequired, validateLockerNumber } from '../utils/validators';
import { syncLeds } from '../utils/ledSync';

// SVG Icons
const SendMailIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 5H21C21.5523 5 22 5.44772 22 6V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V6C2 5.44772 2.44772 5 3 5Z"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 6L12 13L22 6"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 2H17C18.1046 2 19 2.89543 19 4V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4C5 2.89543 5.89543 2 7 2Z"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15C13.1046 15 14 14.1046 14 13C14 11.8954 13.1046 11 12 11C10.8954 11 10 11.8954 10 13C10 14.1046 10.8954 15 12 15Z"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15V18"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LoadingIcon = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return <Lottie options={defaultOptions} height={250} width={250} />;
};

const SuccessIcon = () => (
  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FailureIcon = () => (
  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="red" strokeWidth="3" />
    <path d="M8 8L16 16M16 8L8 16" stroke="red" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Randomized success messages
const getRandomSuccessMessage = (lockerNumber) => {
  const messages = [
    `You can now put your document in locker ${lockerNumber}! I hope the recipient doesn't get angry after reading it... 😨`,
    `You can now put your document in locker ${lockerNumber}! Wishing the recipient doesn’t feel sad after reading it... 😢`,
    `You can now put your document in locker ${lockerNumber}! I think the recipient will be surprised after reading it 😉`,
    `You can now put your document in locker ${lockerNumber}! I think the recipient will laugh out loud reading it 😂`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

const SubmissionForm = ({ onNext, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    recipientEmail: initialData.recipientEmail || '',
    note: initialData.note || '',
    lockerNumber: initialData.lockerNumber || '',
    documentType: initialData.documentType || '',
  });
  const [errors, setErrors] = useState({
    recipientEmail: '',
    note: '',
    lockerNumber: '',
    documentType: '',
    general: '',
  });
  const [view, setView] = useState('form');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState('idle');

  const handleChange = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  const handleFieldUpdate = useCallback((newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
    setErrors((prev) => ({
      ...prev,
      ...Object.keys(newData).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {}),
    }));
    setView('form');
  }, []);

  const handleViewChange = useCallback((newView) => {
    if (view === 'form') setScrollPosition(window.scrollY);
    setView(newView);
  }, [view]);

  useEffect(() => {
    if (view === 'form') {
      window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    }
  }, [view, scrollPosition]);

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const newErrors = {
      recipientEmail: !formData.recipientEmail
        ? 'Email is required'
        : !emailRegex.test(formData.recipientEmail)
        ? 'Please enter a valid email address'
        : '',
      note: validateRequired(formData.note, 'Note').error,
      lockerNumber: validateLockerNumber(formData.lockerNumber).error,
      documentType: !formData.documentType ? 'Document type is required' : '',
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => !error);
  };

  const triggerLockerAndLed = async (ipAddress, lock, led, skipLock = false) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/trigger-esp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_address: ipAddress, lock, led, skipLock }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to trigger ESP at ${ipAddress}`);
      }

      console.log(`Successfully ${skipLock ? 'skipped lock and' : ''} triggered ${lock} and set ${led} at ${ipAddress}`);
    } catch (error) {
      console.error('Error triggering locker/LED:', error);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmissionStatus('loading');
    try {
      const lockerResponse = await fetch('http://127.0.0.1:5000/api/lockers');
      if (!lockerResponse.ok) throw new Error('Failed to fetch lockers');
      const lockers = await lockerResponse.json();
      
      const selectedLocker = lockers.find((locker) => locker.number === formData.lockerNumber);
      if (!selectedLocker) {
        throw new Error(`Locker ${formData.lockerNumber} not found`);
      }

      const submissionData = {
        email: initialData.email || '',
        recipientEmail: formData.recipientEmail,
        note: formData.note,
        lockerNumber: formData.lockerNumber,
        documentType: formData.documentType,
        date_received: null,
      };

      const activityResponse = await fetch('http://127.0.0.1:5000/api/activitylogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!activityResponse.ok) {
        const errorData = await activityResponse.json();
        throw new Error(errorData.error || 'Failed to submit activity log');
      }

      const savedData = await activityResponse.json();

      setSubmissionStatus('success');

      const { ip_address, locks, leds } = selectedLocker;
      if (ip_address && leds) {
        triggerLockerAndLed(ip_address, locks, leds, savedData.skipTrigger)
          .then(() => new Promise((resolve) => setTimeout(resolve, 5000)))
          .then(() => syncLeds())
          .catch((error) => console.error('Background LED/sync error:', error));
      }

      setTimeout(() => onNext({ ...formData, activity_log_id: savedData.id }), 10000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus('failure');
    }
  };

  const styles = `
    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      height: var(--global-input-height);
      margin: 10px 0;
      border: 1px solid ${
        errors.recipientEmail || errors.lockerNumber || errors.documentType ? 'var(--color-error)' : 'var(--elevation-3)'
      };
      border-radius: var(--global-border-radius);
      background-color: var(--elevation-1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: border-color 0.3s ease;
    }
    .input-wrapper:focus-within {
      border-color: ${
        errors.recipientEmail || errors.lockerNumber || errors.documentType ? 'var(--color-error)' : 'var(--color-primary)'
      };
    }
    .input-wrapper .input-field {
      flex: 1;
      height: var(--global-input-height);
      padding: 30px;
      font-size: var(--font-size-2);
      color: var(--color-muted-dark);
      background: transparent;
      border: none;
      outline: none;
    }
    .input-wrapper .select-icon {
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
    }
    .input-wrapper .select-icon:hover {
      background-color: var(--elevation-2);
    }
    .select-button {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: var(--global-input-height);
      margin: 10px 0;
      background-color: var(--elevation-1);
      border: 1px solid var(--elevation-3);
      border-radius: var(--global-border-radius);
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.3s ease;
      padding: 30px;
      font-size: var(--font-size-2);
      color: #DADBDA;
    }
    .select-button.selected {
      color: var(--color-muted-dark);
    }
    .select-button.error {
      border-color: var(--color-error);
    }
    .select-button:focus:not(.error) {
      border-color: var(--color-primary);
    }
    .select-button:hover {
      background-color: var(--elevation-2);
    }
    .textarea-note {
      width: 100%;
      min-height: 400px;
      padding: 30px 30px 0;
      margin: 10px 0;
      font-size: var(--font-size-2);
      font-family: inherit;
      color: var(--color-muted-dark);
      background-color: var(--elevation-1);
      border: 1px solid ${errors.note ? 'var(--color-error)' : 'var(--elevation-3)'};
      border-radius: var(--global-border-radius);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      resize: vertical;
      outline: none;
      transition: border-color 0.3s ease;
      text-align: left;
      lineHeight: normal;
      box-sizing: border-box;
    }
    .textarea-note:focus {
      border-color: ${errors.note ? 'var(--color-error)' : 'var(--color-primary)'};
    }
    .textarea-note::placeholder {
      color: var(--color-muted-light);
    }
    .status-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
    }
    .status-container.loading h2 {
      margin: 40px 0;
      font-size: var(--font-size-3);
      color: #333;
    }
    .status-container.loading p {
      font-size: var(--font-size-4);
      color: #666;
      line-height: 1.5;
      max-width: 900px;
    }
    .status-container:not(.loading) h2 {
      margin: 30px 0;
      font-size: var(--font-size-3);
      color: #333;
    }
    .status-container:not(.loading) p {
      font-size: var(--font-size-4);
      color: #666;
      line-height: 1.5;
    }
    .error-message {
      color: var(--color-error);
      font-size: var(--font-size-5);
      margin: 5px 0;
    }
  `;

  if (submissionStatus === 'loading') {
    return (
      <div className="status-container loading">
        <style>{styles}</style>
        <LoadingIcon />
        <h2>Processing Submission</h2>
        <p>Organizing your documents and searching for locker...</p>
      </div>
    );
  }

  if (submissionStatus === 'success') {
    return (
      <div className="status-container">
        <style>{styles}</style>
        <SuccessIcon />
        <h2>Insert Document in Locker {formData.lockerNumber}</h2>
        <p>{getRandomSuccessMessage(formData.lockerNumber)}</p>
      </div>
    );
  }

  if (submissionStatus === 'failure') {
    return (
      <div className="status-container">
        <style>{styles}</style>
        <FailureIcon />
        <h2>Failed Submission</h2>
        <p>There is an error with your submission, please resubmit or call for assistance.</p>
      </div>
    );
  }

  if (view === 'recipient') {
    return <SelectRecipient onSelect={handleFieldUpdate} onBack={() => handleViewChange('form')} />;
  }
  if (view === 'locker') {
    return <SelectLocker onSelect={handleFieldUpdate} onBack={() => handleViewChange('form')} />;
  }
  if (view === 'documentType') {
    return <SelectDocumentType onSelect={handleFieldUpdate} onBack={() => handleViewChange('form')} />;
  }

  return (
    <>
      <style>{styles}</style>
      <h2>Submission Form</h2>
      <p style={{ marginBottom: '10px' }}>Please fill up the form below to proceed.</p>
      <div className="input-wrapper" tabIndex={0}>
        <Input
          placeholder="Recipient Email Address"
          value={formData.recipientEmail}
          onChange={handleChange('recipientEmail')}
          emailError={errors.recipientEmail}
          className="input-field"
          aria-label="Recipient Email Address"
        />
        <div
          className="select-icon"
          title="Select Recipient"
          onClick={() => handleViewChange('recipient')}
          role="button"
          aria-label="Select Recipient"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleViewChange('recipient')}
        >
          <SendMailIcon />
        </div>
      </div>
      {errors.recipientEmail && <p className="error-message" aria-live="polite">{errors.recipientEmail}</p>}

      <div className="input-wrapper" tabIndex={0}>
        <Input
          placeholder="Locker Number"
          value={formData.lockerNumber}
          onChange={handleChange('lockerNumber')}
          emailError={errors.lockerNumber}
          className="input-field"
          aria-label="Locker Number"
        />
        <div
          className="select-icon"
          title="Select Locker"
          onClick={() => handleViewChange('locker')}
          role="button"
          aria-label="Select Locker"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleViewChange('locker')}
        >
          <LockerIcon />
        </div>
      </div>
      {errors.lockerNumber && <p className="error-message" aria-live="polite">{errors.lockerNumber}</p>}

      <div
        className={`select-button ${formData.documentType ? 'selected' : ''} ${errors.documentType ? 'error' : ''}`}
        onClick={() => handleViewChange('documentType')}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleViewChange('documentType')}
      >
        {formData.documentType || 'Select Document Type'}
      </div>
      {errors.documentType && <p className="error-message" aria-live="polite">{errors.documentType}</p>}

      <textarea
        className="textarea-note"
        placeholder="Note"
        value={formData.note}
        onChange={handleChange('note')}
        aria-invalid={!!errors.note}
        aria-describedby={errors.note ? 'note-error' : undefined}
        aria-label="Note"
      />
      {errors.note && <p id="note-error" className="error-message" aria-live="polite">{errors.note}</p>}

      {errors.general && <p className="error-message" aria-live="polite">{errors.general}</p>}

      <div className="action-button">
        <Button type="secondary" onClick={onClose} disabled={submissionStatus !== 'idle'}>
          CANCEL
        </Button>
        <Button type="primary" onClick={handleSubmit} disabled={submissionStatus !== 'idle'}>
          SUBMIT
        </Button>
      </div>
    </>
  );
};

export default SubmissionForm;