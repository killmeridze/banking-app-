import { values } from "../../data/valuesData";
import { ValueCard } from "./ValueCard";
import styles from "./Values.module.css";

export const Values = () => {
  return (
    <section className={styles.values}>
      <h2>Наши ценности</h2>
      <p className={styles.subtitle}>
        Принципы, которыми мы руководствуемся каждый день
      </p>
      <div className={styles.cards}>
        {values.map((value) => (
          <ValueCard key={value.id} {...value} />
        ))}
      </div>
    </section>
  );
};
