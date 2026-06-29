import type { MissionDefinition } from '@/engine/types';

/** Base game missions. `verified: false` entries need card confirmation. */
export const MISSION_DEFINITIONS: MissionDefinition[] = [
  { id: 'sounding-rocket', name: 'Sounding Rocket', points: 1, difficulty: 'easy', type: 'probe', trigger: 'onTurn', description: 'Working probe or capsule in space.', verified: true },
  { id: 'artificial-satellite', name: 'Artificial Satellite', points: 2, difficulty: 'easy', type: 'probe', trigger: 'onTurn', targetLocation: 'earth-orbit', description: 'Working probe or capsule in Earth Orbit.', verified: true },
  { id: 'man-in-space', name: 'Man in Space', points: 2, difficulty: 'easy', type: 'manned', trigger: 'onTurn', description: 'Astronaut reaches space and returns to Earth alive.', verified: true },
  { id: 'lunar-survey', name: 'Lunar Survey', points: 4, difficulty: 'easy', type: 'survey', trigger: 'onTurn', targetLocation: 'moon', description: 'Reveal the Moon.', verified: true },
  { id: 'man-in-orbit', name: 'Man in Orbit', points: 4, difficulty: 'easy', type: 'manned', trigger: 'onTurn', targetLocation: 'earth-orbit', description: 'Astronaut reaches Earth Orbit and returns alive.', verified: true },
  { id: 'mars-survey', name: 'Mars Survey', points: 5, difficulty: 'easy', type: 'survey', trigger: 'onTurn', targetLocation: 'mars', description: 'Reveal Mars.', verified: true },
  { id: 'venus-survey', name: 'Venus Survey', points: 6, difficulty: 'easy', type: 'survey', trigger: 'onTurn', targetLocation: 'venus', description: 'Reveal Venus.', verified: true },
  { id: 'lunar-lander', name: 'Lunar Lander', points: 6, difficulty: 'medium', type: 'probe', trigger: 'onTurn', targetLocation: 'moon', description: 'Undamaged probe or capsule on the Moon.', verified: true },
  { id: 'space-station', name: 'Space Station', points: 6, difficulty: 'medium', type: 'spaceStation', trigger: 'startOfYear', description: 'Astronaut alive in space at year start.', verified: true },
  { id: 'mars-lander', name: 'Mars Lander', points: 7, difficulty: 'medium', type: 'probe', trigger: 'onTurn', targetLocation: 'mars', description: 'Undamaged probe or capsule on Mars.', verified: true },
  { id: 'lunar-sample-return', name: 'Lunar Sample Return', points: 10, difficulty: 'medium', type: 'sampleReturn', trigger: 'onTurn', targetLocation: 'moon', description: 'Moon sample returned to Earth.', verified: true },
  { id: 'venus-lander', name: 'Venus Lander', points: 11, difficulty: 'medium', type: 'probe', trigger: 'onTurn', targetLocation: 'venus', description: 'Undamaged probe or capsule on Venus.', verified: true },
  { id: 'man-on-the-moon', name: 'Man on the Moon', points: 12, difficulty: 'hard', type: 'manned', trigger: 'onTurn', targetLocation: 'moon', description: 'Astronaut reaches the Moon and returns to Earth alive.', verified: true },
  { id: 'ceres-lander', name: 'Ceres Lander', points: 13, difficulty: 'medium', type: 'probe', trigger: 'onTurn', targetLocation: 'ceres', description: 'Undamaged probe or capsule on Ceres.', verified: false },
  { id: 'phobos-sample-return', name: 'Phobos Sample Return', points: 14, difficulty: 'hard', type: 'sampleReturn', trigger: 'onTurn', targetLocation: 'phobos', description: 'Phobos sample returned to Earth.', verified: false },
  { id: 'lunar-station', name: 'Lunar Station', points: 15, difficulty: 'hard', type: 'spaceStation', trigger: 'startOfYear', targetLocation: 'moon', description: 'Astronaut alive on the Moon at year start.', verified: false },
  { id: 'ceres-sample-return', name: 'Ceres Sample Return', points: 16, difficulty: 'hard', type: 'sampleReturn', trigger: 'onTurn', targetLocation: 'ceres', description: 'Ceres sample returned to Earth.', verified: false },
  { id: 'mars-sample-return', name: 'Mars Sample Return', points: 17, difficulty: 'hard', type: 'sampleReturn', trigger: 'onTurn', targetLocation: 'mars', description: 'Mars sample returned to Earth.', verified: false },
  { id: 'mars-station', name: 'Mars Station', points: 18, difficulty: 'hard', type: 'spaceStation', trigger: 'startOfYear', targetLocation: 'mars', description: 'Astronaut alive on Mars at year start.', verified: false },
  { id: 'man-on-mars', name: 'Man on Mars', points: 20, difficulty: 'hard', type: 'manned', trigger: 'onTurn', targetLocation: 'mars', description: 'Astronaut reaches Mars and returns to Earth alive.', verified: false },
  { id: 'venus-sample-return', name: 'Venus Sample Return', points: 24, difficulty: 'hard', type: 'sampleReturn', trigger: 'onTurn', targetLocation: 'venus', description: 'Venus sample returned to Earth.', verified: false },
  { id: 'venus-station', name: 'Venus Station', points: 22, difficulty: 'hard', type: 'spaceStation', trigger: 'startOfYear', targetLocation: 'venus', description: 'Astronaut alive on Venus at year start.', verified: false },
  { id: 'man-on-venus', name: 'Man on Venus', points: 28, difficulty: 'hard', type: 'manned', trigger: 'onTurn', targetLocation: 'venus', description: 'Astronaut reaches Venus and returns to Earth alive.', verified: false },
  { id: 'extraterrestrial-life', name: 'Extraterrestrial Life', points: 30, difficulty: 'hard', type: 'extraterrestrialLife', trigger: 'onTurn', description: 'Life sample returned to Earth from a location with life.', verified: false },
];

export const MISSION_BY_ID: Record<string, MissionDefinition> = Object.fromEntries(
  MISSION_DEFINITIONS.map((m) => [m.id, m]),
);

export const MISSION_DRAW_COUNTS: Record<string, { easy: number; medium: number; hard: number }> = {
  easy: { easy: 5, medium: 0, hard: 0 },
  normal: { easy: 4, medium: 2, hard: 0 },
  hard: { easy: 3, medium: 3, hard: 2 },
  veryHard: { easy: 1, medium: 4, hard: 4 },
};
