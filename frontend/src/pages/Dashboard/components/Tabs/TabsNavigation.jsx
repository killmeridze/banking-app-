import styles from "./Tabs.module.css";

export const TabsNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabs_nav}>
      <button
        className={`${styles.tab_btn} ${
          activeTab === "overview" ? styles.active : ""
        }`}
        onClick={() => onTabChange("overview")}
      >
        Обзор
      </button>
      <button
        className={`${styles.tab_btn} ${
          activeTab === "actions" ? styles.active : ""
        }`}
        onClick={() => onTabChange("actions")}
      >
        Действия
      </button>
      <button
        className={`${styles.tab_btn} ${
          activeTab === "transactions" ? styles.active : ""
        }`}
        onClick={() => onTabChange("transactions")}
      >
        Транзакции
      </button>
    </div>
  );
};
