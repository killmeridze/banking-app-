import React, { useState } from "react";
import styles from "./AddCardForm.module.css";
import { CURRENCY_OPTIONS, CURRENCY_SYMBOLS } from "../../../../constants";

export const AddCardForm = ({ onAddCard, onClose }) => {
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0]);
  const cardTypes = [
    { label: "Дебетовая", value: "DEBIT" },
    { label: "Кредитная", value: "CREDIT" },
  ];
  const [cardType, setCardType] = useState(cardTypes[0].value);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError("PIN должен состоять из 4 цифр");
      return;
    }
    setPinError("");
    onAddCard({ currency, cardType, pin });
    onClose();
  };

  return (
    <div className={styles.form_container}>
      <h2>Создание карты</h2>
      <form onSubmit={handleSubmit} className={styles.add_card_form}>
        <div className={styles.form_group}>
          <label>Валюта</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCY_OPTIONS.map((cur) => (
              <option key={cur} value={cur}>
                {cur} ({CURRENCY_SYMBOLS[cur]})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form_group}>
          <label>
            Тип карты{" "}
            <a
              href="https://minfin.com.ua/ua/blogs/easypay111/125897/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.info_link}
            >
              Узнать разницу
            </a>
          </label>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            {cardTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form_group}>
          <label>PIN-код</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 4) {
                setPin(value);
              }
            }}
            placeholder="Введите 4-значный PIN"
            required
            className={`${styles.input} ${pinError ? styles.error_input : ""}`}
          />
          {pinError && <span className={styles.error_message}>{pinError}</span>}
        </div>

        <div className={styles.button_group}>
          <button type="submit" className={styles.submit_btn}>
            Создать
          </button>
          <button type="button" className={styles.cancel_btn} onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
