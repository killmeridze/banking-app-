import React from "react";
import ReactDOM from "react-dom";
import styles from "./AccountDetailsModal.module.css";

export const AccountDetailsModal = ({ isOpen, onClose, user, account }) => {
  if (!isOpen || !user || !account) return null;

  return ReactDOM.createPortal(
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <h2>Реквизиты счета</h2>

        <div className={styles.requisites}>
          <div className={styles.requisite_item}>
            <label>Получатель</label>
            <p>
              <strong>{user.username}</strong>
            </p>
          </div>
          <div className={styles.requisite_item}>
            <label>
              IBAN{" "}
              <span className={styles.tooltip}>
                ⓘ
                <span className={styles.tooltip_text}>
                  Международный номер банковского счета
                </span>
              </span>
            </label>
            <p>
              <strong>{account.iban || "Не указан"}</strong>
            </p>
          </div>
          <div className={styles.requisite_item}>
            <label>РНОКПП/ЕДРПОУ</label>
            <p>
              <strong>{account.rnokpp || "Не указан"}</strong>
            </p>
          </div>
        </div>

        <div className={styles.button_group}>
          <button className={styles.close_btn} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
