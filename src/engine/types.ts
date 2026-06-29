export type ComponentType = 'probe' | 'capsule' | 'rocket' | 'module' | 'other';
export type ComponentClass = 'blue' | 'black' | 'red' | 'green' | 'brown' | 'gray';
export type AstronautSkill = 'mechanic' | 'doctor' | 'pilot';
export type MissionDifficulty = 'easy' | 'medium' | 'hard';
export type MissionType =
  | 'probe'
  | 'survey'
  | 'sampleReturn'
  | 'manned'
  | 'spaceStation'
  | 'extraterrestrialLife';
export type MissionTrigger = 'onTurn' | 'startOfYear';
export type LocationVariantType =
  | 'empty'
  | 'destroyed'
  | 'minerals'
  | 'supplies'
  | 'sickness'
  | 'life'
  | 'alienOrigin';
export type AdvancementId =
  | 'juno'
  | 'atlas'
  | 'soyuz'
  | 'saturn'
  | 'ion'
  | 'rendezvous'
  | 'reentry'
  | 'landing'
  | 'lifeSupport'
  | 'surveying';
export type GamePhase = 'setup' | 'yearStart' | 'playing' | 'turnEnd' | 'yearEnd' | 'gameOver';
export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'veryHard';
export type OutcomeCardType = 'success' | 'minorFailure' | 'majorFailure';

export interface ComponentDefinition {
  id: string;
  name: string;
  type: ComponentType;
  class: ComponentClass;
  mass: number;
  thrust: number;
  cost: number;
  seats: number;
  requiredAdvancement?: AdvancementId;
  hasHeatShield?: boolean;
  isReusable?: boolean;
  supplyUnits?: number;
  expansion?: string;
}

export interface ManeuverDefinition {
  id: string;
  from: string;
  to: string;
  difficulty: number;
  exclamation: boolean;
  aerobraking: boolean;
  hourglasses: number;
  optionalHourglass: boolean;
  solarRadiation: boolean;
  reentry: boolean;
  landing: boolean;
  optionalLanding: boolean;
  slingshot?: string;
  expansion?: string;
}

export interface MissionDefinition {
  id: string;
  name: string;
  points: number;
  difficulty: MissionDifficulty;
  type: MissionType;
  trigger: MissionTrigger;
  targetLocation?: string;
  description: string;
  verified: boolean;
}

export interface LocationVariant {
  id: string;
  type: LocationVariantType;
  label: string;
}

export interface ExplorableLocationDefinition {
  id: string;
  name: string;
  imageUnexplored: string;
  variants: LocationVariant[];
}

export interface FixedLocationDefinition {
  id: string;
  name: string;
  image: string;
  gridArea: string;
  rotation?: number;
}

export interface AdvancementDefinition {
  id: AdvancementId;
  name: string;
  description: string;
  outcomeCount: number;
  researchCost: number;
}

export interface AstronautDefinition {
  id: string;
  name: string;
  skill?: AstronautSkill;
  agency?: string;
}

export interface AgencyDefinition {
  id: string;
  name: string;
  country: string;
  color: string;
}

export interface ComponentInstance {
  instanceId: string;
  definitionId: string;
  damaged: boolean;
  location: 'supply' | 'inventory' | 'spacecraft';
  spacecraftId?: string;
  sampleSourceLocationId?: string;
}

export interface AstronautInstance {
  instanceId: string;
  definitionId: string;
  incapacitated: boolean;
  spacecraftId?: string;
  capsuleInstanceId?: string;
}

export interface Spacecraft {
  id: string;
  name: string;
  locationId: string;
  componentInstanceIds: string[];
  astronautInstanceIds: string[];
  timeTokens: number;
}

export interface ResearchedAdvancement {
  advancementId: AdvancementId;
  outcomeCards: OutcomeCardType[];
  revealedOutcomeCards: OutcomeCardType[];
}

export interface ActiveMission {
  definitionId: string;
  completed: boolean;
  removed: boolean;
}

export interface RevealedLocation {
  locationId: string;
  variantId: string;
  revealed: boolean;
}

export interface GameState {
  phase: GamePhase;
  difficulty: GameDifficulty;
  year: number;
  money: number;
  score: number;
  lostAstronauts: number;
  agencyId: string;
  missions: ActiveMission[];
  revealedLocations: RevealedLocation[];
  inventory: ComponentInstance[];
  astronauts: AstronautInstance[];
  spacecraft: Spacecraft[];
  advancements: ResearchedAdvancement[];
  outcomeDeck: OutcomeCardType[];
  outcomeDiscard: OutcomeCardType[];
  supplyCounts: Record<string, number>;
  log: string[];
}
