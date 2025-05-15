import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './components/Button';
import Input from './components/Input';
import Lottie from 'react-lottie-player';
import searchDocuAnimationData from '../assets/SearchDocuAnimation.json';
import BackButton from './components/BackButton';

// Success SVG Icon
const SuccessIcon = () => (
    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Loading Icon Component with Error Handling
const LoadingIcon = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: searchDocuAnimationData || null,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    if (!defaultOptions.animationData) {
        console.error('LoadingIcon: animationData is undefined or invalid');
        return <div>Loading animation failed...</div>;
    }

    return <Lottie loop autoplay animationData={searchDocuAnimationData} style={{ height: 250, width: 250 }} />;
};

// Randomized success messages
const getRandomSuccessMessage = (email) => {
    const messages = [
        `Admin settings for ${email} saved successfully! Time to celebrate... 🎉`,
        `Admin settings for ${email} updated! Hope it doesn’t confuse anyone... 😅`,
        `Admin settings for ${email} are set! Ready to rule the system... 😎`,
        `Admin settings for ${email} saved! Maybe a coffee break now? ☕`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

const EnterAdminOTP = ({ onNext, onClose, error }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState(error || '');
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
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
        if (value && index < 5) inputRefs.current[index + 1].focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
            setOtpError('Please enter a valid 6-digit OTP');
            return;
        }
        if (timeLeft <= 0) {
            setOtpError('OTP has expired');
            return;
        }
        onNext({ otp: enteredOtp });
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setResendCooldown(60);
        setTimeLeft(120);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');

        try {
            const response = await fetch('http://localhost:5000/api/admin/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to resend OTP');
            }
        } catch (error) {
            setOtpError(error.message);
        }
    };

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <h2>Verification</h2>
                <p>
                    Please enter the OTP sent to the current admin's email.
                    <button
                        className={`resend-button ${resendCooldown > 0 ? 'disabled' : ''}`}
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
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
                {otpError && <p className="error-message">{otpError}</p>}
                <div className="action-button">
                    <Button type="secondary" onClick={onClose}>CANCEL</Button>
                    <Button type="primary" onClick={handleSubmit}>VERIFY</Button>
                </div>
            </div>
        </div>
    );
};

const AdminSettings = () => {
    const [step, setStep] = useState('input');
    const [formData, setFormData] = useState({
        email: '',
        pin: ['', '', '', '', '', ''],
    });
    const [errors, setErrors] = useState({
        email: '',
        pin: '',
        otp: '',
    });
    const [status, setStatus] = useState('idle');
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (step === 'input') {
            inputRefs.current[0]?.focus();
        }
    }, [step]);

    useEffect(() => {
        if (step === 'success') {
            const timer = setTimeout(() => {
                navigate('/adminpanel');
            }, 3000); // 3 seconds delay to show success message
            return () => clearTimeout(timer);
        }
    }, [step, navigate]);

    const handleEmailChange = useCallback((e) => {
        setFormData((prev) => ({ ...prev, email: e.target.value }));
        setErrors((prev) => ({ ...prev, email: '' }));
    }, []);

    const handlePinChange = useCallback((index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newPin = [...formData.pin];
        newPin[index] = value;
        setFormData((prev) => ({ ...prev, pin: newPin }));
        setErrors((prev) => ({ ...prev, pin: '' }));
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }, [formData.pin]);

    const handleKeyDown = useCallback((index, e) => {
        if (e.key === 'Backspace' && !formData.pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }, [formData.pin]);

    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }
        const pinString = formData.pin.join('');
        if (pinString.length !== 6 || !/^\d{6}$/.test(pinString)) {
            newErrors.pin = 'Please enter a valid 6-digit PIN';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) return;

        setStatus('loading');
        try {
            const submissionData = {
                email: formData.email.trim(),
                pin: formData.pin.join(''),
            };

            const response = await fetch('http://localhost:5000/api/admin/request-set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();
            if (!response.ok) {
                setErrors((prev) => ({ ...prev, pin: data.error || 'Failed to request settings change' }));
                setStatus('idle');
                return;
            }

            if (data.otpRequired) {
                setStep('otp');
            } else {
                setStep('success');
            }
            setStatus('idle');
        } catch (error) {
            setErrors((prev) => ({ ...prev, pin: error.message || 'An error occurred. Please try again.' }));
            setStatus('idle');
        }
    }, [formData, validateForm]);

    const handleOtpSubmit = useCallback(async (enteredOtp) => {
        setStatus('loading');
        try {
            const response = await fetch('http://localhost:5000/api/admin/verify-set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: enteredOtp }),
            });

            const data = await response.json();
            if (!response.ok) {
                setErrors((prev) => ({ ...prev, otp: data.error || 'Invalid OTP' }));
                setStatus('idle');
                return;
            }

            setStep('success');
            setStatus('idle');
        } catch (error) {
            setErrors((prev) => ({ ...prev, otp: error.message || 'An error occurred. Please try again.' }));
            setStatus('idle');
        }
    }, []);

    const handleBack = useCallback(() => {
        if (step === 'otp') {
            setStep('input');
            setErrors((prev) => ({ ...prev, otp: '' }));
        } else {
            window.history.back();
        }
    }, [step]);

    const styles = `
        .input-wrapper {
            display: flex;
            align-items: center;
            width: 100%;
            height: var(--global-input-height);
            margin: 10px 0;
            border: 1px solid ${errors.email ? 'var(--color-error)' : 'var(--elevation-3)'};
            border-radius: var(--global-border-radius);
            background-color: var(--elevation-1);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: border-color 0.3s ease;
            overflow: hidden;
        }
        .input-wrapper:focus-within {
            border-color: ${errors.email ? 'var(--color-error)' : 'var(--color-primary)'};
        }
        .input-field {
            flex: 1;
            height: 100%;
            padding: 30px;
            font-size: var(--font-size-2);
            color: var(--color-muted-dark);
            background: transparent;
            border: none;
            outline: none;
        }
        .pin-container {
            display: flex;
            gap: 10px;
            margin: 10px 0;
            justify-content: space-between;
        }
        .pin-input {
            width: 100px;
            height: 100px;
            text-align: center;
            font-size: var(--font-size-3);
            color: var(--color-muted-dark);
            background-color: var(--elevation-1);
            border: 1px solid ${errors.pin ? 'var(--color-error)' : 'var(--elevation-3)'};
            border-radius: var(--global-border-radius);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: border-color 0.3s ease;
        }
        .pin-input:focus {
            outline: none;
            border-color: ${errors.pin ? 'var(--color-error)' : 'var(--color-primary)'};
        }
        .otp-container { 
            display: flex; 
            gap: 10px;
            justify-content: space-between; 
            align-items: center; 
            width: 100%;
            height: var(--global-input-height);
        }
        .otp-input { 
            width: 100px; 
            height: 100px; 
            text-align: center; 
            font-size: var(--font-size-3); 
            color: var(--color-muted-dark); 
            background-color: var(--elevation-1); 
            border: 1px solid ${errors.otp ? 'var(--color-error)' : 'var(--elevation-3)'};
            border-radius: var(--global-border-radius); 
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
            transition: border-color 0.3s ease; 
        }
        .otp-input-group {
            display: flex;
            gap: 10px;
            flex: 1;
        }
        .otp-input:focus { 
            outline: none; 
            border-color: ${errors.otp ? 'var(--color-error)' : 'var(--color-primary)'};
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
            margin: 10px 0;
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
        .action-button {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            width: 100%;
            gap: 10px;
        }
        .status-container {
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.95);
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }
        .status-container h2 {
            margin: 30px 0;
            font-size: var(--font-size-3);
            color: #333;
        }
        .status-container p {
            font-size: var(--font-size-4);
            color: #666;
            line-height: 1.5;
            max-width: 900px;
        }
        .error-message {
            color: var(--color-error);
            font-size: var(--font-size-5);
            margin: 5px 0;
        }
        .header-section {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 20px;
            gap: 16px;
        }
    `;

    return (
        <div className="main-container-two">
            <style>{styles}</style>
            {status === 'loading' ? (
                <div className="status-container">
                    <LoadingIcon />
                    <h2>Processing Admin Settings</h2>
                    <p>Saving your admin details...</p>
                </div>
            ) : step === 'success' ? (
                <div className="status-container">
                    <SuccessIcon />
                    <h2>Settings Saved</h2>
                    <p>{getRandomSuccessMessage(formData.email)}</p>
                </div>
            ) : step === 'otp' ? (
                <EnterAdminOTP
                    onNext={(data) => handleOtpSubmit(data.otp)}
                    onClose={handleBack}
                    error={errors.otp}
                />
            ) : (
                <div className="content-wrapper">
                    <div className="header-section">
                        <BackButton onClick={handleBack} />
                        <h2>Set Admin</h2>
                    </div>
                    <p style={{ marginBottom: '10px' }}>
                        Please enter the admin email and 6-digit PIN below.
                    </p>

                    <div className="input-wrapper">
                        <Input
                            className="input-field"
                            placeholder="Admin Email"
                            value={formData.email}
                            onChange={handleEmailChange}
                            aria-label="Admin Email"
                        />
                    </div>
                    {errors.email && (
                        <p className="error-message" aria-live="polite">
                            {errors.email}
                        </p>
                    )}

                    <div className="pin-container">
                        {formData.pin.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                className="pin-input"
                                value={digit}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                ref={(el) => (inputRefs.current[index] = el)}
                                aria-label={`PIN digit ${index + 1}`}
                            />
                        ))}
                    </div>
                    {errors.pin && (
                        <p className="error-message" aria-live="polite">
                            {errors.pin}
                        </p>
                    )}

                    <div className="action-button">
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            disabled={status === 'loading'}
                        >
                            CONFIRM
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;