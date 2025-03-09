// src/pages/SubmissionForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../pages/components/Input';
import Button from '../pages/components/Button';
import SelectRecipient from './SelectRecipient';
import SelectLocker from './SelectLocker';
import { validateEmail, validateRequired, validateLockerNumber } from '../utils/validators';

// Send Mail SVG Icon (Envelope)
const SendMailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 5H21C21.5523 5 22 5.44772 22 6V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V6C2 5.44772 2.44772 5 3 5Z" 
      stroke="var(--color-muted-dark)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 6L12 13L22 6" 
      stroke="var(--color-muted-dark)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Locker SVG Icon
const LockerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const SubmissionForm = ({ onNext, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    recipientEmail: initialData.recipientEmail || '',
    note: initialData.note || '',
    lockerNumber: initialData.lockerNumber || ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    recipientEmail: '',
    note: '',
    lockerNumber: ''
  });
  const [view, setView] = useState('form'); // 'form', 'recipient', or 'locker'
  const [scrollPosition, setScrollPosition] = useState(0); // Store scroll position

  // Save scroll position when leaving form, restore when returning
  useEffect(() => {
    if (view === 'form') {
      console.log(`Returning to form, restoring scroll to: ${scrollPosition}`);
      // Delay restoration to ensure DOM is fully rendered
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: 'instant' });
        console.log(`Scroll restored, current scrollY: ${window.scrollY}`);
      }, 0);
    }
  }, [view]); // Only trigger on view change, not scrollPosition

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleFieldUpdate = (newData) => {
    setFormData(prev => ({
      ...prev,
      lockerNumber: newData.lockerNumber || prev.lockerNumber,
      recipientEmail: newData.recipientEmail || prev.recipientEmail
    }));
    setView('form'); // Scroll restoration handled by useEffect
  };

  const handleViewChange = (newView) => {
    if (view === 'form') {
      const currentScroll = window.scrollY;
      console.log(`Leaving form for ${newView}, saving scroll position: ${currentScroll}`);
      setScrollPosition(currentScroll);
    }
    setView(newView);
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.firstName = validateRequired(formData.firstName, 'First Name').error;
    newErrors.lastName = validateRequired(formData.lastName, 'Last Name').error;
    newErrors.recipientEmail = validateEmail(formData.recipientEmail).error;
    newErrors.note = validateRequired(formData.note, 'Note').error;
    newErrors.lockerNumber = validateLockerNumber(formData.lockerNumber).error;

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onNext(formData);
  };

  const inputStyles = `
    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      height: 120px;
      margin: 10px 0;
      border: 1px solid ${errors.recipientEmail || errors.lockerNumber ? 'var(--color-error)' : 'var(--elevation-3)'};
      border-radius: var(--global-border-radius);
      background-color: var(--elevation-1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: border-color 0.3s ease;
    }
    .input-wrapper:focus-within {
      border-color: ${errors.recipientEmail || errors.lockerNumber ? 'var(--color-error)' : 'var(--elevation-3)'};
    }
    .input-wrapper .input-field {
      flex: 1;
      height: 100%;
      padding: 30px;
      font-size: 2rem;
      color: var(--color-muted-dark);
      background: transparent;
      border: none;
      outline: none;
      border-radius: var(--global-border-radius) 0 0 var(--global-border-radius);
    }
    .input-wrapper .select-icon {
      width: 120px;
      height: 100%;
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
  `;

  // Render different views based on state
  if (view === 'recipient') {
    return <SelectRecipient onSelect={handleFieldUpdate} onBack={() => handleViewChange('form')} />;
  }
  if (view === 'locker') {
    return <SelectLocker onSelect={handleFieldUpdate} onBack={() => handleViewChange('form')} />;
  }

  return (
    <>
      <style>{inputStyles}</style>
      <h2>SUBMISSION FORM</h2>
      
      <Input
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange('firstName')}
        emailError={errors.firstName}
      />
      {errors.firstName && (
        <p className="error-message" aria-live="polite">{errors.firstName}</p>
      )}

      <Input
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange('lastName')}
        emailError={errors.lastName}
      />
      {errors.lastName && (
        <p className="error-message" aria-live="polite">{errors.lastName}</p>
      )}

      <div className="input-wrapper" tabIndex={0}>
        <Input
          placeholder="Recipient Email Address"
          value={formData.recipientEmail}
          onChange={handleChange('recipientEmail')}
          emailError={errors.recipientEmail}
          className="input-field"
        />
        <div 
          className="select-icon" 
          title="Select Recipient"
          onClick={() => handleViewChange('recipient')}
        >
          <SendMailIcon />
        </div>
      </div>
      {errors.recipientEmail && (
        <p className="error-message" aria-live="polite">{errors.recipientEmail}</p>
      )}

      <Input
        placeholder="Note"
        value={formData.note}
        onChange={handleChange('note')}
        emailError={errors.note}
      />
      {errors.note && (
        <p className="error-message" aria-live="polite">{errors.note}</p>
      )}

      <div className="input-wrapper" tabIndex={0}>
        <Input
          placeholder="Locker Number"
          value={formData.lockerNumber}
          onChange={handleChange('lockerNumber')}
          emailError={errors.lockerNumber}
          className="input-field"
        />
        <div 
          className="select-icon"
          title="Select Locker"
          onClick={() => handleViewChange('locker')}
        >
          <LockerIcon />
        </div>
      </div>
      {errors.lockerNumber && (
        <p className="error-message" aria-live="polite">{errors.lockerNumber}</p>
      )}

      <div className="action-button">
        <Button type="secondary" onClick={onClose}>
          CANCEL
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </div>
    </>
  );
};

export default SubmissionForm;