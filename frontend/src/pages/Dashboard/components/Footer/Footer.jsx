import { Link, useLocation } from "react-router-dom";
import logo from "../../../../assets/img/logo.png";
import styles from "./Footer.module.css";

export const Footer = () => {
  const location = useLocation();

  const footerLinks = [
    {
      text: "О нас",
      path: "/about-us",
      disabled: location.pathname === "/about-us",
    },
    { text: "Тарифы", path: "/" },
    { text: "Условия использования", path: "/" },
    { text: "Политика конфиденциальности", path: "/" },
    { text: "Карьера", path: "/" },
    { text: "Блог", path: "/" },
    { text: "Контакты", path: "/" },
  ];

  return (
    <footer className={styles.footer}>
      <ul className={styles.footer__nav}>
        {footerLinks.map((link, index) => (
          <li key={index} className={styles.footer__item}>
            {link.disabled ? (
              <span
                className={`${styles.footer__link} ${styles.footer__link_disabled}`}
              >
                {link.text}
              </span>
            ) : (
              <Link className={styles.footer__link} to={link.path}>
                {link.text}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <img src={logo} alt="Логотип" className={styles.footer__logo} />

      <p className={styles.footer__copyright}>
        &copy; Все авторские права принадлежат{" "}
        <a
          className={styles.footer__link}
          target="_blank"
          rel="noopener noreferrer"
          href="https://linktr.ee/r1dze"
        >
          ridze
        </a>
        . Не претендуйте на это как на свой собственный продукт.
      </p>
    </footer>
  );
};
