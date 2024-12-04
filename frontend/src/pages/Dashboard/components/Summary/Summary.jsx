import { calculateSummary } from "../../utils/calculations";
import { formatCurrency } from "../../utils/formatters";
import styles from "./Summary.module.css";
import { useExchangeRates } from "../../hooks/useExchangeRates";

export const Summary = ({
  movements = [],
  loans = [],
  currency,
  cardColor,
}) => {
  const { convert } = useExchangeRates();
  const { incomes, outgoings, interests } = calculateSummary(
    movements,
    loans,
    currency,
    convert
  );

  return (
    <div className={styles.summary_container}>
      <div
        className={styles.summary}
        style={{
          "--card-color": cardColor,
          background: `linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.15),
            rgba(255, 255, 255, 0.05)
          )`,
        }}
      >
        <div className={styles.summary_item}>
          <p className={styles.summary__label}>Доход</p>
          <p
            className={`${styles.summary__value} ${styles["summary__value--in"]}`}
          >
            {formatCurrency(incomes, currency)}
          </p>
        </div>

        <div className={styles.summary_item}>
          <p className={styles.summary__label}>Расходы</p>
          <p
            className={`${styles.summary__value} ${styles["summary__value--out"]}`}
          >
            {formatCurrency(outgoings, currency)}
          </p>
        </div>

        <div className={styles.summary_item}>
          <p className={styles.summary__label}>Проценты</p>
          <p
            className={`${styles.summary__value} ${styles["summary__value--interest"]}`}
          >
            {formatCurrency(interests, currency)}
          </p>
        </div>
      </div>
    </div>
  );
};
