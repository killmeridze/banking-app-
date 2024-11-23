import { useState } from "react";
import styles from "./LoanModal.module.css";
import { formatCurrency } from "../../utils/formatters";

export const LoanModal = ({
  card,
  loans = [],
  onClose,
  onLoanRequest,
  onRepayLoan,
}) => {
  const [amount, setAmount] = useState("");

  const handleLoanRequest = (e) => {
    e.preventDefault();
    const loanAmount = Number(amount);

    if (!loanAmount || loanAmount <= 0) {
      alert("Пожалуйста, введите корректную сумму");
      return;
    }

    onLoanRequest(loanAmount);
    setAmount("");
    onClose();
  };

  return (
    <>
      <div className={styles.modal_header}>
        <h2>Управление кредитами</h2>
      </div>

      <form onSubmit={handleLoanRequest} className={styles.loan_form}>
        <div className={styles.form_group}>
          <label>Сумма кредита ({card.currency})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму"
            min="0"
            step="0.01"
          />
        </div>
        <div className={styles.button_group}>
          <button type="submit" className={styles.submit_btn}>
            Запросить кредит
          </button>
          <button type="button" className={styles.cancel_btn} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </form>

      {loans.length > 0 && (
        <div className={styles.loans_list}>
          <h3>Активные кредиты</h3>
          {loans.map((loan) => (
            <div key={loan.id} className={styles.loan_item}>
              <div className={styles.loan_details}>
                <p>Сумма: {formatCurrency(loan.amount, card.currency)}</p>
                <p>Ставка: {loan.interestRate}%</p>
                <p>
                  Дата выдачи: {new Date(loan.issueDate).toLocaleDateString()}
                </p>
                <p>
                  Срок погашения: {new Date(loan.dueDate).toLocaleDateString()}
                </p>
              </div>
              <button
                className={styles.repay_btn}
                onClick={() => onRepayLoan(loan.id)}
              >
                Погасить
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
