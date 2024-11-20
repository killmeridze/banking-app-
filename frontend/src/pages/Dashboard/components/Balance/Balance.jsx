import { formatCurrency } from "../../utils/formatters";
import styles from "./Balance.module.css";

export const Balance = ({ balance, currency, card }) => (
  <div className={styles.balance}>
    <div>
      <p className={styles.balance__label}>
        Текущий баланс
        <span className={styles.balance__date}>
          {new Date().toLocaleDateString()}
        </span>
      </p>
      <p className={styles.balance__value}>
        {formatCurrency(balance, currency)}
      </p>
    </div>
    {card && (
      <div className={styles.card_info}>
        <p>Номер карты: {card.number}</p>
        <p>Срок действия: {card.expiryDate}</p>
      </div>
    )}
  </div>
);
