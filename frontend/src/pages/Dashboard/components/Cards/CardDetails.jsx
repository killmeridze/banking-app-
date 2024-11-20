import styles from "./Cards.module.css";
import { formatCurrency } from "../../utils/formatters";

export const CardDetails = ({ card }) => {
  if (!card) return null;

  return (
    <div className={styles.card_details}>
      <h3>Детали карты</h3>
      <div className={styles.card_info_grid}>
        <div className={styles.info_item}>
          <span>Номер карты</span>
          <p>{card.number.replace(/(\d{4})/g, "$1 ")}</p>
        </div>
        <div className={styles.info_item}>
          <span>Баланс</span>
          <p>{formatCurrency(card.balance, card.currency)}</p>
        </div>
        <div className={styles.info_item}>
          <span>Валюта</span>
          <p>{card.currency}</p>
        </div>
        <div className={styles.info_item}>
          <span>Срок действия</span>
          <p>{card.expiryDate}</p>
        </div>
      </div>
    </div>
  );
};
