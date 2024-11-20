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
        setFormErrors((prev) => ({
          ...prev,
          username: VALIDATION_MESSAGES.USERNAME_SHORT,
        }));
        return;
      }

      const validationResult = validateForm(formData);
      if (!validationResult.isValid) {
        setFormErrors(validationResult.errors);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setFormErrors({
          confirmPassword: VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH,
        });
        return;
      }

      const exists = await api.users.checkExists(
        formData.username,
        formData.email
      );

      if (exists.usernameExists || exists.emailExists) {
        setFormErrors({
          ...(exists.usernameExists && {
            username: VALIDATION_MESSAGES.USER_EXISTS,
          }),
          ...(exists.emailExists && {
            email: VALIDATION_MESSAGES.EMAIL_EXISTS,
          }),
        });
        return;
      }

      const response = await api.auth.register(formData);

      if (response.token) {
        AuthTokenService.setToken(response.token);
        navigate("/login", {
          state: { message: "Регистрация успешна! Теперь вы можете войти." },
        });
      }
    } catch (error) {
      setFormErrors({
        submit: error.message || VALIDATION_MESSAGES.REGISTRATION_ERROR,
      });
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
