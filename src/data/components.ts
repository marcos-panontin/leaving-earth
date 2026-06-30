import type {
  AdvancementDefinition,
  AdvancementId,
  ComponentDefinition,
} from '@/engine/types';

/** Core-game advancements currently active in gameplay. */
export const CORE_ADVANCEMENTS: AdvancementDefinition[] = [
  { id: 'juno', name: 'Juno Rockets', description: 'Use Juno rockets.', outcomeCount: 3, researchCost: 10 },
  { id: 'atlas', name: 'Atlas Rockets', description: 'Use Atlas rockets.', outcomeCount: 3, researchCost: 10 },
  { id: 'soyuz', name: 'Soyuz Rockets', description: 'Use Soyuz rockets.', outcomeCount: 3, researchCost: 10 },
  { id: 'saturn', name: 'Saturn Rockets', description: 'Use Saturn rockets.', outcomeCount: 3, researchCost: 10 },
  { id: 'ion', name: 'Ion Thrusters', description: 'Use ion thrusters.', outcomeCount: 3, researchCost: 10 },
  { id: 'rendezvous', name: 'Rendezvous', description: 'Dock and separate spacecraft.', outcomeCount: 3, researchCost: 10 },
  { id: 'reentry', name: 'Re-entry', description: 'Enter atmosphere without burning up capsules.', outcomeCount: 3, researchCost: 10 },
  { id: 'landing', name: 'Landing', description: 'Land where parachutes are ineffective.', outcomeCount: 3, researchCost: 10 },
  { id: 'lifeSupport', name: 'Life Support', description: 'Keep astronauts alive between years.', outcomeCount: 3, researchCost: 10 },
  { id: 'surveying', name: 'Surveying', description: 'Survey unexplored locations from orbit.', outcomeCount: 1, researchCost: 10 },
];

export const ADVANCEMENTS = CORE_ADVANCEMENTS;

export const ADVANCEMENT_BY_ID: Record<AdvancementId, AdvancementDefinition> = Object.fromEntries(
  ADVANCEMENTS.map((a) => [a.id, a]),
) as Record<AdvancementId, AdvancementDefinition>;

export const COMPONENT_SUPPLY_LIMITS: Record<string, number> = {
  juno: 18,
  atlas: 15,
  soyuz: 12,
  saturn: 11,
  ion: 6,
  aldrin: 3,
  apollo: 5,
  eagle: 5,
  vostok: 5,
  probe: 8,
  supplies1: 12,
  supplies5: 3,
  sample: 999,
  astronaut: 15,
};

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  { id: 'probe', name: 'Probe', type: 'probe', class: 'blue', mass: 1, thrust: 0, cost: 2, seats: 0 },
  { id: 'eagle', name: 'Eagle', type: 'capsule', class: 'blue', mass: 1, thrust: 0, cost: 4, seats: 2 },
  { id: 'vostok', name: 'Vostok', type: 'capsule', class: 'black', mass: 2, thrust: 0, cost: 2, seats: 1, hasHeatShield: true },
  { id: 'apollo', name: 'Apollo', type: 'capsule', class: 'black', mass: 3, thrust: 0, cost: 4, seats: 3, hasHeatShield: true },
  { id: 'aldrin', name: 'Aldrin', type: 'capsule', class: 'blue', mass: 3, thrust: 0, cost: 4, seats: 8 },
  { id: 'juno', name: 'Juno', type: 'rocket', class: 'red', mass: 1, thrust: 4, cost: 1, seats: 0, requiredAdvancement: 'juno' },
  { id: 'atlas', name: 'Atlas', type: 'rocket', class: 'red', mass: 4, thrust: 27, cost: 5, seats: 0, requiredAdvancement: 'atlas' },
  { id: 'soyuz', name: 'Soyuz', type: 'rocket', class: 'red', mass: 9, thrust: 80, cost: 8, seats: 0, requiredAdvancement: 'soyuz' },
  { id: 'saturn', name: 'Saturn', type: 'rocket', class: 'red', mass: 20, thrust: 200, cost: 15, seats: 0, requiredAdvancement: 'saturn' },
  { id: 'ion', name: 'Ion', type: 'rocket', class: 'blue', mass: 1, thrust: 5, cost: 10, seats: 0, requiredAdvancement: 'ion', isReusable: true },
  { id: 'supplies1', name: 'Supplies', type: 'other', class: 'green', mass: 1, thrust: 0, cost: 1, seats: 0, supplyUnits: 1 },
  { id: 'supplies5', name: 'Supplies 5×', type: 'other', class: 'green', mass: 5, thrust: 0, cost: 5, seats: 0, supplyUnits: 5 },
  { id: 'sample', name: 'Sample', type: 'other', class: 'brown', mass: 1, thrust: 0, cost: 0, seats: 0 },
];

export const COMPONENT_BY_ID: Record<string, ComponentDefinition> = Object.fromEntries(
  COMPONENT_DEFINITIONS.map((c) => [c.id, c]),
);
