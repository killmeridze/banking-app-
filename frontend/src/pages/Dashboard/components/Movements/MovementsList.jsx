import { MovementItem as Movement } from "./MovementItem";
import styles from "./Movements.module.css";

export const MovementsList = ({
  movements = [],
  currency,
  sortOrder,
  onSort,
}) => {
  const sortedMovements = [...movements].sort((a, b) => {
    return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
  });

  return (
    <div className={styles.movements}>
      <div className={styles.movements__header}>
        <button className={styles.btn_sort} onClick={() => onSort()}>
          ↓ СОРТИРОВАТЬ
        </button>
      </div>
      {sortedMovements.map((mov, i) => (
        <Movement key={i} movement={mov} currency={currency} />
      ))}
    </div>
  );
};
