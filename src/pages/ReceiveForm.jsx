import React, { useState, useEffect } from 'react';
import LoadingScreen from './loadingscreen';

function ReceiveForm({ onFormSubmit, goBack }) {
    const [values, setValues] = useState({
        lockerNumber: "",
        note: "",
    });
    const [errors, setErrors] = useState({});
    const [focused, setFocused] = useState({
        lockerNumber: false,
        note: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Clear session storage when navigating away from this page
    useEffect(() => {
        return () => {
            sessionStorage.clear();
        };
    }, []);

    const handleInput = (e, setValues) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleFocus = (field, setFocused) => {
        setFocused(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (e, values, setFocused, setErrors, validate) => {
        const { name } = e.target;
        setFocused(prev => ({ ...prev, [name]: false }));
        const validationErrors = validate(values);
        setErrors(validationErrors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Placeholder validation (replace with your actual validation logic)
        const validationErrors = {};
        if (!values.lockerNumber) validationErrors.lockerNumber = "Locker Number is required";
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const email = sessionStorage.getItem('email');
        const payload = {
            email: email,
            lockerNumber: values.lockerNumber,
            note: values.note,
        };

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:8081/receive-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the receive form. Please try again.');
            }

            const result = await response.json();
            console.log('Receive form submitted successfully:', result);

            setErrors({});
            onFormSubmit();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('There was an error submitting your request. Please try again.');
            console.error('Error submitting receive form:', error);
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
                <h1 className="form-title">RECEIVE FORM</h1>
                <form onSubmit={handleSubmit}>
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
                                    onBlur={(e) => handleBlur(e, values, setFocused, setErrors, (vals) => ({
                                        lockerNumber: vals.lockerNumber ? '' : 'Locker Number is required'
                                    }))}
                                />
                            </div>
                        </div>
                        {errors.lockerNumber && focused.lockerNumber && <div className="text-danger">{errors.lockerNumber}</div>}
                    </div>

                    {/* Note */}
                    <div className="input-section-one">
                        <div className={`input-section-one-group ${errors.note ? 'error' : ''}`}>
                            <label htmlFor="note">Note (Optional)</label>
                            <div className='users-input'>
                                <input
                                    type="text"
                                    placeholder=""
                                    name="note"
                                    value={values.note}
                                    onChange={(e) => handleInput(e, setValues)}
                                    onFocus={() => handleFocus('note', setFocused)}
                                    onBlur={(e) => handleBlur(e, values, setFocused, setErrors, () => ({}))}
                                />
                            </div>
                        </div>
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

export default ReceiveForm;