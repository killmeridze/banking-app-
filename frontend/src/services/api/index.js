import { API_BASE_URL, ENDPOINTS } from "../../constants";
import { AuthTokenService } from "./AuthTokenService";

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    try {
      const token = AuthTokenService.getToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API Error");
      }

      const data = await response.json();

      if (data.token) {
        AuthTokenService.setToken(data.token);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  auth = {
    login: (credentials) =>
      this.request(ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      this.request(ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    validateCredentials: (credentials) =>
      this.request(ENDPOINTS.AUTH.VALIDATE, {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
  };

  users = {
    checkExists: (username, email) =>
      this.request(
        `${ENDPOINTS.USERS.EXISTS}?username=${encodeURIComponent(
          username
        )}&email=${encodeURIComponent(email)}`
      ),
    getProfile: (userId) =>
      this.request(`${ENDPOINTS.USERS.PROFILE}/${userId}`),
    transfer: (data) =>
      this.request(ENDPOINTS.USERS.TRANSFER, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    requestLoan: (userId, amount) =>
      this.request(`${ENDPOINTS.USERS.LOANS}/${userId}`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    addCard: (userId, cardData) =>
      this.request(ENDPOINTS.CARDS.CREATE, {
        method: "POST",
        body: JSON.stringify({
          userId,
          currency: cardData.currency,
          cardType: cardData.cardType,
          pin: cardData.pin,
        }),
      }),
  };
}

export const api = new ApiService();
