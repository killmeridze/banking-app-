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

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem("currentUserId");
      const data = await api.users.getProfile(userId);
      console.log("Fetched user data:", data);
      setUserData(data);

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

  const handleTransfer = async (cardNumber, amount) => {
    try {
      await api.users.transfer({
        fromId: selectedCard.id,
        cardNumber,
        amount,
      });
      fetchUserData();
    } catch (error) {
      alert(errorHandler.handleApiError(error));
    }
  };

  const handleLoanRequest = async (amount) => {
    try {
      const userId = sessionStorage.getItem("currentUserId");
      if (!userId || !selectedCard) {
        throw new Error("Missing user or card data");
      }

      await api.loans.request(userId, selectedCard.id, amount);
      await fetchUserData();
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
    handleTransfer,
    handleLoan: handleLoanRequest,
    handleCloseAccount,
    handleSort,
    handleLogout,
    handleAddCard,
  };
};
