import { VALIDATION_MESSAGES } from "../../../constants";

export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(String(password));
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateForm = (formData) => {
  const errors = {};

  if (!formData.username || formData.username.length < 4) {
    errors.username = VALIDATION_MESSAGES.USERNAME_SHORT;
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
  }

  if (!formData.password || !validatePassword(formData.password)) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_INVALID;
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
