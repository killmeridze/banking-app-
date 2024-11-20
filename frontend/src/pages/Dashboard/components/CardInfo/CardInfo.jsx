import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CardInfo.module.css";
import {
  formatCurrency,
  maskCardNumber,
  maskCVV,
  formatExpiryDate,
} from "../../utils/formatters";
import mastercardLogo from "../../../../assets/img/mastercard-logo.svg";

export const CardInfo = ({ card }) => {
  const [isNumberRevealed, setIsNumberRevealed] = useState(false);
  const [isCvvRevealed, setIsCvvRevealed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleNumberClick = async () => {
    const fullNumber = card.cardNumber
      .replace(/\s/g, "")
      .match(/.{1,4}/g)
      .join(" ");
    await navigator.clipboard.writeText(fullNumber);
    setIsNumberRevealed(true);
    setShowCopied(true);
    setTimeout(() => {
      setIsNumberRevealed(false);
      setShowCopied(false);
    }, 2000);
  };

  return (
    <div className={styles.card_info}>
      <div className={styles.header}>
        <img src={mastercardLogo} alt="Mastercard" className={styles.logo} />
        <span className={styles.balance}>
          {formatCurrency(card.balance, card.currency)}
        </span>
      </div>

      <div className={styles.details}>
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

        <div className={styles.security_info}>
          <span className={styles.expiry}>
            {formatExpiryDate(card.expirationDate)}
          </span>

          <motion.div
            className={styles.cvv_container}
            onClick={() => setIsCvvRevealed(!isCvvRevealed)}
          >
            <span className={styles.cvv_label}>CVV2</span>
            <motion.span layout>
              {isCvvRevealed ? card.cvv : maskCVV(card.cvv)}
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
