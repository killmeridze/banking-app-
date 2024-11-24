import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TransferModal.module.css";

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "");
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(" ").substr(0, 19);
};

const isValidCardNumber = (number) => {
  const regex = /^(\d{4}\s){3}\d{4}$/;
  return regex.test(number);
};

export const TransferModal = ({ card, onClose, onTransfer }) => {
  const [transferData, setTransferData] = useState({
    cardNumber: "",
    amount: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateForm = () => {
    if (!transferData.cardNumber && !transferData.amount) {
      setError("Пожалуйста, заполните все поля");
      return false;
    }

    if (transferData.cardNumber && !transferData.amount) {
      setError("Пожалуйста, укажите сумму перевода");
      return false;
    }

    if (!transferData.cardNumber && transferData.amount) {
      setError("Пожалуйста, введите номер карты получателя");
      return false;
    }

    const cleanRecipientNumber = transferData.cardNumber.replace(/\s/g, "");
    const cleanSenderNumber = card.cardNumber.replace(/\s/g, "");

    if (cleanRecipientNumber === cleanSenderNumber) {
      setError("Нельзя переводить деньги на ту же карту");
      return false;
    }

    if (
      transferData.cardNumber &&
      !isValidCardNumber(transferData.cardNumber)
    ) {
      setError("Введите корректный номер карты в формате XXXX XXXX XXXX XXXX");
      return false;
    }

    const amount = Number(transferData.amount);
    if (amount <= 0) {
      setError("Сумма должна быть больше 0");
      return false;
    }

    if (amount > card.balance) {
      setError(
        `Недостаточно средств. Доступно: ${card.balance} ${card.currency}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await onTransfer({
        fromCardNumber: card.cardNumber,
        toCardNumber: transferData.cardNumber.replace(/\s/g, ""),
        amount: Number(transferData.amount),
      });
      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <>
      <div className={styles.modal_header}>
        <h2>Перевод средств</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.transfer_form}>
        <div className={styles.form_group}>
          <label>Номер карты получателя</label>
          <input
            type="text"
            value={transferData.cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setTransferData((prev) => ({
                ...prev,
                cardNumber: formatted,
              }));
            }}
            onBlur={() => {
              if (
                transferData.cardNumber &&
                !isValidCardNumber(transferData.cardNumber)
              ) {
                setError(
                  "Введите корректный номер карты в формате XXXX XXXX XXXX XXXX"
                );
              }
            }}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className={error ? styles.error_input : ""}
          />
        </div>

        <div className={styles.form_group}>
          <label>Сумма перевода ({card.currency})</label>
          <input
            type="number"
            value={transferData.amount}
            onChange={(e) =>
              setTransferData((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
            placeholder="Введите сумму"
            min="0"
            step="0.01"
            className={error ? styles.error_input : ""}
          />
          <AnimatePresence>
            {error && (
              <motion.div
                className={styles.error_message}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.button_group}>
          <button type="submit" className={styles.submit_btn}>
            Перевести
          </button>
          <button type="button" className={styles.cancel_btn} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </form>
    </>
  );
};
