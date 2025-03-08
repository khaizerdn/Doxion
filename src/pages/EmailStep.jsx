// src/components/EmailStep.jsx
import React, { useState } from 'react';
import Input from './components/Input';
import Button from './components/Button';

const EmailStep = ({ onNext, initialData, onClose }) => {
  const [email, setEmail] = useState(initialData.email || '');

  const handleSubmit = () => {
    if (email) {
      onNext({ email });
    }
  };

  return (
    <>
      <h2>ENTER YOUR EMAIL</h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
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

export default EmailStep;