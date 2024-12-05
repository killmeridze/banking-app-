import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import { validateForm } from "../utils/validation";
import { AuthTokenService } from "../../../services/api/AuthTokenService";
import { VALIDATION_MESSAGES } from "../../../constants";

export const useRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.username.length < 4) {
        setFormErrors({
          username: VALIDATION_MESSAGES.USERNAME_SHORT,
        });
        return;
      }

      const validationResult = validateForm(formData);
      if (!validationResult.isValid) {
        setFormErrors(validationResult.errors);
        return;
      }

      await api.auth.register(formData);
      navigate("/login", {
        state: { message: "Регистрация успешна! Теперь вы можете войти." },
      });
    } catch (error) {
      const errorMessage =
        error.message ||
        error.data?.message ||
        error.data?.error ||
        VALIDATION_MESSAGES.REGISTRATION_ERROR;

      if (errorMessage.includes("именем")) {
        setFormErrors({
          username: errorMessage,
        });
      } else if (errorMessage.includes("email")) {
        setFormErrors({
          email: errorMessage,
        });
      } else {
        setFormErrors({
          submit: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    formErrors,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
