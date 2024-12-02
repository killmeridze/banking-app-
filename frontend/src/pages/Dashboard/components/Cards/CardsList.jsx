import { useState, useEffect } from "react";
import styles from "./Cards.module.css";
import {
  formatCurrency,
  maskCardNumber,
  formatCardType,
} from "../../utils/formatters";
import { AddCardForm } from "../../components/Forms/AddCardForm";
import { Modal } from "../../components/Modals/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

  return (
    <div className={styles.cards_section}>
      {isLoading ? (
        <div className={styles.loading}>Загрузка карт...</div>
      ) : (
        <>
          <div className={styles.select_card_message}>
            Выберите карту для просмотра операций
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            pagination={{ clickable: true }}
            navigation={true}
            className={styles.swiper}
            slideToClickedSlide={true}
          >
            {cards.map((card) => (
              <SwiperSlide key={card.id}>
                <div
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
              </SwiperSlide>
            ))}

            <SwiperSlide>
              <div
                className={`${styles.card} ${styles.add_card}`}
                onClick={() => setShowAddCardModal(true)}
              >
                + Добавить карту
              </div>
            </SwiperSlide>
          </Swiper>
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
