import React, { useState } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import { validateEmail } from '../utils/validators';

const ConfirmEmail = ({ onNext, initialData, onClose }) => {
    const [emailLocalPart, setEmailLocalPart] = useState(initialData.email?.replace('@cvsu.edu.ph', '') || ''); // Store only the local part
    const [emailError, setEmailError] = useState('');

    // Full email for validation and submission
    const fullEmail = `${emailLocalPart}@cvsu.edu.ph`;

    const handleSubmit = async () => {
        const validation = validateEmail(fullEmail);
        if (!validation.isValid) {
            setEmailError(validation.error);
            return;
        }

        setEmailError('');

        // Immediately proceed to the next step with the full email
        onNext({ email: fullEmail });

        // Perform API calls in the background
        try {
            // Step 1: Generate flake IDs
            const flakeResponse = await fetch('/api/generate-flake-ids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const flakeData = await flakeResponse.json();
            if (!flakeResponse.ok) {
                throw new Error(flakeData.error || 'Failed to generate IDs');
            }

            const submissionId = flakeData.submission_id;

            // Step 2: Send OTP
            const otpResponse = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: fullEmail }), // Send full email to backend
            });
            const otpData = await otpResponse.json();
            if (!otpResponse.ok) {
                throw new Error(otpData.error || `Failed to send OTP (Status: ${otpResponse.status})`);
            }

            const otp = otpData.otp;

            // Update formData with the results (this won't affect the current step transition)
            onNext({
                email: fullEmail,
                otp,
                submission_id: submissionId
            });
        } catch (error) {
            console.error('Background API Error:', error);
            setEmailError(error.message);
        }
    };

    const inputStyles = `
        .input-wrapper {
            display: flex;
            align-items: center;
            width: 100%;
            height: var(--global-input-height); /* Unchanged height */
            border: 1px solid ${emailError ? 'var(--color-error)' : 'var(--elevation-3)'};
            border-radius: var(--global-border-radius);
            background-color: var(--elevation-1);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: border-color 0.3s ease;
        }
        .input-wrapper:focus-within {
            border-color: ${emailError ? 'var(--color-error)' : 'var(--elevation-3)'};
        }
        .input-wrapper .input-field {
            flex: 1 1 60%; /* Grow and shrink, start at 60% of the container */
            height: 100%;
            padding: 30px;
            font-size: var(--font-size-2); /* Unchanged font size */
            color: var(--color-muted-dark);
            background: transparent;
            border: none;
            outline: none;
        }
        .input-wrapper .input-field::placeholder {
            color: var(--color-muted-light);
        }
        .input-wrapper .input-field:invalid {
            border-color: var(--color-error); /* Fallback for native validation */
        }
        .email-suffix {
            flex: 1 1 40%; /* Grow and shrink, start at 40% of the container */
            padding: 30px;
            font-size: var(--font-size-2); /* Unchanged font size */
            color: var(--color-muted-dark);
            border-left: 1px solid var(--elevation-3);
            border-top-right-radius: var(--global-border-radius);
            border-bottom-right-radius: var(--global-border-radius);
            user-select: none; /* Prevent selection */
            white-space: nowrap; /* Prevent wrapping */
            overflow: hidden; /* Hide overflow */
            text-overflow: ellipsis; /* Add ellipsis when text overflows */
        }
    `;

    return (
        <>
            <style>{inputStyles}</style>
            <h2>Enter Your Email</h2>
            <p style={{ marginBottom: '10px' }}>
                Please enter your CvSU email address to proceed.
            </p>
            <div className="input-wrapper" tabIndex={0}>
                <Input
                    placeholder="Email"
                    value={emailLocalPart}
                    onChange={(e) => {
                        setEmailLocalPart(e.target.value);
                        setEmailError('');
                    }}
                    emailError={emailError}
                    className="input-field" // Apply input-field class for consistency
                />
                <span className="email-suffix">@cvsu.edu.ph</span>
            </div>
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