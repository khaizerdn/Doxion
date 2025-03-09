// validator.js
// Validates an email to ensure it ends with @cvsu.edu.ph
export const validateEmail = (email) => {
  // Basic email regex to check format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@cvsu\.edu\.ph$/;
  if (!email) {
      return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid @cvsu.edu.ph email' };
  }
  return { isValid: true, error: '' };
};

// Validate required text field
export const validateRequired = (value, fieldName) => {
  if (!value.trim()) {
      return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: '' };
};

export const validateLockerNumber = (value) => {
  if (!value) {
      return { isValid: false, error: 'Locker number is required' };
  }
  if (!/^\d+$/.test(value)) {
      return { isValid: false, error: 'Locker number must be a valid number' };
  }
  return { isValid: true, error: '' };
};