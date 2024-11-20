import { useState } from "react";

export const Loan = ({ onLoan }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoan(Number(amount));
    setAmount("");
  };

  return (
    <div className="operation operation--loan">
      <h2>Запросить займ</h2>
      <form className="form form--loan" onSubmit={handleSubmit}>
        <input
          type="number"
          className="form__input form__input--loan-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Сумма"
        />
        <button className="form__btn form__btn--loan">→</button>
      </form>
    </div>
  );
};
