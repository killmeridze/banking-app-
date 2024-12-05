import { API_BASE_URL, ENDPOINTS } from "../../constants";
import { AuthTokenService } from "./AuthTokenService";

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  request = async (endpoint, options = {}) => {
    try {
      const token = AuthTokenService.getToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          data: data,
          message: data.message || data.error,
        };
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  getAuthToken() {
    return sessionStorage.getItem("token");
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

  transfer = (transferData) =>
    this.request(ENDPOINTS.TRANSFERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromCardNumber: transferData.fromCardNumber,
        toCardNumber: transferData.toCardNumber,
        amount: Number(transferData.amount),
      }),
    });

  loans = {
    request: (userId, cardId, amount) =>
      this.request(ENDPOINTS.LOANS.REQUEST, {
        method: "POST",
        body: JSON.stringify({
          userId,
          cardId,
          amount,
        }),
      }),
    repay: (loanId, amount) =>
      this.request(ENDPOINTS.LOANS.REPAY(loanId), {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    getUserLoans: (userId) => this.request(ENDPOINTS.LOANS.USER(userId)),
    getDetails: (loanId) => this.request(ENDPOINTS.LOANS.DETAILS(loanId)),
  };

  exchangeRates = {
    getRates: () => this.request(ENDPOINTS.EXCHANGE_RATES.GET),
    getConvertedAmount: (amount, from, to) =>
      this.request(ENDPOINTS.EXCHANGE_RATES.CONVERT(amount, from, to)),
  };

  transactions = {
    getByCard: (cardId) =>
      this.request(ENDPOINTS.TRANSACTIONS.BY_CARD(cardId), {
        method: "GET",
      }),
  };
}

export const api = new ApiService();
