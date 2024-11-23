import { useState, useEffect } from "react";
import styles from "./Cards.module.css";
import {
  formatCurrency,
  maskCardNumber,
  formatCardType,
} from "../../utils/formatters";
import { AddCardForm } from "../../components/Forms/AddCardForm";
import { Modal } from "../../components/Modals/Modal";

export const CardsList = ({
  cards = [],
  onCardSelect,
  onAddCard,
  isLoading,
}) => {
  const [activeCard, setActiveCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const handleCardClick = (card) => {
    if (activeCard === card.id) {
      setActiveCard(null);
      onCardSelect(null);
    } else {
      setActiveCard(card.id);
      onCardSelect(card);
    }
  };

  useEffect(() => {
    setActiveCard(null);
    onCardSelect(null);
  }, [cards.length, onCardSelect]);

  const leftCards = [];
  const rightCards = [];

  cards.forEach((card, index) => {
    if (index % 2 === 0) {
      leftCards.push(card);
    } else {
      rightCards.push(card);
    }
  });

  return (
    <div className={styles.cards_section}>
      {isLoading ? (
        <div className={styles.loading}>Загрузка карт...</div>
      ) : (
        <>
          <div className={styles.select_card_message}>
            Выберите карту для просмотра операций
          </div>

          <div className={styles.cards_wrapper}>
            <div className={styles.left_cards}>
              {leftCards.map((card) => (
                <div
                  key={card.id}
                  className={`${styles.card} ${
                    activeCard === card.id ? styles.active : ""
                  }`}
                  onClick={() => handleCardClick(card)}
                >
                  <div className={styles.card_number}>
                    {maskCardNumber(card.cardNumber)}
                  </div>
                  <div className={styles.card_balance}>
                    {formatCurrency(card.balance, card.currency)}
                  </div>
                  <div className={styles.card_expiry}>
                    Действительна до:{" "}
                    {new Date(card.expirationDate).toLocaleDateString()}
                  </div>
                  <div className={styles.card_type}>
                    {formatCardType(card.cardType)}
                  </div>
                </div>
              ))}
            </div>

            <button
              className={styles.add_card}
              onClick={() => setShowAddCardModal(true)}
            >
              + Добавить карту
            </button>

            <div className={styles.right_cards}>
              {rightCards.map((card) => (
                <div
                  key={card.id}
                  className={`${styles.card} ${
                    activeCard === card.id ? styles.active : ""
                  }`}
                  onClick={() => handleCardClick(card)}
                >
                  <div className={styles.card_number}>
                    {card.cardNumber.replace(/(\d{4})/g, "$1 ")}
                  </div>
                  <div className={styles.card_balance}>
                    {formatCurrency(card.balance, card.currency)}
                  </div>
                  <div className={styles.card_expiry}>
                    Действительна до:{" "}
                    {new Date(card.expirationDate).toLocaleDateString()}
                  </div>
                  <div className={styles.card_type}>
                    {formatCardType(card.cardType)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
      >
        <AddCardForm
          onAddCard={onAddCard}
          onClose={() => setShowAddCardModal(false)}
        />
      </Modal>
    </div>
  );
};
