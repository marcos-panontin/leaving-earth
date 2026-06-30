import { motion } from 'framer-motion';
import type { FixedLocationDefinition } from '@/engine/types';
import { spacecraftImageForId } from '@/utils/spacecraftVisuals';
import styles from './LocationCard.module.css';

interface LocationCardProps {
  location: FixedLocationDefinition;
  spacecraft?: Array<{ id: string; name: string }>;
  selected?: boolean;
  onClick?: () => void;
}

export function LocationCard({ location, spacecraft = [], selected, onClick }: LocationCardProps) {
  const visibleTokens = spacecraft.slice(0, 4);
  const hiddenCount = Math.max(0, spacecraft.length - visibleTokens.length);

  return (
    <motion.button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      style={{ gridArea: location.gridArea, rotate: `${location.rotation ?? 0}deg` }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <img src={location.image} alt={location.name} className={styles.image} />
      <span className={styles.label}>{location.name}</span>
      {spacecraft.length > 0 && (
        <div className={styles.tokenRow}>
          {visibleTokens.map((craft) => (
            <img
              key={craft.id}
              src={spacecraftImageForId(craft.id)}
              alt={craft.name}
              className={styles.token}
              title={craft.name}
            />
          ))}
          {hiddenCount > 0 && <span className={styles.more}>+{hiddenCount}</span>}
        </div>
      )}
      {spacecraft.length > 0 && <span className={styles.badge}>{spacecraft.length}</span>}
    </motion.button>
  );
}
