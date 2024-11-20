export const API_BASE_URL = "http://localhost:8080/api";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: "/auth/register",
  },
  USERS: {
    EXISTS: "/users/exists",
    PROFILE: "/users",
    TRANSFER: "/users/transfer",
    LOANS: "/users/requestLoan",
  },
  CARDS: {
    CREATE: `/cards/create`,
    DELETE: `/cards/delete`,
  },
};

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
  PIN: /^\d{4}$/,
};

export const VALIDATION_MESSAGES = {
  REQUIRED: "Это поле обязательно",
  EMAIL_INVALID: "Введите корректный email адрес",
  PASSWORD_INVALID:
    "Пароль должен содержать минимум 8 символов, цифру и буквы разного регистра",
  USERNAME_SHORT: "Имя пользователя должно быть длиннее 4 символов",
  USER_EXISTS: "Пользователь с таким именем уже существует",
  EMAIL_EXISTS: "Пользователь с таким email уже существует",
  USER_ALREADY_EXISTS: "Такой пользователь уже существует",
  REGISTRATION_ERROR: "Ошибка при регистрации. Попробуйте позже",
  PASSWORDS_DONT_MATCH: "Пароли не совпадают",
  USER_NOT_FOUND: "Пользователь с таким именем не существует",
  INVALID_PASSWORD: "Неправильный пароль",
};

export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "UAH", "CNY", "JPY"];

export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  UAH: "₴",
  CNY: "¥",
  JPY: "¥",
};
