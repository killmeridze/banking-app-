import styles from "./Mission.module.css";

export const Mission = () => {
  return (
    <section className={styles.mission}>
      <div className={styles.content}>
        <h2>Наша миссия</h2>
        <p>
          Сделать финансовый мир доступным и понятным для каждого, предоставляя
          инновационные банковские решения с фокусом на простоту и безопасность.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat_item}>
            <span className={styles.number}>500K+</span>
            <span className={styles.label}>Активных пользователей</span>
          </div>
          <div className={styles.stat_item}>
            <span className={styles.number}>50+</span>
            <span className={styles.label}>Стран присутствия</span>
          </div>
          <div className={styles.stat_item}>
            <span className={styles.number}>24/7</span>
            <span className={styles.label}>Поддержка клиентов</span>
          </div>
        </div>
      </div>
    </section>
  );
};
