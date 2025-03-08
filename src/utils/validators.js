// Validates an email to ensure it ends with @cvsu.edu.ph
export const validateEmail = (email) => {
    // Check if email is empty
    if (!email || email.trim() === '') {
      return { isValid: false, error: 'Email is required' };
    }
  
    // Regular expression to ensure the email ends with @cvsu.edu.ph
    const emailRegex = /^[a-zA-Z0-9._%+-]+@cvsu\.edu\.ph$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: 'Email must be a valid CvSU email (e.g., username@cvsu.edu.ph)',
      };
    }
  
    return { isValid: true, error: '' };
  };