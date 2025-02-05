import React, { useState } from 'react';
import axios from 'axios';
import inputValidation from '../utils/inputValidation';
import { handleBlur, handleFocus, handleInput } from '../utils/inputHandler';

function UserVerification({ onVerificationComplete, goBack }) {

    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        email: "",
    });

    const [focused, setFocused] = useState({
        email: false,
    });

    // Helper function to generate OTP (6 digits)
    const generateOTP = () => {
        return {
            otp: Math.floor(100000 + Math.random() * 900000).toString(),
            timestamp: Date.now(),  // Store the current timestamp when OTP is generated
        };
    };

    const handleSubmit = async (event) => {
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
            onVerificationComplete();
            // Generate OTP and timestamp
            const { otp, timestamp } = generateOTP();

            // Store the email, OTP, and timestamp in sessionStorage
            sessionStorage.setItem('email', values.email);
            sessionStorage.setItem('otp', otp);
            sessionStorage.setItem('otpTimestamp', timestamp.toString()); // Store the timestamp as a string

            // Send the email and OTP to the backend
            const response = await axios.post('http://localhost:8081/send-otp', { email: values.email, otp });

            if (response.data.success) {
                console.log("OTP sent successfully");
            } else {
                setErrors({ email: response.data.error || 'Failed to send OTP. Please try again.' });
            }
        } catch (err) {
            setErrors({ email: 'An error occurred. Please try again.' });
        }
    };



    return (
        <div className='content-container'>
            <div className="form-container">

                <h1 className="form-title">ENTER YOUR EMAIL</h1>
                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="input-section-one">
                        <div className={`input-section-one-group ${errors.email ? 'error' : ''}`}>
                            <label htmlFor="email">Email</label>
                            <div className='users-input'>
                                <input
                                    type="text"
                                    placeholder=""
                                    name="email"
                                    value={values.email}
                                    onChange={(e) => handleInput(e, setValues)}
                                    onFocus={() => handleFocus('email', setFocused)}
                                    onBlur={(e) => handleBlur(e, values, setFocused, setErrors, inputValidation)}
                                />
                            </div>
                        </div>
                        {errors.email && focused.email && <div className="text-danger">{errors.email}</div>}
                    </div>

                    <button type="submit" className="submit-btn">
                        CONFIRM
                    </button>

                </form>
                <div className='container-cancelbutton'>
                    <button className='goHomePageButton' onClick={goBack}>CANCEL</button>
                </div>
            </div>
        </div>
    );
}

export default UserVerification;
