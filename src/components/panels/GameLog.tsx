import { useGameStore } from '@/store/gameStore';
import styles from './GameLog.module.css';

export function GameLog() {
  const log = useGameStore((s) => s.state.log);

  return (
    <section className={styles.panel}>
      <h2>Mission Log</h2>
      <ol>
        {[...log].reverse().map((entry, index) => (
          <li key={`${entry}-${index}`}>{entry}</li>
        ))}
      </ol>
    </section>
  );
}
