import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { validation } from "../services/validation";
import { errorHandler } from "../services/errorHandler";
import { VALIDATION_MESSAGES } from "../constants";

export const useAuth = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      const validationResult = validation.validateForm(credentials, {
        username: validation.validateUsername,
        password: validation.validatePassword,
        pin: validation.validatePin,
      });

      if (!validationResult.isValid) {
        throw new Error(
          errorHandler.handleValidationError(validationResult.errors)
        );
      }

      const isValid = await api.auth.validateCredentials(credentials);
      if (!isValid) {
        throw new Error(VALIDATION_MESSAGES.INVALID_CREDENTIALS);
      }

      const response = await api.auth.login(credentials);
      sessionStorage.setItem("currentUserId", response.userId);
      navigate("/dashboard");
    } catch (error) {
      setError(errorHandler.handleApiError(error));
    }
  };

  const register = async (userData) => {
    try {
      const validationResult = validation.validateForm(userData, {
        username: validation.validateUsername,
        email: validation.validateEmail,
        password: validation.validatePassword,
        pin: validation.validatePin,
      });

      if (!validationResult.isValid) {
        throw new Error(
          errorHandler.handleValidationError(validationResult.errors)
        );
      }

      const userExists = await api.users.checkExists(
        userData.username,
        userData.email
      );
      if (userExists) {
        throw new Error(VALIDATION_MESSAGES.USER_EXISTS);
      }

      await api.auth.register(userData);
      navigate("/login");
    } catch (error) {
      setError(errorHandler.handleApiError(error));
    }
  };

  return {
    error,
    login,
    register,
  };
};
