import { useEffect } from 'react';
import { getManeuversFrom } from '@/data/maneuvers';
import { toLocationName } from '@/data/locations';
import { useGameStore } from '@/store/gameStore';
import styles from './ManeuverPanel.module.css';

export function ManeuverPanel() {
  const state = useGameStore((s) => s.state);
  const selectedSpacecraftId = useGameStore((s) => s.selectedSpacecraftId);
  const selectSpacecraft = useGameStore((s) => s.selectSpacecraft);
  const performManeuver = useGameStore((s) => s.performManeuver);
  const canManeuver = useGameStore((s) => s.canManeuver);

  const selectedCraft =
    state.spacecraft.find((craft) => craft.id === selectedSpacecraftId) ?? state.spacecraft[0];

  useEffect(() => {
    if (!selectedSpacecraftId && state.spacecraft.length > 0) {
      selectSpacecraft(state.spacecraft[0].id);
    }
  }, [selectSpacecraft, selectedSpacecraftId, state.spacecraft]);

  const maneuvers = selectedCraft ? getManeuversFrom(selectedCraft.locationId) : [];

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2>Maneuvers</h2>
        <span className={styles.caption}>Phase 1 interaction</span>
      </div>

      <label className={styles.label}>
        Spacecraft
        <select
          value={selectedCraft?.id ?? ''}
          onChange={(event) => selectSpacecraft(event.target.value || null)}
        >
          {state.spacecraft.length === 0 && <option value="">No spacecraft assembled</option>}
          {state.spacecraft.map((craft) => (
            <option key={craft.id} value={craft.id}>
              {craft.name} — {toLocationName(craft.locationId)}
            </option>
          ))}
        </select>
      </label>

      {!selectedCraft && (
        <p className={styles.empty}>Assemble a spacecraft in the Hangar to unlock maneuver options.</p>
      )}

      {selectedCraft && (
        <>
          <p className={styles.craftInfo}>
            Current location: <strong>{toLocationName(selectedCraft.locationId)}</strong>
            {selectedCraft.timeTokens > 0 && ` · in transit (${selectedCraft.timeTokens} time token(s))`}
          </p>
          <ul className={styles.routeList}>
            {maneuvers.length === 0 && (
              <li className={styles.empty}>No legal routes from this location.</li>
            )}
            {maneuvers.map((maneuver) => {
              const check = canManeuver(maneuver.id);
              return (
                <li key={maneuver.id} className={styles.route}>
                  <div className={styles.routeMeta}>
                    <strong>
                      {toLocationName(maneuver.from)} → {toLocationName(maneuver.to)}
                    </strong>
                    <span>
                      {maneuver.exclamation ? 'automatic' : `difficulty ${maneuver.difficulty}`} ·{' '}
                      {maneuver.hourglasses > 0 ? `${maneuver.hourglasses}y transit` : 'same year'}
                    </span>
                    {!maneuver.exclamation && (
                      <span>
                        thrust {check.providedThrust}/{check.requiredThrust} (mass {check.mass})
                      </span>
                    )}
                    {!check.ok && <span className={styles.reason}>{check.reason}</span>}
                  </div>
                  <button
                    type="button"
                    disabled={!check.ok}
                    onClick={() => performManeuver(maneuver.id)}
                  >
                    Execute
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
