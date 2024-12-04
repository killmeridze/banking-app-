import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, maskCardNumber } from "../../utils/formatters";
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

const TransactionInfo = ({ transaction }) => {
  if (transaction.transactionType === "TRANSFER") {
    const isOutgoing = transaction.amount < 0;
    const cardNumber = isOutgoing
      ? transaction.toCardNumber
      : transaction.fromCardNumber;
    const formattedNumber = maskCardNumber(cardNumber);

    return (
      <div className={styles.transaction_details}>
        <span className={styles.card_number}>
          {isOutgoing ? "Получатель: " : "Отправитель: "}
          {formattedNumber}
        </span>
      </div>
    );
  }
  return null;
};

export const TransactionsList = ({
  transactions = [],
  currency,
  cardColor,
}) => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (selectedMonth !== "all") {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        const txMonth = `${txDate.getFullYear()}-${String(
          txDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return txMonth === selectedMonth;
      });
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.transactionDate);
      const dateB = new Date(b.transactionDate);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [transactions, selectedMonth, sortOrder]);

  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach((tx) => {
      const date = new Date(tx.transactionDate);
      months.add(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      );
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  return (
    <motion.div
      className={styles.transactions}
      style={{
        "--card-color": cardColor,
        background: `linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.15),
          rgba(255, 255, 255, 0.05)
        )`,
      }}
    >
      <div className={styles.transactions_header}>
        <h3>Транзакции</h3>
        <div className={styles.filters}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={styles.month_select}
          >
            <option value="all">Все месяцы</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(month).toLocaleString("ru", {
                  month: "long",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
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
      </div>

      <div className={styles.transactions_list}>
        <AnimatePresence>
          {filteredAndSortedTransactions.map((tx, index) => {
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
                <div className={styles.transaction_info}>
                  <div className={styles.transaction_main}>
                    <span className={styles.transaction_icon}>
                      {txInfo.getIcon ? txInfo.getIcon(tx.amount) : txInfo.icon}
                    </span>
                    <div className={styles.transaction_text}>
                      <span className={styles.transaction_label}>
                        {txInfo.getLabel
                          ? txInfo.getLabel(tx.amount)
                          : txInfo.label}
                      </span>
                      {tx.transactionType === "TRANSFER" && (
                        <span className={styles.card_number}>
                          {tx.amount < 0 ? "Получатель: " : "Отправитель: "}
                          {maskCardNumber(
                            tx.amount < 0 ? tx.toCardNumber : tx.fromCardNumber
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.transaction_details}>
                    <span className={styles.transaction_date}>
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`${styles.transaction_amount} ${
                        tx.amount > 0 ? styles.positive : styles.negative
                      }`}
                    >
                      {formatCurrency(Math.abs(tx.amount), currency)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
