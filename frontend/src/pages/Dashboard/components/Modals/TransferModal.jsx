import React, { useState } from "react";
import styles from "./Modal.module.css";

export const TransferModal = ({ card, onClose, onTransfer }) => {
  const [transferData, setTransferData] = useState({
    cardNumber: "",
    amount: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(transferData.amount);

    if (!transferData.cardNumber || !amount) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    if (amount <= 0) {
      alert("Сумма должна быть больше 0");
      return;
    }

    if (amount > card.balance) {
      alert("Недостаточно средств");
      return;
    }

    onTransfer(transferData.cardNumber, amount);
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <div className={styles.modal_header}>
          <h2>Перевод средств</h2>
          <span className={styles.close} onClick={onClose}>
            &times;
          </span>
        </div>

        <form onSubmit={handleSubmit} className={styles.transfer_form}>
          <div className={styles.form_group}>
            <label>Номер карты получателя</label>
            <input
              type="text"
              value={transferData.cardNumber}
              onChange={(e) =>
                setTransferData((prev) => ({
                  ...prev,
                  cardNumber:
                    e.target.value
                      .replace(/\s/g, "")
                      .match(/.{1,4}/g)
                      ?.join(" ") || "",
                }))
              }
              placeholder="0000 0000 0000 0000"
              maxLength={19}
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
            />
          </div>

          <button type="submit" className={styles.submit_btn}>
            Перевести
          </button>
        </form>
      </div>
    </div>
  );
};
