import styles from "./Operations.module.css";
import { Transfer } from "./Transfer";
import { Loan } from "./Loan";
import { CloseAccount } from "./CloseAccount";

export const Operations = ({ onTransfer, onLoan, onClose, username }) => {
  return (
    <div className={styles.operations}>
      <Transfer onTransfer={onTransfer} />
      <Loan onLoan={onLoan} />
      <CloseAccount onClose={onClose} username={username} />
    </div>
  );
};
