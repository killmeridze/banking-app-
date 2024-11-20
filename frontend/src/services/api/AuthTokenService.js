export class AuthTokenService {
  static TOKEN_KEY = "jwt_token";

  static setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}
