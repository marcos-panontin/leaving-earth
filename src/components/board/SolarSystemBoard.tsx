import { FIXED_LOCATIONS } from '@/data/locations';
import { useGameStore } from '@/store/gameStore';
import { LocationCard } from './LocationCard';
import styles from './SolarSystemBoard.module.css';

export function SolarSystemBoard() {
  const spacecraft = useGameStore((s) => s.state.spacecraft);

  const countAt = (locationId: string) =>
    spacecraft.filter((craft) => craft.locationId === locationId).length;

  return (
    <section className={styles.board}>
      <h2 className={styles.title}>Solar System</h2>
      <div className={styles.grid}>
        {FIXED_LOCATIONS.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            spacecraftCount={countAt(location.id)}
          />
        ))}
      </div>
    </section>
  );
}
