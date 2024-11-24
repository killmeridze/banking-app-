import { useState, useEffect } from "react";
import { api } from "../services/api";

export const useExchangeRates = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await api.exchangeRates.getRates();
        if (!data || !data.rates) {
          throw new Error("Invalid exchange rates data");
        }
        setRates(data.rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const convert = (amount, from, to) => {
    if (!rates || !rates[from] || !rates[to]) {
      return amount;
    }
    return (amount * rates[to]) / rates[from];
  };

  return { rates, loading, error, convert };
};
