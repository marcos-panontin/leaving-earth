import { AGENCIES } from '@/data/agencies';
import { getRemainingMissionPoints } from '@/engine/setup';
import { useGameStore, useGameStatus } from '@/store/gameStore';
import styles from './AgencyPanel.module.css';

export function AgencyPanel() {
  const state = useGameStore((s) => s.state);
  const advanceYear = useGameStore((s) => s.advanceYear);
  const newGame = useGameStore((s) => s.newGame);
  const { gameOver, victory } = useGameStatus();

  const agency = AGENCIES.find((a) => a.id === state.agencyId);
  const remaining = getRemainingMissionPoints(state);

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Space Agency</p>
          <h1 style={{ color: agency?.color }}>{agency?.name}</h1>
        </div>
        <button type="button" className={styles.secondary} onClick={() => newGame(state.difficulty)}>
          New Game
        </button>
      </header>

      <dl className={styles.stats}>
        <div><dt>Year</dt><dd>{state.year}</dd></div>
        <div><dt>Funding</dt><dd>${state.money}</dd></div>
        <div><dt>Score</dt><dd>{state.score}</dd></div>
        <div><dt>Missions left</dt><dd>{remaining} pts</dd></div>
        <div><dt>Lost crew</dt><dd>{state.lostAstronauts}</dd></div>
      </dl>

      {gameOver && (
        <p className={victory ? styles.win : styles.lose}>
          {victory
            ? `Victory! You scored ${state.score}, beating the ${remaining} points still on the table.`
            : `Defeat. You scored ${state.score}; you needed more than ${remaining} points.`}
        </p>
      )}

      <button type="button" className={styles.primary} onClick={advanceYear} disabled={gameOver}>
        End Year
      </button>
    </section>
  );
}
