import styles from "./Team.module.css";

export const TeamMember = ({ name, position, description }) => {
  return (
    <div className={styles.member}>
      <div className={styles.content}>
        <h3>{name}</h3>
        <span className={styles.position}>{position}</span>
        <p>{description}</p>
      </div>
    </div>
  );
};
