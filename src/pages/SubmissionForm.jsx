// SubmissionForm.jsx
import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import loadingAnimationData from '../assets/LoadingAnimation.json'; // Adjust path as needed
import Input from '../pages/components/Input';
import Button from '../pages/components/Button';
import SelectRecipient from './SelectRecipient';
import SelectLocker from './SelectLocker';
import { validateEmail, validateRequired, validateLockerNumber } from '../utils/validators';

// Send Mail SVG Icon (Envelope)
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

// Locker SVG Icon
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

// Loading Animation Component using Lottie with imported JSON
const LoadingIcon = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return <Lottie options={defaultOptions} height={250} width={250} />;
};

// Success SVG Icon (Green Checkmark)
const SuccessIcon = () => (
  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Failure SVG Icon (Red Circle with X)
const FailureIcon = () => (
  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="red" strokeWidth="3" />
    <path d="M8 8L16 16M16 8L8 16" stroke="red" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const SubmissionForm = ({ onNext, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    recipientEmail: initialData.recipientEmail || '',
    note: initialData.note || '',
    lockerNumber: initialData.lockerNumber || '',
  });
  const [errors, setErrors] = useState({
    recipientEmail: '',
    note: '',
    lockerNumber: '',
    general: '',
  });
  const [view, setView] = useState('form');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'loading', 'success', 'failure'
  const [submissionError, setSubmissionError] = useState('');

  useEffect(() => {
    if (view === 'form') {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: 'instant' });
      }, 0);
    }
  }, [view]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleFieldUpdate = (newData) => {
    setFormData((prev) => ({
      ...prev,
      lockerNumber: newData.lockerNumber || prev.lockerNumber,
      recipientEmail: newData.recipientEmail || prev.recipientEmail,
    }));
    setView('form');
  };

  const handleViewChange = (newView) => {
    if (view === 'form') {
      setScrollPosition(window.scrollY);
    }
    setView(newView);
  };

  const validateForm = () => {
    const newErrors = {
      recipientEmail: validateEmail(formData.recipientEmail).error,
      note: validateRequired(formData.note, 'Note').error,
      lockerNumber: validateLockerNumber(formData.lockerNumber).error,
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmissionStatus('loading');
    try {
      const submissionData = {
        email: initialData.email || '',
        recipientEmail: formData.recipientEmail,
        note: formData.note,
        lockerNumber: formData.lockerNumber,
        date_received: null,
      };

      const response = await fetch('http://localhost:5000/api/activitylogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const savedData = await response.json();
        setSubmissionStatus('success');
        setTimeout(() => {
          onNext({ ...formData, activity_log_id: savedData.id });
        }, 10000);
      } else {
        const errorData = await response.json();
        setSubmissionStatus('failure');
        setSubmissionError(errorData.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus('failure');
      setSubmissionError('Network error occurred');
    }
  };

  const styles = `
    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      height: var(--global-input-height);
      margin: 10px 0;
      border: 1px solid ${errors.recipientEmail || errors.lockerNumber ? 'var(--color-error)' : 'var(--elevation-3)'};
      border-radius: var(--global-border-radius);
      background-color: var(--elevation-1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: border-color 0.3s ease;
    }
    .input-wrapper:focus-within {
      border-color: ${errors.recipientEmail || errors.lockerNumber ? 'var(--color-error)' : 'var(--color-primary)'};
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
      border-radius: var(--global-border-radius) 0 0 var(--global-border-radius);
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
    .textarea-note {
      width: 100%;
      min-height: 400px;
      padding: 30px;
      padding-top: 53px;
      padding-bottom: 0px;
      margin: 10px 0;
      font-size: var(--font-size-2);
      font-family: inherit;
      font-weight: normal;
      color: var(--color-muted-dark);
      background-color: var(--elevation-1);
      border: 1px solid ${errors.note ? 'var(--color-error)' : 'var(--elevation-3)'};
      border-radius: var(--global-border-radius);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      resize: vertical;
      outline: none;
      transition: border-color 0.3s ease;
      text-align: left;
      line-height: normal;
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
      z-index: 1000;
      text-align: center;
      box-sizing: border-box;
    }
    .status-container.loading h2 {
      margin: 40px 0;
      font-size: 48px;
      color: #333;
    }
    .status-container.loading p {
      font-size: 32px;
      color: #666;
      line-height: 1.5;
    }
    .status-container:not(.loading) h2 {
      margin: 30px 0;
      font-size: 36px;
      color: #333;
    }
    .status-container:not(.loading) p {
      font-size: 24px;
      color: #666;
      line-height: 1.5;
    }
  `;

  if (submissionStatus === 'loading') {
    return (
      <div className="status-container loading">
        <style>{styles}</style>
        <LoadingIcon />
        <h2>Processing Your Submission</h2>
        <p>Organizing your documents...</p>
      </div>
    );
  }

  if (submissionStatus === 'success') {
    return (
      <div className="status-container loading">
        <style>{styles}</style>
        <SuccessIcon />
        <h2>Successful Submission</h2>
        <p>Please put your documents inside the assigned locker. I hope the recipient doesn’t get angry after reading them シ</p>
      </div>
    );
  }

  if (submissionStatus === 'failure') {
    return (
      <div className="status-container loading">
        <style>{styles}</style>
        <FailureIcon />
        <h2>Failed Submission</h2>
        <p>There is an error with your submission, please resubmit or call for assistance.</p>
        {submissionError && <p>{submissionError}</p>}
      </div>
    );
  }

  if (view === 'recipient') {
    return <SelectRecipient onSelect={handleFieldUpdate} onBack={() => handleViewChange('form')} />;
  }
  if (view === 'locker') {
    return <SelectLocker onSelect={handleFieldUpdate} onBack={() => handleViewChange('form')} />;
  }

  return (
    <>
      <style>{styles}</style>
      <h2>Submission Form</h2>
      <p style={{ marginBottom: '10px' }}>
        Please fill up the form below to proceed.
      </p>
      <div className="input-wrapper" tabIndex={0}>
        <Input
          placeholder="Recipient Email Address"
          value={formData.recipientEmail}
          onChange={handleChange('recipientEmail')}
          emailError={errors.recipientEmail}
          className="input-field"
        />
        <div className="select-icon" title="Select Recipient" onClick={() => handleViewChange('recipient')}>
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
        />
        <div className="select-icon" title="Select Locker" onClick={() => handleViewChange('locker')}>
          <LockerIcon />
        </div>
      </div>
      {errors.lockerNumber && <p className="error-message" aria-live="polite">{errors.lockerNumber}</p>}

      <textarea
        className="textarea-note"
        placeholder="Note"
        value={formData.note}
        onChange={handleChange('note')}
        aria-invalid={!!errors.note}
        aria-describedby={errors.note ? 'note-error' : undefined}
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