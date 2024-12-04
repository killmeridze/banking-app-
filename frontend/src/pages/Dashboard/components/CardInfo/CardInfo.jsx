import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CardInfo.module.css";
import {
  formatCurrency,
  maskCardNumber,
  formatExpiryDate,
} from "../../utils/formatters";
import mastercardLogo from "../../../../assets/img/mastercard-logo.svg";
import { AccountDetailsModal } from "../Modals/AccountDetailsModal";
import { Modal } from "../Modals/Modal";

export const CardInfo = ({ card, user }) => {
  const [revealedStates, setRevealedStates] = useState({
    [card.id]: {
      numberRevealed: false,
      cvvRevealed: false,
    },
  });
  const [showCopied, setShowCopied] = useState(false);
  const [showCopiedCvv, setShowCopiedCvv] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setRevealedStates((prev) => ({
      ...prev,
      [card.id]: prev[card.id] || { numberRevealed: false, cvvRevealed: false },
    }));
  }, [card.id]);

  const isNumberRevealed = revealedStates[card.id]?.numberRevealed || false;
  const isCvvRevealed = revealedStates[card.id]?.cvvRevealed || false;

  const handleNumberClick = async () => {
    if (!isNumberRevealed) {
      setRevealedStates((prev) => ({
        ...prev,
        [card.id]: { ...prev[card.id], numberRevealed: true },
      }));
    } else {
      const fullNumber = card.cardNumber
        .replace(/\s/g, "")
        .match(/.{1,4}/g)
        .join(" ");
      await navigator.clipboard.writeText(fullNumber);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const handleCvvClick = async () => {
    if (!isCvvRevealed) {
      setRevealedStates((prev) => ({
        ...prev,
        [card.id]: { ...prev[card.id], cvvRevealed: true },
      }));
    } else {
      await navigator.clipboard.writeText(card.cvv);
      setShowCopiedCvv(true);
      setTimeout(() => setShowCopiedCvv(false), 2000);
    }
  };

  return (
    <div
      className={styles.card_info}
      style={{
        "--card-color": card.cardColor,
        background: `linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.15),
          rgba(255, 255, 255, 0.05)
        )`,
      }}
    >
      <div className={styles.header}>
        <span className={styles.card_type}>
          {card.cardType === "CREDIT" ? "Кредитная карта" : "Дебетовая карта"}
        </span>
        <button
          className={styles.details_btn}
          onClick={() => setShowDetailsModal(true)}
        >
          Подробности
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.info_column}>
          <div className={styles.card_header}>
            <motion.div
              className={styles.number_container}
              onClick={handleNumberClick}
            >
              <motion.span layout>
                {isNumberRevealed
                  ? card.cardNumber.replace(/(.{4})/g, "$1 ").trim()
                  : maskCardNumber(card.cardNumber)}
              </motion.span>
              <AnimatePresence>
                {showCopied && (
                  <motion.div
                    className={styles.copied_tooltip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Скопировано
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <img
              src={mastercardLogo}
              alt="Mastercard"
              className={styles.logo}
            />
          </div>

          <div className={styles.security_info}>
            <div className={styles.expiry}>
              <span>{formatExpiryDate(card.expirationDate)}</span>
            </div>
            <motion.div
              className={`${styles.cvv_container} ${
                isCvvRevealed ? styles.revealed : ""
              }`}
              onClick={handleCvvClick}
            >
              <motion.span layout>
                {isCvvRevealed ? card.cvv : "CVV2"}
              </motion.span>
              <AnimatePresence>
                {showCopiedCvv && (
                  <motion.div
                    className={styles.copied_tooltip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Скопировано
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className={styles.balance_info}>
            <span className={styles.balance_label}>Остаток</span>
            <span className={styles.balance_amount}>
              {formatCurrency(card.balance, card.currency)}
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      >
        <AccountDetailsModal
          user={user}
          account={card}
          onClose={() => setShowDetailsModal(false)}
        />
      </Modal>
    </div>
  );
};
