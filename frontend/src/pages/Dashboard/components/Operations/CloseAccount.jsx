import { useState } from "react";

export const CloseAccount = ({ onClose, username }) => {
  const [closeData, setCloseData] = useState({
    username: "",
    pin: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(closeData.username, closeData.pin);
    setCloseData({ username: "", pin: "" });
  };

  return (
    <div className="operation operation--close">
      <h2>Закрыть счет</h2>
      <form className="form form--close" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form__input form__input--user"
          value={closeData.username}
          onChange={(e) =>
            setCloseData((prev) => ({ ...prev, username: e.target.value }))
          }
          placeholder="Имя пользователя"
        />
        <input
          type="password"
          className="form__input form__input--pin"
          maxLength={6}
          value={closeData.pin}
          onChange={(e) =>
            setCloseData((prev) => ({ ...prev, pin: e.target.value }))
          }
          placeholder="PIN"
        />
        <button className="form__btn form__btn--close">→</button>
      </form>
    </div>
  );
};
