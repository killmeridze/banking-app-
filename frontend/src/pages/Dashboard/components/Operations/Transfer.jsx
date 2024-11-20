import { useState } from "react";

export const Transfer = ({ onTransfer }) => {
  const [transferData, setTransferData] = useState({
    cardNumber: "",
    amount: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onTransfer(transferData.cardNumber, Number(transferData.amount));
    setTransferData({ cardNumber: "", amount: "" });
  };

  return (
    <div className="operation operation--transfer">
      <h2>Перевести деньги</h2>
      <form className="form form--transfer" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form__input form__input--to"
          value={transferData.cardNumber}
          onChange={(e) =>
            setTransferData((prev) => ({ ...prev, cardNumber: e.target.value }))
          }
          placeholder="Номер карты"
        />
        <input
          type="number"
          className="form__input form__input--amount"
          value={transferData.amount}
          onChange={(e) =>
            setTransferData((prev) => ({ ...prev, amount: e.target.value }))
          }
          placeholder="Сумма"
        />
        <button className="form__btn form__btn--transfer">→</button>
      </form>
    </div>
  );
};
