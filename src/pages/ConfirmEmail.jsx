import React, { useState } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import Keyboard from './components/Keyboard'; // Import the Keyboard component
import { validateEmail } from '../utils/validators';

const ConfirmEmail = ({ onNext, initialData, onClose }) => {
    const [emailLocalPart, setEmailLocalPart] = useState(initialData.email?.replace('@cvsu.edu.ph', '') || '');
    const [emailError, setEmailError] = useState('');
    const [showKeyboard, setShowKeyboard] = useState(false);

    // Full email for validation and submission
    const fullEmail = `${emailLocalPart}@cvsu.edu.ph`;

    const handleSubmit = async () => {
        const validation = validateEmail(fullEmail);
        if (!validation.isValid) {
            setEmailError(validation.error);
            return;
        }

        setEmailError('');
        onNext({ email: fullEmail });

        // Perform background API calls...
    };

    const handleKeyPress = (key) => {
        setEmailLocalPart((prev) => prev + key);
        setEmailError('');
    };

    const handleBackspace = () => {
        setEmailLocalPart((prev) => prev.slice(0, -1));
        setEmailError('');
    };

    const inputStyles = `
        .input-wrapper {
            display: flex;
            align-items: center;
            width: 100%;
            height: var(--global-input-height);
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
            flex: 1 1 60%;
            height: 100%;
            padding: 30px;
            font-size: var(--font-size-2);
            color: var(--color-muted-dark);
            background: transparent;
            border: none;
            outline: none;
        }
        .email-suffix {
            flex: 1 1 40%;
            padding: 30px;
            font-size: var(--font-size-2);
            color: var(--color-muted-dark);
            border-left: 1px solid var(--elevation-3);
            border-top-right-radius: var(--global-border-radius);
            border-bottom-right-radius: var(--global-border-radius);
            user-select: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;

    return (
        <>
            <style>{inputStyles}</style>
            <div style={{ paddingBottom: showKeyboard ? '250px' : '0' }}>
                <h2>Enter Your Email</h2>
                <p style={{ marginBottom: '10px' }}>
                    Please enter your CvSU email address to proceed.
                </p>
                <div
                    className="input-wrapper"
                    tabIndex={0}
                    onClick={() => setShowKeyboard(true)}
                >
                    <Input
                        placeholder="Email"
                        value={emailLocalPart}
                        onChange={(e) => {
                            setEmailLocalPart(e.target.value);
                            setEmailError('');
                        }}
                        emailError={emailError}
                        className="input-field"
                    />
                    <span className="email-suffix">@cvsu.edu.ph</span>
                </div>
                {emailError && (
                    <p className="error-message" aria-live="polite">
                        {emailError}
                    </p>
                )}
                <div className="action-button">
                    <Button type="secondary" onClick={onClose}>CANCEL</Button>
                    <Button type="primary" onClick={handleSubmit}>CONTINUE</Button>
                </div>
            </div>
    
            {showKeyboard && (
                <Keyboard
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
    
};

export default ConfirmEmail;
