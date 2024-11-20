import { Link } from "react-router-dom";
import logo from "../../../../assets/img/logo.png";
import styles from "./Header.module.css";

export const Header = ({ username, onLogout }) => (
  <header className={styles.dashboard_nav}>
    <div className={styles.nav_container}>
      <div className={styles.logo_container}>
        <img src={logo} alt="Логотип" className={styles.logo} />
      </div>
      <div className={styles.welcome}>
        Добро пожаловать, <span className={styles.username}>{username}</span>
      </div>
      <div className={styles.header_actions}>
        <Link to="/" className={styles.nav_link}>
          На главную
        </Link>
        <button
          className={`${styles.nav_link} ${styles.logout_btn}`}
          onClick={onLogout}
        >
          Выйти
        </button>
      </div>
    </div>
  </header>
);
