import { VALIDATION_PATTERNS } from "../../constants";

class ValidationService {
  validateEmail(email) {
    return VALIDATION_PATTERNS.EMAIL.test(email);
  }

  validatePassword(password) {
    return VALIDATION_PATTERNS.PASSWORD.test(password);
  }

  validatePin(pin) {
    return VALIDATION_PATTERNS.PIN.test(pin);
  }

  validateUsername(username) {
    return username.length >= 4;
  }

  validateAmount(amount) {
    return amount > 0 && !isNaN(amount);
  }

  validateForm(data, rules) {
    const errors = {};

    for (const [field, value] of Object.entries(data)) {
      if (rules[field]) {
        const error = rules[field](value);
        if (error) errors[field] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export const validation = new ValidationService();
