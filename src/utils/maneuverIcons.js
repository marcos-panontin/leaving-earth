/**
 * Placeholder SVG paths for maneuver and component UI icons.
 * Replace individual files in public/images/placeholders/ with final art later.
 */
const PLACEHOLDER_BASE = '/images/placeholders';

export const MANEUVER_ICONS = {
  mass: `${PLACEHOLDER_BASE}/mass.svg`,
  thrust: `${PLACEHOLDER_BASE}/thrust.svg`,
  hourglass: `${PLACEHOLDER_BASE}/hourglass.svg`,
  aerobraking: `${PLACEHOLDER_BASE}/aerobraking.svg`,
  solarRadiation: `${PLACEHOLDER_BASE}/solar-radiation.svg`,
  reentry: `${PLACEHOLDER_BASE}/reentry.svg`,
  landing: `${PLACEHOLDER_BASE}/landing.svg`,
  exclamation: `${PLACEHOLDER_BASE}/exclamation.svg`,
  jupiter: `${PLACEHOLDER_BASE}/jupiter.svg`,
  saturn: `${PLACEHOLDER_BASE}/saturn.svg`,
  uranus: `${PLACEHOLDER_BASE}/uranus.svg`,
  neptune: `${PLACEHOLDER_BASE}/neptune.svg`,
};

/** @param {number} difficulty */
export function difficultyIcon(difficulty) {
  return `${PLACEHOLDER_BASE}/${difficulty}.svg`;
}

/** @param {string | null | undefined} slingshot */
export function slingshotIcon(slingshot) {
  if (!slingshot) return null;
  return MANEUVER_ICONS[slingshot] ?? `${PLACEHOLDER_BASE}/${slingshot}.svg`;
}
