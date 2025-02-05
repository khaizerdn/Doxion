import React, { useState } from 'react';
import inputValidation from '../utils/inputValidation';
import { handleBlur, handleFocus, handleInput } from '../utils/inputHandler';
import LoadingScreen from './loadingscreen';

function SubmissionForm({ onFormSubmit, goBack }) {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        recipientEmail: "",
        note: "",
        lockerNumber: "",
    });

    const [focused, setFocused] = useState({
        firstName: false,
        lastName: false,
        recipientEmail: false,
        note: false,
        lockerNumber: false,
    });

    const [isLoading, setIsLoading] = useState(false);  // Track loading state
    const [errorMessage, setErrorMessage] = useState(''); // Track error message

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

        // Step 3: Retrieve email from sessionStorage
        const email = sessionStorage.getItem('email');

        // Step 4: Prepare the data payload for submission
        const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            recipientEmail: values.recipientEmail,
            email: email,
            note: values.note,
            lockerNumber: values.lockerNumber,
        };

        // Show loading screen
        setIsLoading(true);
        setErrorMessage(''); // Reset any previous error message

        try {
            // Step 5: Call the API endpoint to handle the submission
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

            // Step 6: Trigger the backend action without page redirection
            // if (values.lockerNumber === "1") {
            //     console.log("Triggering action for locker 1");
            //     await fetch('http://192.168.43.226/LOCK=ON', {
            //         method: 'GET',
            //         mode: 'no-cors',
            //     });
            //     // Step 7: Clear the form and notify the parent component
            //     setValues({
            //         firstName: "",
            //         lastName: "",
            //         recipientEmail: "",
            //         note: "",
            //         lockerNumber: "",
            //     });
            //     setErrors({});
            //     onFormSubmit();
            //     setIsLoading(false);

            //     // Add delay (e.g., 1 second)
            //     await new Promise(resolve => setTimeout(resolve, 5000));

            //     await fetch('http://192.168.43.226/LED=ON', {
            //         method: 'GET',
            //         mode: 'no-cors',
            //     });
            // } else {
            //     setValues({
            //         firstName: "",
            //         lastName: "",
            //         recipientEmail: "",
            //         note: "",
            //         lockerNumber: "",
            //     });
            //     setErrors({});
            //     onFormSubmit();
            //     setIsLoading(false);
            // }

            setErrors({});
            onFormSubmit();
            setIsLoading(false);

        } catch (error) {
            // Show error message on loading screen
            setIsLoading(false);
            setErrorMessage('There was an error submitting your credentials. Please try again.');
            console.error('Error submitting form:', error);
        }
    };


    // If loading, show the LoadingScreen with a loading message
    if (isLoading && !errorMessage) {
        return <LoadingScreen message="Please wait, your request is being processed..." />;
    }

    // If there's an error, show the LoadingScreen with the error message
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

                {/* Recepient Email Address */}
                <div className="input-section-one">
                    <div className={`input-section-one-group ${errors.recipientEmail ? 'error' : ''}`}>
                        <label htmlFor="recipientEmail">Recipient Email Address</label>
                        <div className='users-input'>
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
                        <label htmlFor="lockerNumber">Locker Number</label>
                        <div className='users-input'>
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
