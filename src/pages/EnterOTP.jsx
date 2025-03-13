import React, { useState, useRef, useEffect } from 'react';
import Button from './components/Button';
import { config } from '../config.jsx';

const EnterOTP = ({ onNext, onClose, initialData }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [timeLeft, setTimeLeft] = useState(config.otpTimeout / 1000);
    const [resendCooldown, setResendCooldown] = useState(3);
    const inputRefs = useRef([]);
    const hasMounted = useRef(false);

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
        .otp-input { 
            width: 100px; 
            height: 100px; 
            text-align: center; 
            font-size: var(--font-size-3); 
            color: var(--color-muted-dark); 
            background-color: var(--elevation-1); 
            border: 1px solid var(--elevation-3); 
            border-radius: var(--global-border-radius); 
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
            transition: border-color 0.3s ease; 
        }
        .otp-input:focus { 
            outline: none; 
            border-color: var(--elevation-3); 
        }
        .otp-input-error { 
            border-color: var(--color-error); 
        }
        .resend-button {
            height: 50px;
            min-width: 200px;
            font-size: var(--font-size-5);
            padding: 8px 16px;
            color: var(--color-primary-light);
            background-color: var(--color-accent);
            border: none;
            border-radius: 15px;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.3s ease, background-color 0.3s ease;
        }
        .resend-button.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            font-weight: normal;
        }
        .resend-button:not(.disabled):hover {
            opacity: 0.8;
            background-color: var(--color-accent-hover);
        }
    `;

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpError('');

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
            setOtpError('OTP is invalid or has expired');
            return;
        }

        if (!initialData.otp) {
            setOtpError('OTP is still being generated. Please wait.');
            return;
        }

        if (timeLeft <= 0) {
            setOtpError('OTP is invalid or has expired');
            return;
        }

        if (enteredOtp !== initialData.otp) {
            setOtpError('Invalid OTP');
            return;
        }

        setOtpError('');
        onNext({ otp: enteredOtp });
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        console.log('Resending OTP to:', initialData.email);

        if (!initialData.email) {
            setOtpError('No email available for resending OTP');
            return;
        }

        // Start countdown immediately
        setResendCooldown(60);
        setTimeLeft(config.otpTimeout / 1000);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');

        try {
            const response = await fetch('http://localhost:5000/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: initialData.email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to resend OTP');
            }

            const data = await response.json();
            initialData.otp = data.otp;
            initialData.expiration_timestamp = Date.now() + config.otpTimeout;
            console.log('New OTP received:', data.otp);
        } catch (error) {
            setOtpError(error.message);
            console.error('Resend OTP error:', error);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <config.TimerDisplay
                timeLeft={timeLeft}
                label="OTP Expires"
                isVisible={config.showTimers}
                timerType="otp"
            />
            <h2>Verification</h2>
            <p style={{ marginBottom: '10px' }}>
                Please enter the OTP sent to: <br /> {initialData.email || 'email'}.{' '}
                <button
                    className={`resend-button ${resendCooldown > 0 ? 'disabled' : ''}`}
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    aria-disabled={resendCooldown > 0}
                >
                    {resendCooldown > 0 ? `Resend OTP? (${resendCooldown}s)` : 'Resend OTP?'}
                </button>
            </p>
            <div className="otp-container">
                <div className="otp-input-group">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            className={`otp-input ${otpError ? 'otp-input-error' : ''}`}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            maxLength={1}
                            ref={(el) => (inputRefs.current[index] = el)}
                            aria-label={`OTP digit ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            {otpError && (
                <p className="error-message" aria-live="polite">
                    {otpError}
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

export default EnterOTP;