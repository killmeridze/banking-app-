import { calculateSummary } from "../../utils/calculations";
import { formatCurrency } from "../../utils/formatters";
import styles from "./Summary.module.css";

export const Summary = ({ movements = [], loans = [], currency }) => {
  const { incomes, outgoings, interests } = calculateSummary(movements, loans);

  return (
    <div className={styles.summary}>
      <p className={styles.summary__label}>Доход</p>
      <p className={`${styles.summary__value} ${styles["summary__value--in"]}`}>
        {formatCurrency(incomes, currency)}
      </p>

      <p className={styles.summary__label}>Растраты</p>
      <p
        className={`${styles.summary__value} ${styles["summary__value--out"]}`}
      >
        {formatCurrency(outgoings, currency)}
      </p>

      <p className={styles.summary__label}>Проценты</p>
      <p
        className={`${styles.summary__value} ${styles["summary__value--interest"]}`}
      >
        {formatCurrency(interests, currency)}
      </p>
    </div>
  );
};
