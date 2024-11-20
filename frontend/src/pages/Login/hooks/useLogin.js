import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VALIDATION_MESSAGES } from "../../../constants";
import { AuthTokenService } from "../../../services/api/AuthTokenService";
import { ENDPOINTS } from "../../../constants";

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          setErrors({
            password: errorData.message || VALIDATION_MESSAGES.INVALID_PASSWORD,
          });
        } else {
          setErrors({
            general: errorData.message || "Ошибка авторизации",
          });
        }
        return;
      }

      const data = await response.json();
      if (data.token) {
        AuthTokenService.setToken(data.token);
        sessionStorage.setItem("currentUserId", data.userId);
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({
        general: "Ошибка сервера. Попробуйте позже.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
