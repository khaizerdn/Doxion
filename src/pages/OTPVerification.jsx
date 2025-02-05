import React, { useState, useEffect } from 'react';
import axios from 'axios';
import inputValidation from '../utils/inputValidation';
import { handleBlur, handleFocus, handleInput } from '../utils/inputHandler';

function OTPVerification({ onOTPComplete, goBack }) {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        otp: "",
    });

    const [focused, setFocused] = useState({
        otp: false,
    });

    const [timer, setTimer] = useState(60); // Countdown timer in seconds for resend (updated to 60s)
    const [isResendEnabled, setResendEnabled] = useState(false); // To control resend button

    // Retrieve email and OTP from sessionStorage
    const email = sessionStorage.getItem('email');
    const storedOtp = sessionStorage.getItem('otp');

    useEffect(() => {
        let countdown;
        // Start the countdown timer for resend OTP button
        if (isResendEnabled === false) {
            countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setResendEnabled(true); // Enable resend after countdown reaches 0
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(countdown); // Cleanup timer on component unmount or when `isResendEnabled` changes
    }, [isResendEnabled]);

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Step 1: Client-side validation
        const validationErrors = inputValidation(values);
    
        // Step 2: If there are errors, stop the process and show errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("Errors found:", validationErrors);
            return;
        }
    
        try {
            // Retrieve OTP and timestamp from sessionStorage
            const storedOTP = sessionStorage.getItem('otp');
            const otpTimestamp = parseInt(sessionStorage.getItem('otpTimestamp')); // Convert timestamp back to number
    
            // Step 3: Check if OTP is within the 2-minute window (updated from 5 seconds to 120,000 ms)
            const currentTime = Date.now();
            if (currentTime - otpTimestamp > 120000) {
                setErrors({ otp: 'OTP has expired. Please request a new one.' });
                console.log("OTP expired.");
                return;
            }
    
            // Step 4: Validate OTP
            if (storedOTP !== values.otp) {
                setErrors({ otp: 'Incorrect OTP. Please try again.' });
                console.log("Incorrect OTP");
                return;
            }
    
            // If OTP matches and is within 2 minutes, proceed to the next step
            onOTPComplete();
            console.log("Success");
        } catch (err) {
            // Handle unexpected errors
            setErrors({ otp: 'An error occurred. Please try again.' });
            console.error('Error occurred during OTP validation:', err);
        }
    };
    

    const handleResendOTP = async () => {
        if (isResendEnabled) {
            // Disable resend button while generating OTP
            setResendEnabled(false);
            setTimer(60); // Reset timer to 60 seconds
    
            // Generate new OTP
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
            // Store the new OTP and timestamp in sessionStorage
            sessionStorage.setItem('otp', newOtp);
            sessionStorage.setItem('otpTimestamp', Date.now().toString()); // Reset the timestamp
    
            try {
                // Send the new OTP to the backend
                const response = await axios.post('http://localhost:8081/send-otp', { email, otp: newOtp });
    
                if (response.data.success) {
                    console.log("OTP resent successfully");
                } else {
                    setErrors({ otp: response.data.error || 'Failed to resend OTP. Please try again.' });
                }
            } catch (err) {
                setErrors({ otp: 'An error occurred while resending OTP. Please try again.' });
                console.error('Error occurred while resending OTP:', err);
            }
    
            // Start the countdown again after resending OTP
            setTimer(60);
        }
    };
    

    return (
        <div className='content-container'>
            <div className="form-container">
                <h1 className="form-title">CHECK YOUR EMAIL</h1>
                <form onSubmit={handleSubmit}>

                    {/* OTP Input */}
                    <div className="input-section-one">
                        <div className={`input-section-one-group ${errors.otp ? 'error' : ''}`}>
                            <label htmlFor="otp">One Time Pin (OTP)</label>
                            <div className='users-input'>
                                <input
                                    type="text"
                                    placeholder=""
                                    name="otp"
                                    value={values.otp}
                                    onChange={(e) => handleInput(e, setValues)}
                                    onFocus={() => handleFocus('otp', setFocused)}
                                    onBlur={(e) => handleBlur(e, values, setFocused, setErrors, inputValidation)}
                                />
                            </div>
                        </div>
                        {errors.otp && focused.otp && <div className="text-danger">{errors.otp}</div>}
                    </div>

                    <button type="submit" className="submit-btn">
                        CONFIRM
                    </button>

                </form>

                {/* Resend OTP Button */}
                <div className="resend-otp">
                    <p
                        onClick={isResendEnabled && handleResendOTP} // Disable the onClick during countdown
                        className={`resend-btn ${timer > 0 ? 'inactive' : ''}`} // Add class when countdown is running
                    >
                        {timer > 0 ? `Resend Code? (${timer}s)` : 'Resend Code?'}
                    </p>
                </div>

                <div className='hr-horizontal'></div>

                <div className='container-cancelbutton'>
                    <button className='goHomePageButton' onClick={goBack}>CANCEL</button>
                </div>
            </div>
        </div>
    );
}

export default OTPVerification;
