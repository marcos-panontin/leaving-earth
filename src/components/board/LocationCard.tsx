import { motion } from 'framer-motion';
import type { FixedLocationDefinition } from '@/engine/types';
import styles from './LocationCard.module.css';

interface LocationCardProps {
  location: FixedLocationDefinition;
  spacecraftCount?: number;
  selected?: boolean;
  onClick?: () => void;
}

export function LocationCard({ location, spacecraftCount = 0, selected, onClick }: LocationCardProps) {
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
      {spacecraftCount > 0 && <span className={styles.badge}>{spacecraftCount}</span>}
    </motion.button>
  );
}
