import { Link } from "react-router-dom";
import logo from "../../../../assets/img/logo.png";

export const Footer = () => {
  const footerLinks = [
    { text: "О нас", path: "/" },
    { text: "Тарифы", path: "/" },
    { text: "Условия использования", path: "/" },
    { text: "Политика конфиденциальности", path: "/" },
    { text: "Карьера", path: "/" },
    { text: "Блог", path: "/" },
    { text: "Контакты", path: "/" },
  ];

  return (
    <footer className="footer">
      <ul className="footer__nav">
        {footerLinks.map((link, index) => (
          <li key={index} className="footer__item">
            <Link className="footer__link" to={link.path}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>

      <img src={logo} alt="Логотип" className="footer__logo" />

      <p className="footer__copyright">
        &copy; Все авторские права принадлежат{" "}
        <a
          className="footer__link"
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
