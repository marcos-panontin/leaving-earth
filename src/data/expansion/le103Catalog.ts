/**
 * LE_1.03 CSV catalog for future expansion work.
 *
 * This file intentionally stays outside the active engine datasets so
 * base-game logic remains stable while we preserve parsed expansion material.
 */

export interface ExpansionAdvancementRow {
  name: string;
  researchCost: number;
  outcomeCards: number;
  requirements: string[];
  unlocks: string[];
}

export interface ExpansionComponentRow {
  code: string;
  name: string;
  mass?: number;
  cost: number;
  thrust?: string;
  seats?: number;
  requiredAdvancement?: string;
}

export interface ExpansionMissionRow {
  name: string;
  points: number;
  tier: 'E' | 'M' | 'H' | 'N' | 'O';
  target: string;
  missionType: string;
}

/** Expansion/extended advancements from LE_1.03 tables (non-core). */
export const LE103_EXPANSION_ADVANCEMENTS: ExpansionAdvancementRow[] = [
  {
    name: 'Proton',
    researchCost: 10,
    outcomeCards: 3,
    requirements: ['Soyuz'],
    unlocks: ['Proton'],
  },
  {
    name: 'Shuttle',
    researchCost: 10,
    outcomeCards: 3,
    requirements: ['Re-Entry', 'Atlas'],
    unlocks: ['Shuttle', 'Daedalus', 'Large Fuel', 'Small Fuel'],
  },
  {
    name: 'Aerobraking',
    researchCost: 10,
    outcomeCards: 3,
    requirements: ['Re-Entry'],
    unlocks: [],
  },
  {
    name: 'Rover',
    researchCost: 3,
    outcomeCards: 5,
    requirements: ['Surveying'],
    unlocks: ['Rover'],
  },
  {
    name: 'Synthesis',
    researchCost: 10,
    outcomeCards: 5,
    requirements: ['Life Support'],
    unlocks: ['Fuel Synthesizer', 'Hydroponics', 'Space Habitat', 'Ground Habitat'],
  },
];

/** Expanded components listed in LE_1.03 CSVs. */
export const LE103_EXPANSION_COMPONENTS: ExpansionComponentRow[] = [
  { code: 'PRO', name: 'Proton', mass: 6, cost: 12, thrust: '70', requiredAdvancement: 'Proton' },
  { code: 'SHU', name: 'Shuttle', mass: 4, cost: 10, thrust: '75', seats: 6, requiredAdvancement: 'Shuttle' },
  { code: 'DEA', name: 'Daedalus', mass: 1, cost: 10, thrust: '22', requiredAdvancement: 'Shuttle' },
  { code: 'LFT', name: 'Large Fuel', mass: 6, cost: 6, requiredAdvancement: 'Shuttle' },
  { code: 'SFT', name: 'Small Fuel', mass: 3, cost: 3, requiredAdvancement: 'Shuttle' },
  { code: 'GAL', name: 'Galileo', mass: 2, cost: 5, requiredAdvancement: 'Surveying' },
  { code: 'EXP', name: 'Explorer', mass: 1, cost: 3, requiredAdvancement: 'Rendezvous' },
  { code: 'ROV', name: 'Rover', mass: 1, cost: 4, requiredAdvancement: 'Rover' },
  { code: 'SPH', name: 'Space Habitat', mass: 9, cost: 20, seats: 20, requiredAdvancement: 'Synthesis' },
  { code: 'GHP', name: 'Ground Habitat', mass: 5, cost: 15, seats: 20, requiredAdvancement: 'Synthesis' },
  { code: 'FUG', name: 'Fuel Synthesizer', mass: 1, cost: 8, requiredAdvancement: 'Synthesis' },
  { code: 'HYD', name: 'Hydroponics', mass: 4, cost: 10, requiredAdvancement: 'Synthesis' },
];

/** Non-core missions (outer planets/occupation/etc.) from LE_1.03-Missions. */
export const LE103_EXPANSION_MISSIONS: ExpansionMissionRow[] = [
  { name: 'Callisto Survey', points: 3, tier: 'N', target: 'CALLISTO', missionType: 'SV' },
  { name: 'Enceladus Survey', points: 3, tier: 'N', target: 'ENCELADUS', missionType: 'SV' },
  { name: 'Ganymede Survey', points: 3, tier: 'N', target: 'GANYMEDE', missionType: 'SV' },
  { name: 'Europa Survey', points: 4, tier: 'N', target: 'EUROPA', missionType: 'SV' },
  { name: 'Io Survey', points: 4, tier: 'N', target: 'IO', missionType: 'SV' },
  { name: 'Jupiter Survey', points: 5, tier: 'N', target: 'JUPITER', missionType: 'SV' },
  { name: 'Jupiter System Survey', points: 5, tier: 'N', target: 'JUPITER', missionType: 'SV/JS' },
  { name: 'Saturn Survey', points: 6, tier: 'N', target: 'SATURN', missionType: 'SV' },
  { name: 'Titan Survey', points: 6, tier: 'N', target: 'TITAN', missionType: 'SV' },
  { name: 'Uranus Survey', points: 9, tier: 'N', target: 'URANUS', missionType: 'SV' },
  { name: 'Neptune Survey', points: 10, tier: 'N', target: 'NEPTUNE', missionType: 'SV' },
  { name: 'Grand Tour', points: 10, tier: 'N', target: 'NEPTUNE', missionType: 'SV/GT' },
  { name: 'Orbital Occupation', points: 0.5, tier: 'O', target: 'EARTH', missionType: 'OC/OR' },
  { name: 'Lunar Occupation', points: 1, tier: 'O', target: 'MOON', missionType: 'OC' },
  { name: 'Mars Occupation', points: 2, tier: 'O', target: 'MARS', missionType: 'OC' },
  { name: 'Venus Occupation', points: 2.5, tier: 'O', target: 'VENUS', missionType: 'OC' },
];
