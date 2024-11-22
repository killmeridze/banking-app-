import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "./components/Header/Header";
import { CardsList } from "./components/Cards/CardsList";
import { TransferModal } from "./components/Modals/TransferModal";
import { LoanModal } from "./components/Modals/LoanModal";
import { TransactionsList } from "./components/Transactions/TransactionsList";
import { TabsNavigation } from "./components/Tabs/TabsNavigation";
import { CardInfo } from "./components/CardInfo/CardInfo";
import { useDashboard } from "./hooks/useDashboard";
import { Summary } from "./components/Summary/Summary";
import { useLogoutTimer } from "./hooks/useLogoutTimer";
import { usePageTitle } from "../../hooks/usePageTitle";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
  usePageTitle("Личный кабинет");
  const navigate = useNavigate();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isCentered, setIsCentered] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
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
  } = useDashboard();

  useLogoutTimer(() => {
    handleLogout();
    navigate("/login");
  });

  useEffect(() => {
    const userId = sessionStorage.getItem("currentUserId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userData?.cards?.length >= 1) {
      setIsCentered(!selectedCard);
    }
  }, [userData?.cards, selectedCard]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.dashboard}>
      <Header username={userData?.username} onLogout={handleLogout} />

      <motion.main
        className={`${styles.content} ${isCentered ? styles.centered : ""}`}
        initial={false}
        animate={{
          marginTop: isCentered ? "20vh" : "0",
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.5,
          },
        }}
      >
        <CardsList
          cards={userData?.cards || []}
          onCardSelect={setSelectedCard}
          onAddCard={handleAddCard}
          isLoading={loading}
        />

        {selectedCard && (
          <div className={styles.tabs_container}>
            <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            <div className={styles.tab_content}>
              {activeTab === "overview" && (
                <div className={styles.overview_content}>
                  <CardInfo card={selectedCard} user={userData} />
                  <Summary
                    movements={selectedCard.transactions || []}
                    loans={userData?.loans || []}
                    currency={selectedCard.currency}
                  />
                </div>
              )}

              {activeTab === "actions" && (
                <div className={styles.action_buttons}>
                  <button
                    className={styles.action_btn}
                    onClick={() => setShowTransferModal(true)}
                  >
                    Перевести деньги
                  </button>
                  <button
                    className={styles.action_btn}
                    onClick={() => setShowLoanModal(true)}
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
                  transactions={selectedCard.transactions}
                  currency={selectedCard.currency}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              )}
            </div>
          </div>
        )}
      </motion.main>

      {showTransferModal && (
        <TransferModal
          card={selectedCard}
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransfer}
        />
      )}

      {showLoanModal && (
        <LoanModal
          card={selectedCard}
          loans={userData?.loans}
          onClose={() => setShowLoanModal(false)}
          onLoanRequest={handleLoan}
          onRepayLoan={handleLoanRepayment}
        />
      )}
    </div>
  );
};
