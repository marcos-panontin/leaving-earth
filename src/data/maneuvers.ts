import { manuevers } from '@/utils/manuevers.js';
import { toLocationId } from '@/data/locations';
import type { ManeuverDefinition } from '@/engine/types';

const BASE_GAME_LOCATIONS = new Set([
  'earth',
  'earth-orbit',
  'suborbital-flight',
  'lunar-flyby',
  'lunar-orbit',
  'moon',
  'inner-planets-transfer',
  'mars-flyby',
  'mars-orbit',
  'mars',
  'phobos',
  'ceres',
  'venus-flyby',
  'venus-orbit',
  'venus',
  'solar-radiation',
]);

function mapManeuver(raw: (typeof manuevers)[number], index: number): ManeuverDefinition | null {
  if (!raw.To) return null;

  const from = toLocationId(raw.From);
  const to = toLocationId(raw.To);

  if (!BASE_GAME_LOCATIONS.has(from) || !BASE_GAME_LOCATIONS.has(to)) {
    return null;
  }

  return {
    id: `${from}-to-${to}-${index}`,
    from,
    to,
    difficulty: Number(raw.Difficulty),
    exclamation: Boolean(raw.Exclamation),
    aerobraking: Boolean(raw.Aerobraking),
    hourglasses: Number(raw.Hourglasses),
    optionalHourglass: Boolean(raw.OptionalHourglass),
    solarRadiation: Boolean(raw.SolarRadiation),
    reentry: Boolean(raw.Reentry),
    landing: Boolean(raw.Landing),
    optionalLanding: Boolean(raw.OptionalLanding),
    slingshot: raw.Slingshot ?? undefined,
  };
}

export const MANEUVER_DEFINITIONS: ManeuverDefinition[] = manuevers
  .map(mapManeuver)
  .filter((m): m is ManeuverDefinition => m !== null);

export function getManeuversFrom(locationId: string): ManeuverDefinition[] {
  return MANEUVER_DEFINITIONS.filter((m) => m.from === locationId);
}

export function getManeuver(from: string, to: string, aerobraking = false): ManeuverDefinition | undefined {
  return MANEUVER_DEFINITIONS.find(
    (m) => m.from === from && m.to === to && m.aerobraking === aerobraking,
  );
}
