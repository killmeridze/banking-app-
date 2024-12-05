import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { errorHandler } from "../../../services/errorHandler";
import { calculateSummary } from "../utils/calculations";

export const useDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [loans, setLoans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState({
    incomes: 0,
    outgoings: 0,
    interests: 0,
  });

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem("currentUserId");
      const data = await api.users.getProfile(userId);
      const userLoans = await api.loans.getUserLoans(userId);

      const updatedData = {
        ...data,
        loans: userLoans,
      };

      setUserData(updatedData);
      setLoans(userLoans);
      return updatedData;
    } catch (error) {
      setError(errorHandler.handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (cardId) => {
    try {
      if (!cardId) return;

      const data = await api.transactions.getByCard(cardId);
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  }, []);

  const fetchSummary = useCallback(() => {
    if (transactions && loans && selectedCard) {
      const cardLoans = loans.filter((loan) => loan.cardId === selectedCard.id);
      const calculatedSummary = calculateSummary(
        transactions,
        cardLoans,
        selectedCard.currency,
        api.convert
      );
      setSummary(calculatedSummary);
    }
  }, [transactions, loans, selectedCard]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (selectedCard) {
      fetchTransactions(selectedCard.id);
    }
  }, [selectedCard, fetchTransactions]);

  useEffect(() => {
    fetchSummary();
  }, [transactions, loans, selectedCard, fetchSummary]);

  const handleTransfer = async (transferData) => {
    try {
      await api.transfer(transferData);
      const userData = await fetchUserData();

      if (selectedCard && userData.cards) {
        const updatedCard = userData.cards.find(
          (card) => card.id === selectedCard.id
        );
        if (updatedCard) {
          setSelectedCard(updatedCard);
        }
      }

      if (selectedCard) {
        await fetchTransactions(selectedCard.id);
      }
      return { success: true };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error || errorHandler.handleApiError(error);
      return { success: false, error: errorMessage };
    }
  };

  const handleLoanRequest = async (amount, cardId) => {
    try {
      const userId = sessionStorage.getItem("currentUserId");
      if (!userId || !cardId) {
        throw new Error("Missing user or card data");
      }

      await api.loans.request(userId, cardId, amount);
      const userData = await fetchUserData();

      if (selectedCard && userData.cards) {
        const updatedCard = userData.cards.find(
          (card) => card.id === selectedCard.id
        );
        if (updatedCard) {
          setSelectedCard(updatedCard);
        }
      }

      if (selectedCard) {
        await fetchTransactions(selectedCard.id);
      }
    } catch (error) {
      setError(errorHandler.handleApiError(error));
    }
  };

  const handleLoanRepayment = async (loanId, amount) => {
    try {
      await api.loans.repay(loanId, amount);
      const userData = await fetchUserData();

      if (selectedCard && userData.cards) {
        const updatedCard = userData.cards.find(
          (card) => card.id === selectedCard.id
        );
        if (updatedCard) {
          setSelectedCard(updatedCard);
        }
      }
      if (selectedCard) {
        await fetchTransactions(selectedCard.id);
      }
      setShowLoanModal(false);
    } catch (error) {
      alert(errorHandler.handleApiError(error));
    }
  };

  const handleCloseAccount = async (username, pin) => {
    try {
      await api.users.closeAccount(userData.id, { username, pin });
      return true;
    } catch (error) {
      alert(errorHandler.handleApiError(error));
      return false;
    }
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleLogout = () => {
    sessionStorage.clear();
  };

  const handleAddCard = async (cardData) => {
    try {
      const userId = sessionStorage.getItem("currentUserId");
      await api.users.addCard(userId, cardData);
      await fetchUserData();
    } catch (error) {
      alert(errorHandler.handleApiError(error));
    }
  };

  return {
    userData,
    loading,
    error,
    sortOrder,
    summary,
    showLoanModal,
    setShowLoanModal,
    selectedCard,
    setSelectedCard,
    showAddCardModal,
    setShowAddCardModal,
    loans,
    handleTransfer,
    handleLoan: handleLoanRequest,
    handleLoanRepayment,
    handleCloseAccount,
    handleSort,
    handleLogout,
    handleAddCard,
    transactions,
    activeTab,
    setActiveTab,
  };
};
