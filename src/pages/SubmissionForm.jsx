// src/pages/SubmissionForm.jsx
import React, { useState } from 'react';
import Input from '../pages/components/Input';
import Button from '../pages/components/Button';
import { validateEmail, validateRequired, validateLockerNumber } from '../utils/validators';

const SubmissionForm = ({ onNext, onClose, initialData }) => {
    // Initialize state for all form fields
    const [formData, setFormData] = useState({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        recipientEmail: initialData.recipientEmail || '',
        note: initialData.note || '',
        lockerNumber: initialData.lockerNumber || ''
    });
    
    // State for errors
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        recipientEmail: '',
        note: '',
        lockerNumber: ''
    });

    // Handle input changes
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

    const validateForm = () => {
        const newErrors = {};
        
        const firstNameValidation = validateRequired(formData.firstName, 'First Name');
        newErrors.firstName = firstNameValidation.error;
        
        const lastNameValidation = validateRequired(formData.lastName, 'Last Name');
        newErrors.lastName = lastNameValidation.error;
        
        const emailValidation = validateEmail(formData.recipientEmail);
        newErrors.recipientEmail = emailValidation.error;
        
        const noteValidation = validateRequired(formData.note, 'Note');
        newErrors.note = noteValidation.error;
        
        const lockerValidation = validateLockerNumber(formData.lockerNumber);
        newErrors.lockerNumber = lockerValidation.error;

        setErrors(newErrors);
        
        // Return true if all validations pass
        return Object.values(newErrors).every(error => !error);
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        // If validation passes, proceed to next step
        onNext(formData);
    };

    return (
        <>
            <h2>SUBMISSION FORM</h2>
            
            <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                emailError={errors.firstName}
            />
            {errors.firstName && (
                <p className="error-message" aria-live="polite">
                    {errors.firstName}
                </p>
            )}

            <Input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                emailError={errors.lastName}
            />
            {errors.lastName && (
                <p className="error-message" aria-live="polite">
                    {errors.lastName}
                </p>
            )}

            <Input
                placeholder="Recipient Email Address"
                value={formData.recipientEmail}
                onChange={handleChange('recipientEmail')}
                emailError={errors.recipientEmail}
            />
            {errors.recipientEmail && (
                <p className="error-message" aria-live="polite">
                    {errors.recipientEmail}
                </p>
            )}

            <Input
                placeholder="Note"
                value={formData.note}
                onChange={handleChange('note')}
                emailError={errors.note}
            />
            {errors.note && (
                <p className="error-message" aria-live="polite">
                    {errors.note}
                </p>
            )}

            <Input
                placeholder="Locker Number"
                value={formData.lockerNumber}
                onChange={handleChange('lockerNumber')}
                emailError={errors.lockerNumber}
            />
            {errors.lockerNumber && (
                <p className="error-message" aria-live="polite">
                    {errors.lockerNumber}
                </p>
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