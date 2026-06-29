import { motion } from 'framer-motion';
import type { ComponentDefinition } from '@/engine/types';
import { componentPlaceholder } from '@/utils/maneuverIcons';
import styles from './ComponentCard.module.css';

interface ComponentCardProps {
  definition: ComponentDefinition;
  selected?: boolean;
  damaged?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function ComponentCard({ definition, selected, damaged, onClick, compact }: ComponentCardProps) {
  return (
    <motion.button
      type="button"
      className={`${styles.card} ${styles[definition.class]} ${selected ? styles.selected : ''} ${damaged ? styles.damaged : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <img
        src={componentPlaceholder(definition.type, definition.name)}
        alt=""
        className={styles.art}
      />
      <div className={styles.meta}>
        <strong>{definition.name}</strong>
        {!compact && (
          <span>
            M{definition.mass}
            {definition.thrust > 0 ? ` · ↑${definition.thrust}` : ''}
            {definition.cost > 0 ? ` · $${definition.cost}` : ''}
          </span>
        )}
      </div>
    </motion.button>
  );
}
