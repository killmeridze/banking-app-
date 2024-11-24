import { Link } from "react-router-dom";
import logo from "../../../../assets/img/logo.png";
import styles from "./Navigation.module.css";

export const Navigation = () => {
  const handleNavHover = (e, opacity) => {
    if (e.target.classList.contains(styles.nav_link)) {
      const siblings = e.target
        .closest(`.${styles.nav}`)
        .querySelectorAll(`.${styles.nav_link}`);
      const logo = e.target.closest(`.${styles.nav}`).querySelector("img");
      siblings.forEach((el) => {
        if (el !== e.target) el.style.opacity = opacity;
      });
      if (logo) logo.style.opacity = opacity;
    }
  };

  return (
    <nav
      className={styles.nav}
      onMouseOver={(e) => handleNavHover(e, 0.5)}
      onMouseOut={(e) => handleNavHover(e, 1)}
    >
      <Link to="/" className={styles.logo_link}>
        <img src={logo} alt="Логотип Bankist" className={styles.nav_logo} />
      </Link>
      <ul className={styles.nav_links}>
        <li>
          <Link to="/" className={styles.nav_link}>
            На главную
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className={`${styles.nav_link} ${styles.nav_link_btn}`}
          >
            Войти
          </Link>
        </li>
      </ul>
    </nav>
  );
};
