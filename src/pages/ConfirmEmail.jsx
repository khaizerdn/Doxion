import React, { useState } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import { validateEmail } from '../utils/validators';

const ConfirmEmail = ({ onNext, initialData, onClose }) => {
  const [email, setEmail] = useState(initialData.email || '');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = () => {
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.error);
      return;
    }

    setEmailError('');
    sessionStorage.setItem('userEmail', email);
    onNext({ email });
  };

  return (
    <>
      <h2>ENTER YOUR EMAIL</h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError('');
        }}
        emailError={emailError} // Pass emailError as a prop
      />
      {emailError && (
        <p className="error-message" aria-live="polite">
          {emailError}
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

export default ConfirmEmail;