import { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import styles from "./Transactions.module.css";

export const TransactionsList = ({ transactions = [], currency }) => {
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.transactionDate);
    const dateB = new Date(b.transactionDate);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className={styles.transactions}>
      <div className={styles.transactions_header}>
        <h3>Транзакции</h3>
        <button
          className={styles.sort_btn}
          onClick={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }
        >
          {sortOrder === "desc" ? "↓" : "↑"} SORT
        </button>
      </div>

      <div className={styles.transactions_list}>
        {sortedTransactions.map((tx) => (
          <div key={tx.id} className={styles.transaction_row}>
            <div className={styles.transaction_type}>
              {tx.transactionType === "DEPOSIT" && "↑ Пополнение"}
              {tx.transactionType === "WITHDRAWAL" && "↓ Списание"}
              {tx.transactionType === "TRANSFER" && "↔ Перевод"}
              {tx.transactionType === "LOAN_ISSUE" && "💰 Получение кредита"}
              {tx.transactionType === "LOAN_REPAYMENT" &&
                "💸 Погашение кредита"}
            </div>
            <div className={styles.transaction_date}>
              {new Date(tx.transactionDate).toLocaleDateString()}
            </div>
            <div
              className={`${styles.transaction_amount} ${
                tx.amount > 0 ? styles.positive : styles.negative
              }`}
            >
              {formatCurrency(tx.amount, currency)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
