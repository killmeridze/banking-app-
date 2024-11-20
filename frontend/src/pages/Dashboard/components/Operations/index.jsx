import { Transfer } from "./Transfer";
import { Loan } from "./Loan";
import { CloseAccount } from "./CloseAccount";

export const Operations = ({ onTransfer, onLoan, onClose, username }) => {
  return (
    <div className="operations-container">
      <Transfer onTransfer={onTransfer} />
      <Loan onLoan={onLoan} />
      <CloseAccount onClose={onClose} username={username} />
    </div>
  );
};
