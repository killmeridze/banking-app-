import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/formatters";
import styles from "./Transactions.module.css";

const TRANSACTION_TYPES = {
  DEPOSIT: {
    icon: "↑",
    label: "Пополнение",
    color: "var(--color-primary)",
  },
  WITHDRAWAL: {
    icon: "↓",
    label: "Списание",
    color: "var(--color-tertiary)",
  },
  TRANSFER: {
    icon: "↔",
    label: "Перевод",
    color: "var(--color-primary)",
    getLabel: (amount) =>
      amount > 0 ? "Входящий перевод" : "Исходящий перевод",
    getIcon: (amount) => (amount > 0 ? "→" : "←"),
    getColor: (amount) =>
      amount > 0 ? "var(--color-primary)" : "var(--color-tertiary)",
  },
  LOAN_ISSUE: {
    icon: "💰",
    label: "Получение кредита",
    color: "var(--color-primary)",
  },
  LOAN_REPAYMENT: {
    icon: "💸",
    label: "Погашение кредита",
    color: "var(--color-tertiary)",
  },
};

export const TransactionsList = ({ transactions = [], currency }) => {
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.transactionDate);
    const dateB = new Date(b.transactionDate);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  return (
    <motion.div
      className={styles.transactions}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.transactions_header}>
        <h3>Транзакции</h3>
        <motion.button
          className={styles.sort_btn}
          onClick={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sortOrder === "desc" ? "↓" : "↑"} Сортировка
        </motion.button>
      </div>

      <div className={styles.transactions_list}>
        <AnimatePresence>
          {sortedTransactions.map((tx, index) => {
            let type = tx.transactionType;
            const txInfo = TRANSACTION_TYPES[type];

            if (!txInfo) {
              console.warn(`Unknown transaction type: ${type}`);
              return null;
            }

            return (
              <motion.div
                key={tx.id}
                className={styles.transaction_row}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.transaction_type}>
                  <span
                    className={styles.icon}
                    style={{
                      color: txInfo.getColor
                        ? txInfo.getColor(tx.amount)
                        : txInfo.color,
                    }}
                  >
                    {txInfo.getIcon ? txInfo.getIcon(tx.amount) : txInfo.icon}
                  </span>
                  <span className={styles.type_text}>
                    {txInfo.getLabel
                      ? txInfo.getLabel(tx.amount)
                      : txInfo.label}
                  </span>
                </div>
                <div className={styles.transaction_date}>
                  {new Date(tx.transactionDate).toLocaleDateString("ru-RU")}
                </div>
                <div
                  className={`${styles.transaction_amount} ${
                    tx.amount > 0 ? styles.positive : styles.negative
                  }`}
                >
                  {formatCurrency(Math.abs(tx.amount), currency)}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
