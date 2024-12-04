import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LoanModal.module.css";
import { formatCurrency } from "../../utils/formatters";
import { useExchangeRates } from "../../../../hooks/useExchangeRates";

export const LoanModal = ({
  card,
  loans = [],
  onClose,
  onLoanRequest,
  onRepayLoan,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [repaymentAmounts, setRepaymentAmounts] = useState({});
  const [repaymentError, setRepaymentError] = useState("");
  const [confirmRepayment, setConfirmRepayment] = useState(null);

  const BASE_MIN_LOAN_AMOUNT = 1000;
  const BASE_MAX_LOAN_AMOUNT = 50000;

  const { convert, rates, loading } = useExchangeRates();

  const MIN_LOAN_AMOUNT = convert(BASE_MIN_LOAN_AMOUNT, "USD", card.currency);
  const MAX_LOAN_AMOUNT = convert(BASE_MAX_LOAN_AMOUNT, "USD", card.currency);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (!rates || loading) return;

    const numValue = Number(value);

    const amountInUSD = convert(numValue, card.currency, "USD");
    const epsilon = 0.000001;

    const BASE_MIN_LOAN_AMOUNT_USD = 1000;
    const BASE_MAX_LOAN_AMOUNT_USD = 50000;

    if (
      amountInUSD < BASE_MIN_LOAN_AMOUNT_USD ||
      amountInUSD > BASE_MAX_LOAN_AMOUNT_USD - epsilon
    ) {
      const minInLocal = convert(
        BASE_MIN_LOAN_AMOUNT_USD,
        "USD",
        card.currency
      );
      const maxInLocal = convert(
        BASE_MAX_LOAN_AMOUNT_USD,
        "USD",
        card.currency
      );

      setError(
        `Сумма кредита должна быть от ${formatCurrency(
          minInLocal,
          card.currency
        )} до ${formatCurrency(maxInLocal, card.currency)}`
      );
    } else {
      setError("");
    }
  };

  const handleRepaymentAmountChange = (loanId, value) => {
    setRepaymentAmounts({
      ...repaymentAmounts,
      [loanId]: value,
    });
  };

  const activeLoans =
    loans?.filter((loan) => {
      const remainingAmount = loan.totalAmount - loan.paidAmount;
      const hasRemainingBalance = Math.abs(remainingAmount) > 0.1;

      return loan.card.id === card.id && (hasRemainingBalance || loan.isActive);
    }) || [];

  const hasAnyActiveLoans =
    loans?.some((loan) => {
      const remainingAmount = loan.totalAmount - loan.paidAmount;
      const hasRemainingBalance = Math.abs(remainingAmount) > 0.1;
      return hasRemainingBalance || loan.isActive;
    }) || false;

  const handleLoanRequest = (e) => {
    e.preventDefault();
    const loanAmount = Number(amount);

    const amountInUSD = convert(loanAmount, card.currency, "USD");

    if (
      amountInUSD < BASE_MIN_LOAN_AMOUNT ||
      amountInUSD > BASE_MAX_LOAN_AMOUNT
    ) {
      const minInLocal = convert(BASE_MIN_LOAN_AMOUNT, "USD", card.currency);
      const maxInLocal = convert(BASE_MAX_LOAN_AMOUNT, "USD", card.currency);

      setError(
        `Сумма кредита (${formatCurrency(
          loanAmount,
          card.currency
        )}) должна быть между ${formatCurrency(
          minInLocal,
          card.currency
        )} и ${formatCurrency(maxInLocal, card.currency)}`
      );
      return;
    }

    onLoanRequest(amountInUSD, card.id);
    setAmount("");
    onClose();
  };

  const handleRepayLoan = (loanId, maxAmount) => {
    const amount = parseFloat(repaymentAmounts[loanId]);

    if (!amount || amount <= 0 || amount > maxAmount) {
      setRepaymentError(
        `Введите корректную сумму от 0 до ${formatCurrency(
          maxAmount,
          card.currency
        )}`
      );
      return;
    }

    if (amount > card.balance) {
      setRepaymentError(
        `Недостаточно средств. Ваш баланс: ${formatCurrency(
          card.balance,
          card.currency
        )}`
      );
      return;
    }

    setConfirmRepayment({ loanId, amount });
  };

  const confirmRepaymentHandler = () => {
    if (confirmRepayment) {
      onRepayLoan(confirmRepayment.loanId, confirmRepayment.amount);
      setConfirmRepayment(null);
      setRepaymentAmounts({});
    }
  };

  return (
    <>
      <div className={styles.modal_header}>
        <h2>Управление кредитами</h2>
      </div>
      <form onSubmit={handleLoanRequest} className={styles.loan_form}>
        <div className={styles.form_group}>
          <label>
            Сумма кредита ({card.currency})
            <span className={styles.loan_limits}>
              от {formatCurrency(MIN_LOAN_AMOUNT, card.currency)} до{" "}
              {formatCurrency(MAX_LOAN_AMOUNT, card.currency)}
            </span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Введите сумму"
            step="0.01"
            className={error ? styles.error_input : ""}
            disabled={hasAnyActiveLoans}
          />
          {hasAnyActiveLoans && (
            <div className={styles.warning_message}>
              У вас уже есть активный кредит
            </div>
          )}
          <AnimatePresence>
            {error && (
              <motion.div
                className={styles.error_message}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={styles.button_group}>
          <button
            type="submit"
            className={styles.submit_btn}
            disabled={hasAnyActiveLoans}
          >
            Запросить кредит
          </button>
          <button type="button" className={styles.cancel_btn} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </form>

      {activeLoans.length > 0 && (
        <div className={styles.loans_list}>
          <h3>Активные кредиты по данной карте</h3>
          {repaymentError && (
            <motion.div
              className={styles.error_message}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {repaymentError}
            </motion.div>
          )}
          {activeLoans.map((loan) => {
            const amountInLocal = convert(loan.amount, "USD", card.currency);
            const interestAmount = amountInLocal * (loan.interestRate / 100);
            const totalAmount = amountInLocal + interestAmount;
            const paidAmountInLocal = convert(
              loan.paidAmount || 0,
              "USD",
              card.currency
            );
            const remainingAmount = totalAmount - paidAmountInLocal;

            return (
              <div key={loan.id} className={styles.loan_item}>
                <div className={styles.loan_details}>
                  <div className={styles.loan_main_info}>
                    <p className={styles.loan_principal}>
                      Основной долг:{" "}
                      {formatCurrency(amountInLocal, card.currency)}
                    </p>
                    <p className={styles.loan_interest}>
                      Проценты ({loan.interestRate}%):{" "}
                      {formatCurrency(interestAmount, card.currency)}
                    </p>
                    <p className={styles.loan_total}>
                      Итого к погашению:{" "}
                      {formatCurrency(totalAmount, card.currency)}
                    </p>
                    <div className={styles.loan_additional_info}>
                      <p>
                        Дата выдачи:{" "}
                        {new Date(loan.issueDate).toLocaleDateString()}
                      </p>
                      <p>
                        Срок погашения:{" "}
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                      <p className={styles.loan_total}>
                        Осталось погасить:{" "}
                        {formatCurrency(remainingAmount, card.currency)}
                      </p>
                    </div>
                  </div>
                  <div className={styles.repayment_controls}>
                    <input
                      type="number"
                      placeholder="Сумма погашения"
                      value={repaymentAmounts[loan.id] || ""}
                      onChange={(e) =>
                        handleRepaymentAmountChange(loan.id, e.target.value)
                      }
                      min="0"
                      max={remainingAmount}
                      className={styles.repayment_input}
                    />
                    <button
                      className={styles.repay_btn}
                      onClick={() => handleRepayLoan(loan.id, remainingAmount)}
                    >
                      Погасить
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {confirmRepayment && (
          <motion.div
            className={styles.confirm_overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.confirm_modal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <p>
                Вы уверены, что хотите погасить{" "}
                {formatCurrency(confirmRepayment.amount, card.currency)}{" "}
                кредита?
              </p>
              <div className={styles.confirm_buttons}>
                <button
                  className={styles.confirm_btn}
                  onClick={confirmRepaymentHandler}
                >
                  Подтвердить
                </button>
                <button
                  className={styles.cancel_btn}
                  onClick={() => setConfirmRepayment(null)}
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoanModal;
