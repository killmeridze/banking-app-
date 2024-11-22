import { Link } from "react-router-dom";
import logo from "../../../../assets/img/logo.png";
import styles from "./Navigation.module.css";

export const Navigation = () => {
  return (
    <nav className={styles.nav}>
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
            Вход
          </Link>
        </li>
      </ul>
    </nav>
  );
};
