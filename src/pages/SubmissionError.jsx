import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import inputValidation from '../utils/inputValidation';
import { handleBlur, handleFocus, handleInput } from '../utils/inputHandler';
import LoadingScreen from './loadingscreen';

function SubmissionForm({ onFormSubmit, goBack }) {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState(() => {
        const storedValues = sessionStorage.getItem("submissionFormValues");
        if (storedValues) {
            console.log("Restoring values from sessionStorage:", JSON.parse(storedValues));
            return JSON.parse(storedValues);
        }
        const selectedEmail = sessionStorage.getItem("selectedRecipientEmail") || "";
        const selectedLockerNumber = sessionStorage.getItem("selectedLockerNumber") || "";
        console.log("Initializing new values with:", { selectedEmail, selectedLockerNumber });
        return {
            firstName: "",
            lastName: "",
            recipientEmail: selectedEmail,
            note: "",
            lockerNumber: selectedLockerNumber,
        };
    });
    const [focused, setFocused] = useState({
        firstName: false,
        lastName: false,
        recipientEmail: false,
        note: false,
        lockerNumber: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to clear sessionStorage except for "email" and "submissionFormValues"
    const clearSessionStorageExceptEmailAndValues = () => {
        const email = sessionStorage.getItem("email");
        const formValues = sessionStorage.getItem("submissionFormValues");
        sessionStorage.clear();
        if (email) {
            sessionStorage.setItem("email", email);
        }
        if (formValues) {
            sessionStorage.setItem("submissionFormValues", formValues);
        }
    };

    // Save values to sessionStorage whenever they change
    useEffect(() => {
        console.log("Updating sessionStorage with values:", values);
        sessionStorage.setItem("submissionFormValues", JSON.stringify(values));
    }, [values]);

    // Clear session storage (except "email" and "submissionFormValues") when navigating away
    useEffect(() => {
        return () => {
            console.log("Unmounting SubmissionForm, preserving email and form values");
            clearSessionStorageExceptEmailAndValues();
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = inputValidation(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("Errors found:", validationErrors);
            return;
        }

        const email = sessionStorage.getItem('email');
        const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            recipientEmail: values.recipientEmail,
            email: email,
            note: values.note,
            lockerNumber: values.lockerNumber,
        };

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:8081/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the form. Please try again.');
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);

            setErrors({});
            onFormSubmit();
            setIsLoading(false);
            // Optionally clear form values after successful submission
            // sessionStorage.removeItem("submissionFormValues");
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('There was an error submitting your credentials. Please try again.');
            console.error('Error submitting form:', error);
        }
    };

    if (isLoading && !errorMessage) {
        return <LoadingScreen message="Please wait, your request is being processed..." />;
    }

    if (errorMessage) {
        return <LoadingScreen message={errorMessage} />;
    }

    return (
        <div className='content-container'>
            <div className="form-container">
                <h1 className="form-title">SUBMISSION FORM</h1>
                <form onSubmit={handleSubmit}>
                    {/* First Name */}
                    <div className="input-section-one">
                        <div className={`input-section-one-group ${errors.firstName ? 'error' : ''}`}>
                            <label htmlFor="firstName">First Name</label>
                            <div className='users-input'>
                                <input
                                    type="text"
                                    placeholder=""
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={(e) => handleInput(e, setValues)}
                                    onFocus={() => handleFocus('firstName', setFocused)}
                                    onBlur={(e) => handleBlur(e, values, setFocused, setErrors, inputValidation)}
                                />
                            </div>
                        </div>
                        {errors.firstName && focused.firstName && <div className="text-danger">{errors.firstName}</div>}
                    </div>

                    {/* Last Name */}
                    <div className="input-section-one">
                        <div className={`input-section-one-group ${errors.lastName ? 'error' : ''}`}>
                            <label htmlFor="lastName">Last Name</label>
                            <div className='users-input'>
                                <input
                                    type="text"
                                    placeholder=""
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={(e) => handleInput(e, setValues)}
                                    onFocus={() => handleFocus('lastName', setFocused)}
                                    onBlur={(e) => handleBlur(e, values, setFocused, setErrors, inputValidation)}
                                />
                            </div>
                        </div>
                        {errors.lastName && focused.lastName && <div className="text-danger">{errors.lastName}</div>}
                    </div>

                    {/* Recipient Email Address */}
                    <div className="input-section-one">
                        <div className={`input-section-one-group ${errors.recipientEmail ? 'error' : ''}`}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <label htmlFor="recipientEmail">Recipient Email Address</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        name="recipientEmail"
                                        value={values.recipientEmail}
                                        onChange={(e) => handleInput(e, setValues)}
                                        onFocus={() => handleFocus('recipientEmail', setFocused)}
                                        onBlur={(e) => handleBlur(e, values, setFocused, setErrors, inputValidation)}
                                    />
                                </div>
                                <Link
                                    to="/recipient"
                                    title=""
                                    style={{
                                        marginLeft: '10px',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4c4c4c" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        {errors.recipientEmail && focused.recipientEmail && <div className="text-danger">{errors.recipientEmail}</div>}
                    </div>

                    {/* Note */}
                    <div className="input-section-one">
                        <div className={`input-section-one-group ${errors.note ? 'error' : ''}`}>
                            <label htmlFor="note">Note</label>
                            <div className='users-input'>
                                <input
                                    type="text"
                                    placeholder=""
                                    name="note"
                                    value={values.note}
                                    onChange={(e) => handleInput(e, setValues)}
                                    onFocus={() => handleFocus('note', setFocused)}
                                    onBlur={(e) => handleBlur(e, values, setFocused, setErrors, inputValidation)}
                                />
                            </div>
                        </div>
                        {errors.note && focused.note && <div className="text-danger">{errors.note}</div>}
                    </div>

                    {/* Locker Number */}
                    <div className="input-section-one">
                        <div className={`input-section-one-group ${errors.lockerNumber ? 'error' : ''}`}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <label htmlFor="lockerNumber">Locker Number</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        name="lockerNumber"
                                        value={values.lockerNumber}
                                        onChange={(e) => handleInput(e, setValues)}
                                        onFocus={() => handleFocus('lockerNumber', setFocused)}
                                        onBlur={(e) => handleBlur(e, values, setFocused, setErrors, inputValidation)}
                                    />
                                </div>
                                <Link
                                    to="/lockernumber"
                                    title=""
                                    style={{
                                        marginLeft: '10px',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4c4c4c" viewBox="0 0 24 24">
                                        <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7h-1V7a5 5 0 0 0-10 0v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-8-3a3 3 0 0 1 6 0v3H10V7z"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        {errors.lockerNumber && focused.lockerNumber && <div className="text-danger">{errors.lockerNumber}</div>}
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

export default SubmissionForm;