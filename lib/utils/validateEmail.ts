const ALLOWED_ADMIN_EMAILS = ["minalahmed6219@gmail.com"];

export const validateEmail = (
  email: string,
  isAdmin: boolean
): { isValid: boolean; message: string } => {
  // Admin email validation
  if (isAdmin) {
    return {
      isValid: ALLOWED_ADMIN_EMAILS.includes(email),
      message: ALLOWED_ADMIN_EMAILS.includes(email)
        ? "Valid admin email"
        : "This email is not authorized for admin signup",
    };
  }

  // Student email validation
  if (!email.endsWith("@cse.bubt.edu.bd")) {
    return {
      isValid: false,
      message: "Student email must be from @cse.bubt.edu.bd domain",
    };
  }

  const studentId = email.split("@")[0];
  if (studentId.length !== 11) {
    return {
      isValid: false,
      message: "Student ID must be 11 digits",
    };
  }

  const pattern = /^20255203\d{3}$/;
  if (!pattern.test(studentId)) {
    return {
      isValid: false,
      message: "Invalid student ID format",
    };
  }

  // Check if the ID is within the allowed range
  const lastThreeDigits = parseInt(studentId.slice(-3));
  if (lastThreeDigits < 1 || lastThreeDigits > 41) {
    return {
      isValid: false,
      message: "Student ID must be between 20255203001 and 20255203041",
    };
  }

  return {
    isValid: true,
    message: "Valid BUBT CSE email",
  };
};
