import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './components/Button';

const EnterAdminPin = ({ onSuccess, onClose }) => {
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [pinError, setPinError] = useState('');
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admin exists on mount
        const checkAdmin = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/verify-pin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pin: '000000' }), // Dummy PIN to trigger noAdmin response
                });
                const data = await response.json();
                if (data.noAdmin) {
                    navigate('/admin-settings');
                } else {
                    inputRefs.current[0]?.focus();
                }
            } catch {
                setPinError('Error checking admin status. Please try again.');
            }
        };
        checkAdmin();
    }, [navigate]);

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        setPinError('');
        if (value && index < 5) inputRefs.current[index + 1].focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async () => {
        const enteredPin = pin.join('');
        if (enteredPin.length !== 6 || !/^\d{6}$/.test(enteredPin)) {
            setPinError('Please enter a valid 6-digit PIN');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/verify-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: enteredPin }),
            });

            const data = await response.json();
            if (!response.ok) {
                if (data.noAdmin) {
                    navigate('/admin-settings');
                    return;
                }
                setPinError(data.error || 'Invalid PIN');
                return;
            }

            setPinError('');
            onSuccess();
        } catch (error) {
            setPinError(error.message || 'An error occurred. Please try again.');
        }
    };

    const styles = `
        .otp-container { 
            display: flex; 
            gap: 10px;
            justify-content: space-between; 
            align-items: center; 
            width: 100%;
            height: var(--global-input-height);
        }
        .otp-input-group {
            display: flex;
            gap: 10px;
            flex: 1;
        }
        .pin-input {
            width: 100px;
            height: 100px;
            text-align: center;
            font-size: var(--font-size-3);
            color: var(--color-muted-dark);
            background-color: var(--elevation-1);
            border: 1px solid ${pinError ? 'var(--color-error)' : 'var(--elevation-3)'};
            border-radius: var(--global-border-radius);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: border-color 0.3s ease;
        }
        .pin-input:focus {
            outline: none;
            border-color: ${pinError ? 'var(--color-error)' : 'var(--color-primary)'};
        }
        .pin-input-error {
            border-color: var(--color-error);
        }
        .action-button {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            width: 100%;
            gap: 10px;
        }
        .error-message {
            color: var(--color-error);
            font-size: var(--font-size-5);
            margin: 5px 0;
        }
    `;

    return (
        <div className="main-container">
            <style>{styles}</style>
            <div className="content-wrapper">
                <div className="header-section">
                    <h2>Admin Verification</h2>
                    <p style={{ marginBottom: '10px' }}>
                        Please enter the 6-digit admin PIN to access the admin panel.
                    </p>
                    <div className="otp-container">
                        <div className="otp-input-group">
                            {pin.map((digit, index) => (
                                <input
                                    key={index}
                                    type="password"
                                    className={`pin-input ${pinError ? 'pin-input-error' : ''}`}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    maxLength={1}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    aria-label={`PIN digit ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    {pinError && (
                        <p className="error-message" aria-live="polite">
                            {pinError}
                        </p>
                    )}
                    <div className="action-button">
                        <Button type="secondary" onClick={onClose}>
                            CANCEL
                        </Button>
                        <Button type="primary" onClick={handleSubmit}>
                            VERIFY
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterAdminPin;