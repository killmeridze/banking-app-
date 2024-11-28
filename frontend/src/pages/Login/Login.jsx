import React from "react";
import { useLogin } from "./hooks/useLogin";
import { Link } from "react-router-dom";
import { animated } from "@react-spring/web";
import { useLoginAnimations } from "./hooks/useLoginAnimations";
import { usePageTitle } from "../../hooks/usePageTitle";
import logo from "../../assets/img/logo.png";
import "./Login.css";

export const Login = () => {
  usePageTitle("Вход");
  const { credentials, errors, isLoading, handleChange, handleSubmit } =
    useLogin();
  const {
    containerSpring,
    logoSpring,
    setLogoSpring,
    formSpring,
    titleSpring,
  } = useLoginAnimations();

  return (
    <animated.header className="login-nav" style={containerSpring}>
      <animated.img
        src={logo}
        alt="Логотип"
        className="logo"
        style={logoSpring}
        onMouseEnter={() => setLogoSpring({ scale: 1.05 })}
        onMouseLeave={() => setLogoSpring({ scale: 1 })}
      />
      <animated.div className="login-heading" style={titleSpring}>
        <h1 className="welcome">
          <span className="highlight">Войти</span> чтобы начать
        </h1>
      </animated.div>

      <animated.div className="form-container" style={formSpring}>
        <form className="login" onSubmit={handleSubmit}>
          <input
            type="username"
            placeholder="Имя пользователя"
            className={`login__input ${errors.username ? "warning" : ""}`}
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Пароль"
            className={`login__input ${errors.password ? "warning" : ""}`}
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          {(errors.username || errors.password || errors.general) && (
            <div className="form-errors">
              {errors.general && (
                <p className="error-message">{errors.general}</p>
              )}
              {errors.username && (
                <p className="error-message">{errors.username}</p>
              )}
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
          )}

          <button className="login__btn" type="submit" disabled={isLoading}>
            <span className={`btn-content ${isLoading ? "loading" : ""}`}>
              {isLoading ? (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              ) : (
                "→"
              )}
            </span>
          </button>
        </form>

        <div className="login-footer">
          <Link to="/" className="back-to-main">
            На главную
          </Link>
          <p className="register-link">
            Нет учетной записи? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </animated.div>
    </animated.header>
  );
};

export default Login;
