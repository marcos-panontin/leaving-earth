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

function pickPool(agencyId: string): string[] {
  if (agencyId === 'nasa') return NASA_SPACECRAFT_NAMES;
  if (agencyId === 'okb1') return OKB1_SPACECRAFT_NAMES;
  return GENERIC_SPACECRAFT_NAMES;
}

function pickUniqueName(existingNames: Set<string>, pool: string[]): string {
  for (const baseName of pool) {
    if (!existingNames.has(baseName)) return baseName;
  }

  let suffix = 2;
  while (suffix < 100) {
    for (const baseName of pool) {
      const candidate = `${baseName} ${suffix}`;
      if (!existingNames.has(candidate)) return candidate;
    }
    suffix += 1;
  }

  return `Spacecraft ${existingNames.size + 1}`;
}

export function generateSpacecraftName(agencyId: string, existingNames: string[]): string {
  const usedNames = new Set(existingNames);
  return pickUniqueName(usedNames, pickPool(agencyId));
}
