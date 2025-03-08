// src/components/EmailStep.jsx
import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

const EmailStep = ({ onNext, initialData }) => {
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
      <Button type="primary" onClick={handleSubmit}>
        CONTINUE
      </Button>
    </>
  );
};

export default EmailStep;