import { MISSION_DEFINITIONS } from '@/data/missions';
import { useGameStore } from '@/store/gameStore';
import styles from './MissionPanel.module.css';

export function MissionPanel() {
  const missions = useGameStore((s) => s.state.missions);

  return (
    <section className={styles.panel}>
      <h2>Active Missions</h2>
      <ul>
        {missions.map((mission) => {
          const def = MISSION_DEFINITIONS.find((m) => m.id === mission.definitionId);
          if (!def) return null;
          return (
            <li
              key={mission.definitionId}
              className={mission.completed ? styles.done : mission.removed ? styles.removed : ''}
            >
              <div>
                <strong>{def.name}</strong>
                <p>{def.description}</p>
              </div>
              <span className={styles.points}>{def.points}</span>
              {!def.verified && <span className={styles.unverified}>unverified pts</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
