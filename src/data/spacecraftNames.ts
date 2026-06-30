import { COMPONENT_DEFINITIONS } from '@/data/components';

const NASA_SPACECRAFT_NAMES = [
  'Mercury',
  'Gemini',
  'Apollo',
  'Mariner',
  'Pioneer',
  'Voyager',
  'Skylab',
  'Orion',
];

const OKB1_SPACECRAFT_NAMES = [
  'Vostok',
  'Voskhod',
  'Soyuz',
  'Zond',
  'Luna',
  'Salyut',
  'Mir',
  'Progress',
];

const GENERIC_SPACECRAFT_NAMES = [
  'Odyssey',
  'Endeavour',
  'Aurora',
  'Zenith',
  'Frontier',
  'Pathfinder',
  'Resolute',
  'Starlance',
];

const RESERVED_COMPONENT_NAMES = new Set(
  COMPONENT_DEFINITIONS.map((component) => component.name.trim().toLowerCase()),
);

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function pickPool(agencyId: string): string[] {
  if (agencyId === 'nasa') return NASA_SPACECRAFT_NAMES;
  if (agencyId === 'okb1') return OKB1_SPACECRAFT_NAMES;
  return GENERIC_SPACECRAFT_NAMES;
}

function isReservedComponentName(name: string): boolean {
  return RESERVED_COMPONENT_NAMES.has(normalizeName(name));
}

function pickUniqueName(existingNames: Set<string>, pool: string[]): string {
  for (const baseName of pool) {
    const normalized = normalizeName(baseName);
    if (!existingNames.has(normalized) && !isReservedComponentName(baseName)) return baseName;
  }

  let suffix = 2;
  while (suffix < 100) {
    for (const baseName of pool) {
      if (isReservedComponentName(baseName)) continue;
      const candidate = `${baseName} ${suffix}`;
      if (!existingNames.has(normalizeName(candidate))) return candidate;
    }
    suffix += 1;
  }

  return `Expedition ${existingNames.size + 1}`;
}

export function generateSpacecraftName(agencyId: string, existingNames: string[]): string {
  const usedNames = new Set(existingNames.map(normalizeName));
  return pickUniqueName(usedNames, pickPool(agencyId));
}
