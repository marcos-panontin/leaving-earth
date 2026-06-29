import { ADVANCEMENTS } from '@/data/components';
import { COMPONENT_DEFINITIONS } from '@/data/components';
import { canBuyComponent, canResearch } from '@/engine/actions';
import { useGameStore } from '@/store/gameStore';
import { ComponentCard } from '@/components/cards/ComponentCard';
import styles from './ShopPanel.module.css';

export function ShopPanel() {
  const state = useGameStore((s) => s.state);
  const buy = useGameStore((s) => s.buy);
  const research = useGameStore((s) => s.research);

  return (
    <section className={styles.panel}>
      <h2>Research &amp; Procurement</h2>

      <div className={styles.section}>
        <h3>Advancements ($10)</h3>
        <div className={styles.actions}>
          {ADVANCEMENTS.map((advancement) => {
            const check = canResearch(state, advancement.id);
            return (
              <button
                key={advancement.id}
                type="button"
                disabled={!check.ok}
                title={check.reason}
                onClick={() => research(advancement.id)}
              >
                {advancement.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Components</h3>
        <div className={styles.grid}>
          {COMPONENT_DEFINITIONS.filter((c) => c.cost > 0).map((definition) => {
            const check = canBuyComponent(state, definition.id);
            return (
              <div key={definition.id} className={styles.item}>
                <ComponentCard
                  definition={definition}
                  onClick={() => buy(definition.id)}
                  compact
                />
                <button
                  type="button"
                  className={styles.buy}
                  disabled={!check.ok}
                  title={check.reason}
                  onClick={() => buy(definition.id)}
                >
                  Buy
                </button>
                <span className={styles.stock}>Stock: {state.supplyCounts[definition.id] ?? 0}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
