import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AccountDetailsModal.module.css";

export const AccountDetailsModal = ({ user, account, onClose }) => {
  const [showCopiedIban, setShowCopiedIban] = useState(false);
  const [showCopiedRnokpp, setShowCopiedRnokpp] = useState(false);

  const handleCopyClick = async (text, setter) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  if (!user || !account) return null;

  return (
    <div className={styles.account_details}>
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
          <motion.p
            className={styles.copyable}
            onClick={() =>
              handleCopyClick(account.iban || "", setShowCopiedIban)
            }
          >
            <strong>{account.iban || "Не указан"}</strong>
            <AnimatePresence>
              {showCopiedIban && (
                <motion.span
                  className={styles.copied_tooltip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Скопировано
                </motion.span>
              )}
            </AnimatePresence>
          </motion.p>
        </div>
        <div className={styles.requisite_item}>
          <label>РНОКПП/ЕДРПОУ</label>
          <motion.p
            className={styles.copyable}
            onClick={() =>
              handleCopyClick(account.rnokpp || "", setShowCopiedRnokpp)
            }
          >
            <strong>{account.rnokpp || "Не указан"}</strong>
            <AnimatePresence>
              {showCopiedRnokpp && (
                <motion.span
                  className={styles.copied_tooltip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Скопировано
                </motion.span>
              )}
            </AnimatePresence>
          </motion.p>
        </div>
      </div>
      <div className={styles.button_group}>
        <button className={styles.close_btn} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};
