import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { errorHandler } from "../../../services/errorHandler";

export const useDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [loans, setLoans] = useState([]);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem("currentUserId");
      const data = await api.users.getProfile(userId);

      const userLoans = await api.loans.getUserLoans(userId);

      console.log("Fetched user data:", data);

      setUserData({
        ...data,
        loans: userLoans,
      });
      setLoans(userLoans);

      if (data?.cards?.length > 0 && !selectedCard) {
        setSelectedCard(data.cards[0]);
      }
    } catch (error) {
      setError(errorHandler.handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [selectedCard]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleTransfer = async (transferData) => {
    try {
      await api.transfer(transferData);
      await fetchUserData();
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

      console.log("Sending loan request:", {
        userId,
        cardId,
        amount,
      });

      await api.loans.request(userId, cardId, amount);
      await fetchUserData();
    } catch (error) {
      setError(errorHandler.handleApiError(error));
    }
  };

  const handleLoanRepayment = async (loanId, amount) => {
    try {
      await api.loans.repay(loanId, amount);
      await fetchUserData();
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
  };
};
