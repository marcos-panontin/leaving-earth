const PLACEHOLDER_BASE = '/images/placeholders';
const COMPONENT_BASE = '/images/components';

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
} as const;

export function difficultyIcon(difficulty: number): string {
  return `${PLACEHOLDER_BASE}/${difficulty}.svg`;
}

export function slingshotIcon(slingshot?: string): string | null {
  if (!slingshot) return null;
  return MANEUVER_ICONS[slingshot as keyof typeof MANEUVER_ICONS] ?? `${PLACEHOLDER_BASE}/${slingshot}.svg`;
}

/** Placeholder art until equipment/personnel images are provided. */
export function componentPlaceholder(type: string, name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${COMPONENT_BASE}/${type}-${slug}.svg`;
}

export function astronautPlaceholder(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${COMPONENT_BASE}/astronaut-${slug}.svg`;
}
