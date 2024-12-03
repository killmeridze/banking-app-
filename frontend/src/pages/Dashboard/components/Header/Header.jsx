import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../../assets/img/logo.png";
import styles from "./Header.module.css";

export const Header = ({ username, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.navbar_container}>
        <Link to="/" className={styles.logo_container}>
          <img src={logo} alt="Логотип" className={styles.logo} />
        </Link>

        <nav className={styles.nav_links}>
          <Link
            to="/login"
            className={`${styles.nav_link} ${styles.logout_btn}`}
            onClick={onLogout}
          >
            Выйти
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};
