import { COMPONENT_BY_ID } from '@/data/components';
import { canAssembleSpacecraft } from '@/engine/actions';
import { useGameStore } from '@/store/gameStore';
import { ComponentCard } from '@/components/cards/ComponentCard';
import styles from './HangarPanel.module.css';

export function HangarPanel() {
  const state = useGameStore((s) => s.state);
  const selectedInventoryIds = useGameStore((s) => s.selectedInventoryIds);
  const toggleInventorySelection = useGameStore((s) => s.toggleInventorySelection);
  const assemble = useGameStore((s) => s.assemble);
  const disassemble = useGameStore((s) => s.disassemble);
  const clearSelection = useGameStore((s) => s.clearSelection);

  const inventory = state.inventory.filter((item) => item.location === 'inventory');
  const assembleCheck = canAssembleSpacecraft(state, selectedInventoryIds);

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2>Hangar</h2>
        <div className={styles.headerActions}>
          <button type="button" onClick={clearSelection} disabled={selectedInventoryIds.length === 0}>
            Clear
          </button>
          <button type="button" onClick={assemble} disabled={!assembleCheck.ok} title={assembleCheck.reason}>
            Assemble Craft
          </button>
        </div>
      </div>

      <h3>Inventory ({inventory.length})</h3>
      <div className={styles.grid}>
        {inventory.length === 0 && <p className={styles.empty}>No components yet. Buy equipment from the shop.</p>}
        {inventory.map((item) => {
          const def = COMPONENT_BY_ID[item.definitionId];
          if (!def) return null;
          return (
            <ComponentCard
              key={item.instanceId}
              definition={def}
              selected={selectedInventoryIds.includes(item.instanceId)}
              damaged={item.damaged}
              onClick={() => toggleInventorySelection(item.instanceId)}
            />
          );
        })}
      </div>

      <h3>Spacecraft on Earth</h3>
      <ul className={styles.craftList}>
        {state.spacecraft.filter((s) => s.locationId === 'earth').length === 0 && (
          <li className={styles.empty}>No assembled spacecraft.</li>
        )}
        {state.spacecraft
          .filter((s) => s.locationId === 'earth')
          .map((craft) => {
            const components = craft.componentInstanceIds
              .map((id) => state.inventory.find((item) => item.instanceId === id))
              .filter(Boolean);
            const mass = components.reduce((sum, item) => sum + (COMPONENT_BY_ID[item!.definitionId]?.mass ?? 0), 0);
            return (
              <li key={craft.id}>
                <div>
                  <strong>{craft.name}</strong>
                  <p>{components.length} parts · mass {mass}</p>
                </div>
                <button type="button" onClick={() => disassemble(craft.id)}>Disassemble</button>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
