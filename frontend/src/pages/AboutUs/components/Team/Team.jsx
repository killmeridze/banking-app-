import { teamData } from "../../data/teamData";
import { TeamMember } from "./TeamMember";
import styles from "./Team.module.css";

export const Team = () => {
  return (
    <section className={styles.team}>
      <h2>Наша команда</h2>
      <p className={styles.subtitle}>
        Профессионалы, которые делают Bankist лучше каждый день
      </p>
      <div className={styles.members}>
        {teamData.map((member) => (
          <TeamMember key={member.id} {...member} />
        ))}
      </div>
    </section>
  );
};
