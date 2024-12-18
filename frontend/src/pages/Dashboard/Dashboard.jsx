import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { Header } from "./components/Header/Header";
import { CardsList } from "./components/Cards/CardsList";
import { TransferModal } from "./components/Modals/TransferModal";
import { LoanModal } from "./components/Modals/LoanModal";
import { TransactionsList } from "./components/Transactions/TransactionsList";
import { TabsNavigation } from "./components/Tabs/TabsNavigation";
import { CardInfo } from "./components/CardInfo/CardInfo";
import { useDashboard } from "./hooks/useDashboard";
import { Summary } from "./components/Summary/Summary";
import { Modal } from "./components/Modals/Modal";
import { useLogoutTimer } from "./hooks/useLogoutTimer";
import { usePageTitle } from "../../hooks/usePageTitle";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
  usePageTitle("Личный кабинет");
  const navigate = useNavigate();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [isCentered, setIsCentered] = useState(true);
  const {
    userData,
    loading,
    error,
    sortOrder,
    handleTransfer,
    handleLoan,
    handleLoanRepayment,
    handleLogout,
    handleAddCard,
    handleSort,
    transactions,
    activeTab,
    setActiveTab,
    selectedCard,
    setSelectedCard,
  } = useDashboard();

  const [cardsAnimation, animateCards] = useAnimate();
  const [cardDetailsAnimation, animateCardDetails] = useAnimate();

  useLogoutTimer(() => {
    handleLogout();
    navigate("/login");
  });

  const isCardSelected = useMemo(() => !!selectedCard, [selectedCard]);

  const cardSelectHandler = useCallback(
    (card) => {
      setSelectedCard(card);
      animateCards(
        cardsAnimation.current,
        {
          x: "-100%",
          opacity: 0,
        },
        {
          type: "spring",
          stiffness: 80,
          damping: 20,
          duration: 0.6,
        }
      );
      animateCardDetails(
        cardDetailsAnimation.current,
        {
          x: 0,
          opacity: 1,
        },
        {
          type: "spring",
          stiffness: 80,
          damping: 20,
          duration: 0.6,
        }
      );
    },
    [setSelectedCard, animateCardDetails, animateCards]
  );

  useEffect(() => {
    const userId = sessionStorage.getItem("currentUserId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userData?.cards?.length >= 1) {
      setIsCentered(!selectedCard);
      setShowTransferModal(false);
      setShowLoanModal(false);
    }
  }, [userData?.cards, selectedCard]);

  useEffect(() => {
    setActiveTab("overview");
  }, [selectedCard?.id, setActiveTab]);

  useEffect(() => {
    if (activeTab === null) {
      setSelectedCard(null);
    }
  }, [activeTab]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.dashboard}>
      <Header username={userData?.username} onLogout={handleLogout} />

      <motion.main
        className={`${styles.content} ${isCentered ? styles.centered : ""}`}
        initial={false}
      >
        <motion.div
          className={styles.cards_wrapper}
          ref={cardsAnimation}
          initial={isCardSelected ? { x: "-100%" } : { x: 0 }}
        >
          <CardsList
            cards={userData?.cards || []}
            onCardSelect={cardSelectHandler}
            onAddCard={handleAddCard}
            isLoading={loading}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            className={styles.tabs_container}
            ref={cardDetailsAnimation}
            initial={!isCardSelected ? { x: "-100%" } : { x: 0 }}
          >
            {isCardSelected && (
              <>
                <TabsNavigation
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    if (tab === null) {
                      setSelectedCard(null);
                      setActiveTab("overview");
                      animateCards(
                        cardsAnimation.current,
                        {
                          x: 0,
                          opacity: 1,
                        },
                        {
                          type: "spring",
                          stiffness: 80,
                          damping: 20,
                          duration: 0.6,
                        }
                      );
                      animateCardDetails(
                        cardDetailsAnimation.current,
                        {
                          x: "100%",
                          opacity: 0,
                        },
                        {
                          type: "spring",
                          stiffness: 80,
                          damping: 20,
                          duration: 0.6,
                        }
                      );
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                />

                <div className={styles.tab_content}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === "overview" && (
                        <div className={styles.overview_content}>
                          <CardInfo card={selectedCard} user={userData} />
                          <Summary
                            movements={transactions}
                            loans={
                              userData?.loans?.filter(
                                (loan) => loan.card?.id === selectedCard?.id
                              ) || []
                            }
                            currency={selectedCard.currency}
                            cardId={selectedCard.id}
                            cardColor={selectedCard.cardColor}
                          />
                        </div>
                      )}

                      {activeTab === "actions" && (
                        <div className={styles.action_buttons}>
                          <button
                            className={styles.action_btn}
                            onClick={() => setShowTransferModal(true)}
                            style={{ "--card-color": selectedCard.cardColor }}
                          >
                            Перевести деньги
                          </button>
                          <button
                            className={styles.action_btn}
                            onClick={() => setShowLoanModal(true)}
                            style={{ "--card-color": selectedCard.cardColor }}
                            disabled={selectedCard.cardType !== "CREDIT"}
                            title={
                              selectedCard.cardType !== "CREDIT"
                                ? "Только кредитные карты могут иметь кредиты."
                                : "Запросить кредит"
                            }
                          >
                            Запросить кредит
                          </button>
                        </div>
                      )}

                      {activeTab === "transactions" && (
                        <TransactionsList
                          transactions={transactions}
                          currency={selectedCard.currency}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                          cardColor={selectedCard.cardColor}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {showTransferModal && (
        <Modal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
        >
          <TransferModal
            card={selectedCard}
            onClose={() => setShowTransferModal(false)}
            onTransfer={handleTransfer}
          />
        </Modal>
      )}

      {showLoanModal && selectedCard && (
        <Modal isOpen={showLoanModal} onClose={() => setShowLoanModal(false)}>
          <LoanModal
            card={selectedCard}
            loans={userData?.loans || []}
            onClose={() => setShowLoanModal(false)}
            onLoanRequest={handleLoan}
            onRepayLoan={handleLoanRepayment}
          />
        </Modal>
      )}
    </div>
  );
};
