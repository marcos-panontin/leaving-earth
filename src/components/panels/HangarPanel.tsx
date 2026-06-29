import { COMPONENT_BY_ID } from '@/data/components';
import { ASTRONAUT_BY_ID, ASTRONAUT_DEFINITIONS } from '@/data/astronauts';
import { ASTRONAUT_RECRUIT_COST, canAssembleSpacecraft } from '@/engine/actions';
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
  const recruitAstronaut = useGameStore((s) => s.recruitAstronaut);
  const canRecruitAstronaut = useGameStore((s) => s.canRecruitAstronaut);
  const boardAstronaut = useGameStore((s) => s.boardAstronaut);
  const canBoardAstronaut = useGameStore((s) => s.canBoardAstronaut);
  const unboardAstronaut = useGameStore((s) => s.unboardAstronaut);
  const canUnboardAstronaut = useGameStore((s) => s.canUnboardAstronaut);

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

      <h3>Crew</h3>
      <div className={styles.crewRecruitGrid}>
        {ASTRONAUT_DEFINITIONS.map((astronaut) => {
          const check = canRecruitAstronaut(astronaut.id);
          return (
            <button
              key={astronaut.id}
              type="button"
              className={styles.crewRecruitButton}
              disabled={!check.ok}
              title={check.reason}
              onClick={() => recruitAstronaut(astronaut.id)}
            >
              Recruit {astronaut.name} (${ASTRONAUT_RECRUIT_COST})
            </button>
          );
        })}
      </div>

      <ul className={styles.crewList}>
        {state.astronauts.length === 0 && (
          <li className={styles.empty}>No recruited astronauts.</li>
        )}
        {state.astronauts.map((astronaut) => {
          const profile = ASTRONAUT_BY_ID[astronaut.definitionId];
          const craft = astronaut.spacecraftId
            ? state.spacecraft.find((entry) => entry.id === astronaut.spacecraftId)
            : null;
          const canLeave = canUnboardAstronaut(astronaut.instanceId);
          return (
            <li key={astronaut.instanceId}>
              <div>
                <strong>{profile?.name ?? astronaut.definitionId}</strong>
                <p>
                  {astronaut.incapacitated ? 'Incapacitated' : 'Healthy'}
                  {craft ? ` · aboard ${craft.name}` : ' · on Earth'}
                </p>
              </div>
              <div className={styles.crewActions}>
                {craft && (
                  <button
                    type="button"
                    disabled={!canLeave.ok}
                    title={canLeave.reason}
                    onClick={() => unboardAstronaut(astronaut.instanceId)}
                  >
                    Unboard
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

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
            const astronautsOnCraft = state.astronauts.filter(
              (astronaut) => astronaut.spacecraftId === craft.id,
            );
            return (
              <li key={craft.id}>
                <div>
                  <strong>{craft.name}</strong>
                  <p>{components.length} parts · mass {mass} · crew {astronautsOnCraft.length}</p>
                  {astronautsOnCraft.length > 0 && (
                    <p className={styles.crewNames}>
                      {astronautsOnCraft
                        .map((astronaut) => ASTRONAUT_BY_ID[astronaut.definitionId]?.name ?? astronaut.definitionId)
                        .join(', ')}
                    </p>
                  )}
                  <div className={styles.boardActions}>
                    {state.astronauts
                      .filter((astronaut) => !astronaut.spacecraftId && !astronaut.incapacitated)
                      .map((astronaut) => {
                        const check = canBoardAstronaut(astronaut.instanceId, craft.id);
                        return (
                          <button
                            key={`${craft.id}-${astronaut.instanceId}`}
                            type="button"
                            disabled={!check.ok}
                            title={check.reason}
                            onClick={() => boardAstronaut(astronaut.instanceId, craft.id)}
                          >
                            Board {ASTRONAUT_BY_ID[astronaut.definitionId]?.name ?? astronaut.definitionId}
                          </button>
                        );
                      })}
                  </div>
                </div>
                <button type="button" onClick={() => disassemble(craft.id)}>Disassemble</button>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
