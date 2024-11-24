import { motion } from "framer-motion";
import styles from "./Tabs.module.css";

export const TabsNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "overview", label: "Обзор" },
    { id: "actions", label: "Действия" },
    { id: "transactions", label: "Транзакции" },
  ];

  return (
    <div className={styles.tabs_nav}>
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`${styles.tab_btn} ${
            activeTab === tab.id ? styles.active : ""
          }`}
          onClick={() => onTabChange(tab.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              className={styles.active_indicator}
              layoutId="activeTab"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};
