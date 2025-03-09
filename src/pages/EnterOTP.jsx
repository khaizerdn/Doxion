import React, { useState, useRef, useEffect } from 'react';
import Button from './components/Button';
import { config } from '../config.jsx';

const EnterOTP = ({ onNext, onClose, initialData }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [timeLeft, setTimeLeft] = useState(config.otpTimeout / 1000); // Start with configured OTP timeout in seconds
    const inputRefs = useRef([]);

    const styles = `
        .otp-instruction { font-size: 1rem; color: var(--color-muted-dark); margin-bottom: 20px; }
        .otp-container { display: flex; gap: 10px; margin: 10px 0 20px; justify-content: space-between; }
        .otp-input { width: 60px; height: 60px; text-align: center; font-size: 1.5rem; color: var(--color-muted-dark); background-color: var(--elevation-1); border: 1px solid var(--elevation-3); border-radius: var(--global-border-radius); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); transition: border-color 0.3s ease; }
        .otp-input:focus { outline: none; border-color: var(--elevation-3); }
        .otp-input-error { border-color: var(--color-error); }
    `;

    // Start OTP timer immediately when component mounts
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0; // Timer reaches 0 but doesn't set error yet
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, []); // Empty dependency array to run on mount

    const handleChange = (index, value) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setOtpError('');
            if (value && index < 5) inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleSubmit = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
            setOtpError('Please enter a valid 6-digit OTP');
            return;
        }

        if (!initialData.otp) {
            setOtpError('OTP is still being generated. Please wait a moment.');
            return;
        }

        if (timeLeft <= 0) {
            setOtpError('OTP has expired'); // Set error only on submit when timer is 0
            return;
        }

        if (enteredOtp !== initialData.otp) {
            setOtpError('Invalid OTP');
            return;
        }

        setOtpError('');
        onNext({ otp: enteredOtp });
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
            <h2>ENTER YOUR OTP</h2>
            <p className="otp-instruction">
                Please enter the 6-digit OTP sent to your email.
            </p>
            <div className="otp-container">
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