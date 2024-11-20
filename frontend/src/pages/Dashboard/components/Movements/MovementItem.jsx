import { formatCurrency } from "../../utils/formatters";

export const MovementItem = ({ movement, currency }) => {
  const type =
    movement.type === "LOAN_ISSUE" || movement.transactionType === "LOAN_ISSUE"
      ? "loan"
      : movement.amount > 0
      ? "deposit"
      : "withdrawal";

  return (
    <div className="movements__row">
      <div className={`movements__type movements__type--${type}`}>{type}</div>
      <div className="movements__date">
        {new Intl.DateTimeFormat("ru-RU").format(
          new Date(movement.transactionDate)
        )}
      </div>
      <div className="movements__value">
        {formatCurrency(movement.amount, currency)}
      </div>
      {(movement.type === "LOAN_ISSUE" ||
        movement.transactionType === "LOAN_ISSUE") && (
        <div className="movements__loan-details">
          Interest Rate: {movement.loanInterestRate}%
        </div>
      )}
    </div>
  );
};
