import styles from "./Values.module.css";
import { FiZap, FiShield, FiStar } from "react-icons/fi";

const icons = {
  shield: FiShield,
  lightbulb: FiZap,
  sparkles: FiStar,
};

export const ValueCard = ({ title, description, icon }) => {
  const Icon = icons[icon];

  return (
    <div className={styles.card}>
      <div className={styles.icon_wrapper}>
        <Icon className={styles.icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
