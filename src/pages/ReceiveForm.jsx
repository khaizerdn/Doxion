import React, { useState } from 'react';
import inputValidation from '../utils/inputValidation';
import { handleBlur, handleFocus, handleInput } from '../utils/inputHandler';
import LoadingScreen from './loadingscreen';

function ReceiveForm({ onFormSubmit, goBack }) {
  const [values, setValues] = useState({
    lockerNumber: '',
    otp: '',
  });

  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({
    lockerNumber: false,
    otp: false,
  });

  const [isLoading, setIsLoading] = useState(false);  // Track loading state
  const [errorMessage, setErrorMessage] = useState(''); // Track error message

  const handleSubmit = async (event) => {
    event.preventDefault();


    // Step 1: Client-side validation
    const validationErrors = inputValidation(values);

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Validation errors:', validationErrors);
      return;
    }
    // Show loading screen
    setIsLoading(true);
    setErrorMessage(''); // Reset any previous error message
    // Step 2: API request to validate OTP
    try {
      const response = await fetch('http://localhost:8081/validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to validate OTP. Please try again.');
      }

      const result = await response.json();

      if (result.success) {
        console.log('OTP validated successfully:', result);

        // if (values.lockerNumber === '1') {
        //   await fetch('http://192.168.43.226/LOCK=ON', {
        //     method: 'GET',
        //     mode: 'no-cors',
        //   });
        //   setIsLoading(false);
        //   // Clear values and errors, notify the parent component
        //   setValues({ lockerNumber: '', otp: '' });
        //   setErrors({});
        //   onFormSubmit();
        //   // Add delay (e.g., 1 second)
        //   await new Promise(resolve => setTimeout(resolve, 5000));

        //   await fetch('http://192.168.43.226/LED=OFF', {
        //     method: 'GET',
        //     mode: 'no-cors',
        //   });
        // } else {
        //   setIsLoading(false);
        //   setErrors({ otp: result.error || 'Invalid verification code.' });
        //   setValues({ lockerNumber: '', otp: '' });
        //   setErrors({});
        //   onFormSubmit();
        // }
        setErrors({});
        onFormSubmit();
        setIsLoading(false);

      } else {
        // Set error if OTP validation failed
        setIsLoading(false);
        setErrors({ otp: result.error || 'Invalid verification code.' });
        setValues({ lockerNumber: '', otp: '' });
        setErrors({});
        onFormSubmit();
      }
    } catch (error) {
      // Handle network or unexpected errors
      setIsLoading(false);
      setErrorMessage('There was an error submitting your credentials. Please try again.');
      console.error('Error during OTP validation:', error);
      setErrors({ otp: 'Invalid verification code.' });
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
        <h1 className="form-title">RECEPTION FORM</h1>
        <form onSubmit={handleSubmit}>
          {/* Locker Number */}
          <div className="input-section-one">
            <div className={`input-section-one-group ${errors.lockerNumber ? 'error' : ''}`}>
              <label htmlFor="lockerNumber">Locker Number</label>
              <div className="users-input">
                <input
                  type="text"
                  name="lockerNumber"
                  value={values.lockerNumber}
                  onChange={(e) => handleInput(e, setValues)}
                  onFocus={() => handleFocus('lockerNumber', setFocused)}
                  onBlur={(e) => handleBlur(e, values, setFocused, setErrors, inputValidation)}
                />
              </div>
            </div>
            {errors.lockerNumber && focused.lockerNumber && (
              <div className="text-danger">{errors.lockerNumber}</div>
            )}
          </div>

          {/* OTP */}
          <div className="input-section-one">
            <div className={`input-section-one-group ${errors.otp ? 'error' : ''}`}>
              <label htmlFor="otp">OTP</label>
              <div className="users-input">
                <input
                  type="text"
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
            UNLOCK
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
