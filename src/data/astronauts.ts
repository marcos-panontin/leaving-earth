import type { AstronautDefinition } from '@/engine/types';

export const ASTRONAUT_DEFINITIONS: AstronautDefinition[] = [
  { id: 'aldrin', name: 'Buzz Aldrin', skill: 'pilot', agency: 'nasa' },
  { id: 'armstrong', name: 'Neil Armstrong', skill: 'pilot', agency: 'nasa' },
  { id: 'collins', name: 'Michael Collins', skill: 'mechanic', agency: 'nasa' },
  { id: 'glenn', name: 'John Glenn', skill: 'pilot', agency: 'nasa' },
  { id: 'grissom', name: 'Virgil Grissom', skill: 'mechanic', agency: 'nasa' },
  { id: 'lovell', name: 'James Lovell', skill: 'pilot', agency: 'nasa' },
  { id: 'shepard', name: 'Alan Shepard', skill: 'pilot', agency: 'nasa' },
  { id: 'walker', name: 'Joseph Walker', skill: 'pilot', agency: 'nasa' },
  { id: 'bykovsky', name: 'Valery Bykovsky', skill: 'pilot', agency: 'okb1' },
  { id: 'feoktistov', name: 'Konstantin Feoktistov', skill: 'doctor', agency: 'okb1' },
  { id: 'gagarin', name: 'Yuri Gagarin', skill: 'pilot', agency: 'okb1' },
  { id: 'komarov', name: 'Vladimir Komarov', skill: 'mechanic', agency: 'okb1' },
  { id: 'tereshkova', name: 'Valentina Tereshkova', skill: 'pilot', agency: 'okb1' },
  { id: 'titov', name: 'Gherman Titov', skill: 'pilot', agency: 'okb1' },
  { id: 'yegorov', name: 'Boris Yegorov', skill: 'doctor', agency: 'okb1' },
];

export const ASTRONAUT_BY_ID: Record<string, AstronautDefinition> = Object.fromEntries(
  ASTRONAUT_DEFINITIONS.map((a) => [a.id, a]),
);
