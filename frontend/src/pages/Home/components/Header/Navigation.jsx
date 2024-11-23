import { Link } from "react-router-dom";
import logo from "../../../../assets/img/logo.png";
import { useSpring } from "@react-spring/web";

export const useRevealAnimation = (isVisible) => {
  return useSpring({
    from: { opacity: 0, transform: "translateY(100px)" },
    to: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(100px)",
    },
    config: { mass: 1, tension: 280, friction: 60 },
  });
};

export const useTabAnimation = (isActive) => {
  return useSpring({
    transform: isActive ? "translateY(-66%)" : "translateY(-50%)",
    config: { tension: 300, friction: 20 },
  });
};

export const useSlideAnimation = (offset) => {
  return useSpring({
    transform: `translateX(${offset}%)`,
    config: { mass: 1, tension: 280, friction: 60 },
  });
};

export const useStickyAnimation = (isSticky) => {
  return useSpring({
    backgroundColor: isSticky ? "rgba(255, 255, 255, 0.95)" : "transparent",
    config: { duration: 200 },
  });
};

export const Navigation = ({ navRef, handleNavHover }) => {
  return (
    <nav
      className="nav"
      ref={navRef}
      onMouseOver={(e) => handleNavHover(e, 0.5)}
      onMouseOut={(e) => handleNavHover(e, 1)}
    >
      <img src={logo} alt="Логотип Банкист" className="nav__logo" id="logo" />
      <ul className="nav__links">
        <li className="nav__item">
          <a className="nav__link" href="#section--1">
            Функционал
          </a>
        </li>
        <li className="nav__item">
          <a className="nav__link" href="#section--2">
            Операции
          </a>
        </li>
        <li className="nav__item">
          <a className="nav__link" href="#section--3">
            Отзывы
          </a>
        </li>
        <li className="nav__item">
          <Link
            className="nav__link nav__link--btn btn--show-modal"
            to="/login"
          >
            Войти
          </Link>
        </li>
      </ul>
    </nav>
  );
};
