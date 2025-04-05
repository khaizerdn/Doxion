import React, { useState, useRef, useEffect, useCallback } from 'react';
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong. Please try again.</div>;
        }
        return this.props.children;
    }
}

const AdminSettings = () => {
    const [formData, setFormData] = useState({
        email: '',
        pin: ['', '', '', '', '', ''],
    });
    const [errors, setErrors] = useState({
        email: '',
        pin: '',
    });
    const [status, setStatus] = useState('idle');
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

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

            const response = await fetch('http://localhost:5000/api/admin/set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();
            if (!response.ok) {
                setErrors((prev) => ({ ...prev, pin: data.error || 'Failed to save settings' }));
                setStatus('idle');
                return;
            }

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setFormData({ email: '', pin: ['', '', '', '', '', ''] });
                inputRefs.current[0]?.focus();
            }, 10000);
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                pin: error.message || 'An error occurred. Please try again.',
            }));
            setStatus('idle');
        }
    }, [formData, validateForm]);

    const handleBack = useCallback(() => {
        window.history.back();
    }, []);

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
        .action-button {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            width: 100%;
        }
        .action-button button {
            width: 100%;
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
        <ErrorBoundary>
            <style>{styles}</style>
            {status === 'loading' ? (
                <div className="status-container">
                    <LoadingIcon />
                    <h2>Processing Admin Settings</h2>
                    <p>Saving your admin details...</p>
                </div>
            ) : status === 'success' ? (
                <div className="status-container">
                    <SuccessIcon />
                    <h2>Settings Saved</h2>
                    <p>{getRandomSuccessMessage(formData.email)}</p>
                </div>
            ) : (
                <div className="main-container-two">
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
                </div>
            )}
        </ErrorBoundary>
    );
};

export default AdminSettings;