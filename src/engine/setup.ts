import { MISSION_DEFINITIONS, MISSION_DRAW_COUNTS } from '@/data/missions';
import { EXPLORABLE_LOCATIONS } from '@/data/locations';
import { DEFAULT_AGENCY_ID } from '@/data/agencies';
import type { ActiveMission, GameDifficulty, GameState, RevealedLocation } from '@/engine/types';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function drawMissions(difficulty: GameDifficulty): ActiveMission[] {
  const counts = MISSION_DRAW_COUNTS[difficulty];
  const easy = shuffle(MISSION_DEFINITIONS.filter((m) => m.difficulty === 'easy')).slice(0, counts.easy);
  const medium = shuffle(MISSION_DEFINITIONS.filter((m) => m.difficulty === 'medium')).slice(0, counts.medium);
  const hard = shuffle(MISSION_DEFINITIONS.filter((m) => m.difficulty === 'hard')).slice(0, counts.hard);

  return [...easy, ...medium, ...hard].map((mission) => ({
    definitionId: mission.id,
    completed: false,
    removed: false,
  }));
}

function setupExplorableLocations(): RevealedLocation[] {
  return EXPLORABLE_LOCATIONS.map((location) => {
    const variant = shuffle(location.variants)[0];
    return {
      locationId: location.id,
      variantId: variant.id,
      revealed: false,
    };
  });
}

function initialSupplyCounts(): Record<string, number> {
  return {
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
  };
}

export function createInitialState(difficulty: GameDifficulty = 'hard'): GameState {
  return {
    phase: 'playing',
    difficulty,
    year: 1956,
    money: 25,
    score: 0,
    lostAstronauts: 0,
    agencyId: DEFAULT_AGENCY_ID,
    missions: drawMissions(difficulty),
    revealedLocations: setupExplorableLocations(),
    inventory: [],
    astronauts: [],
    spacecraft: [],
    advancements: [],
    supplyCounts: initialSupplyCounts(),
    log: ['Welcome to Leaving Earth. The Space Race begins in 1956.'],
  };
}

export function getRemainingMissionPoints(state: GameState): number {
  return state.missions
    .filter((m) => !m.completed && !m.removed)
    .reduce((sum, m) => {
      const def = MISSION_DEFINITIONS.find((d) => d.id === m.definitionId);
      return sum + (def?.points ?? 0);
    }, 0);
}

export function isSoloVictory(state: GameState): boolean {
  return state.score > getRemainingMissionPoints(state);
}

export function isGameOver(state: GameState): boolean {
  if (state.year > 1976) return true;
  const activeMissions = state.missions.filter((m) => !m.completed && !m.removed);
  return activeMissions.length === 0;
}
