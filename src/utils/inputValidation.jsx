function inputValidation(values) {
  let error = {};

  const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const recipient_email_pattern = /^[a-zA-Z0-9._%+-]+@cvsu\.edu\.ph$/; // Pattern for @cvsu.edu.ph
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[a-zA-Z0-9\W_]{8,}$/;
  const name_pattern = /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/;
  const username_pattern = /^[a-zA-Z0-9._-]{4,20}$/;

  // First Name Validation
  if (values.firstName !== undefined) {
    if (values.firstName.trim() === "") {
      error.firstName = "First name should not be empty.";
    } else if (!name_pattern.test(values.firstName)) {
      error.firstName =
        "First name should contain only letters and each first letter should be capitalized (e.g., Khaizer).";
    }
  }

  // Last Name Validation
  if (values.lastName !== undefined) {
    if (values.lastName.trim() === "") {
      error.lastName = "Last name should not be empty.";
    } else if (!name_pattern.test(values.lastName)) {
      error.lastName =
        "Last name should contain only letters and each first letter should be capitalized (e.g., Noguera).";
    }
  }

  // Username Validation
  if (values.username !== undefined) {
    if (values.username.trim() === "") {
      error.username = "Username should not be empty.";
    } else if (!username_pattern.test(values.username)) {
      error.username =
        "Username must be 4-20 characters long and can only contain letters, numbers, dots, underscores, or hyphens.";
    }
  }

  // Gender Validation
  if (values.gender !== undefined && values.gender === "") {
    error.gender = "Please select your gender.";
  }

  // Birthdate Validation
  if (
    values.month !== undefined &&
    values.day !== undefined &&
    values.year !== undefined
  ) {
    if (values.month === "" || values.day === "" || values.year === "") {
      error.birthdate = "Please select your full birthdate (Month/Day/Year).";
    } else {
      const birthDate = new Date(`${values.year}-${values.month}-${values.day}`);
      if (isNaN(birthDate.getTime())) {
        error.birthdate = "Invalid birthdate.";
      }
    }
  }

  // Email Validation
  if (values.email !== undefined) {
    if (values.email.trim() === "") {
      error.email = "Email should not be empty.";
    } else if (!email_pattern.test(values.email)) {
      error.email = "Invalid email format.";
    }
  }

  // Recipient Email Validation
  if (values.recipientEmail !== undefined) {
    if (values.recipientEmail.trim() === "") {
      error.recipientEmail = "Recipient email should not be empty.";
    } else if (!recipient_email_pattern.test(values.recipientEmail)) {
      error.recipientEmail = "Recipient email must end with @cvsu.edu.ph.";
    }
  }

  // Password Validation
  if (values.password !== undefined) {
    if (values.password.trim() === "") {
      error.password = "Password should not be empty.";
    } else if (!password_pattern.test(values.password)) {
      error.password =
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
    }
  }

  // Confirm Password Validation
  if (values.confirmPassword !== undefined) {
    if (values.confirmPassword.trim() === "") {
      error.confirmPassword = "Please confirm your password.";
    } else if (values.confirmPassword !== values.password) {
      error.confirmPassword = "Passwords do not match.";
    }
  }

  // Verification Code Validation
  if (values.verificationCode !== undefined && !values.verificationCode) {
    error.verificationCode = "Verification code should not be empty.";
  }

  // Locker Number Validation
if (values.lockerNumber !== undefined) {
  if (values.lockerNumber.trim() === "") {
    error.lockerNumber = "Locker number should not be empty.";
  } else if (!/^\d+$/.test(values.lockerNumber)) {
    error.lockerNumber = "Locker number should contain only numbers.";
  }
}

  // Note Validation
  if (values.note !== undefined && !values.note) {
    error.note = "Note should not be empty.";
  }

  if (values.otp !== undefined && !values.otp) {
    error.otp = "OTP should not be empty.";
  }


  


  return error;
}

export default inputValidation;
