import { ADVANCEMENT_BY_ID, COMPONENT_BY_ID, COMPONENT_SUPPLY_LIMITS } from '@/data/components';
import type { AdvancementId, ComponentInstance, GameState, Spacecraft } from '@/engine/types';

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function resetIdCounter(): void {
  idCounter = 0;
}

function log(state: GameState, message: string): string[] {
  return [...state.log, message];
}

function hasAdvancement(state: GameState, advancementId: AdvancementId): boolean {
  return state.advancements.some((a) => a.advancementId === advancementId);
}

export function canBuyComponent(state: GameState, componentId: string): { ok: boolean; reason?: string } {
  const def = COMPONENT_BY_ID[componentId];
  if (!def) return { ok: false, reason: 'Unknown component.' };
  if (def.cost > state.money) return { ok: false, reason: 'Not enough funding.' };
  if (def.requiredAdvancement && !hasAdvancement(state, def.requiredAdvancement)) {
    return { ok: false, reason: `Requires ${ADVANCEMENT_BY_ID[def.requiredAdvancement].name}.` };
  }
  const remaining = state.supplyCounts[componentId] ?? 0;
  if (remaining <= 0) return { ok: false, reason: 'Supply pile empty.' };
  return { ok: true };
}

export function buyComponent(state: GameState, componentId: string): GameState {
  const check = canBuyComponent(state, componentId);
  if (!check.ok) return state;

  const def = COMPONENT_BY_ID[componentId];
  const instance: ComponentInstance = {
    instanceId: nextId(componentId),
    definitionId: componentId,
    damaged: false,
    location: 'inventory',
  };

  return {
    ...state,
    money: state.money - def.cost,
    inventory: [...state.inventory, instance],
    supplyCounts: {
      ...state.supplyCounts,
      [componentId]: (state.supplyCounts[componentId] ?? 0) - 1,
    },
    log: log(state, `Purchased ${def.name} for $${def.cost}.`),
  };
}

export function canResearch(state: GameState, advancementId: AdvancementId): { ok: boolean; reason?: string } {
  const def = ADVANCEMENT_BY_ID[advancementId];
  if (!def) return { ok: false, reason: 'Unknown advancement.' };
  if (hasAdvancement(state, advancementId)) return { ok: false, reason: 'Already researched.' };
  if (def.researchCost > state.money) return { ok: false, reason: 'Not enough funding.' };
  return { ok: true };
}

export function researchAdvancement(state: GameState, advancementId: AdvancementId): GameState {
  const check = canResearch(state, advancementId);
  if (!check.ok) return state;

  const def = ADVANCEMENT_BY_ID[advancementId];
  return {
    ...state,
    money: state.money - def.researchCost,
    advancements: [
      ...state.advancements,
      {
        advancementId,
        outcomeCardIds: Array.from({ length: def.outcomeCount }, (_, i) => `${advancementId}-outcome-${i}`),
        revealedOutcomeIds: [],
      },
    ],
    log: log(state, `Researched ${def.name} for $${def.researchCost}.`),
  };
}

export function canAssembleSpacecraft(state: GameState, componentInstanceIds: string[]): { ok: boolean; reason?: string } {
  if (componentInstanceIds.length === 0) return { ok: false, reason: 'Select components to assemble.' };
  const allValid = componentInstanceIds.every((id) =>
    state.inventory.some((c) => c.instanceId === id),
  );
  if (!allValid) return { ok: false, reason: 'Components must be in inventory.' };
  return { ok: true };
}

export function assembleSpacecraft(
  state: GameState,
  componentInstanceIds: string[],
  name?: string,
): GameState {
  const check = canAssembleSpacecraft(state, componentInstanceIds);
  if (!check.ok) return state;

  const spacecraftId = nextId('craft');
  const spacecraft: Spacecraft = {
    id: spacecraftId,
    name: name ?? `Spacecraft ${state.spacecraft.length + 1}`,
    locationId: 'earth',
    componentInstanceIds,
    astronautInstanceIds: [],
    timeTokens: 0,
  };

  const inventory = state.inventory.map((item) =>
    componentInstanceIds.includes(item.instanceId)
      ? { ...item, location: 'spacecraft' as const, spacecraftId }
      : item,
  );

  return {
    ...state,
    inventory,
    spacecraft: [...state.spacecraft, spacecraft],
    log: log(state, `Assembled ${spacecraft.name} on Earth.`),
  };
}

export function disassembleSpacecraft(state: GameState, spacecraftId: string): GameState {
  const craft = state.spacecraft.find((s) => s.id === spacecraftId);
  if (!craft || craft.locationId !== 'earth') return state;

  const inventory = state.inventory.map((item) =>
    item.spacecraftId === spacecraftId
      ? { ...item, location: 'inventory' as const, spacecraftId: undefined }
      : item,
  );

  return {
    ...state,
    inventory,
    spacecraft: state.spacecraft.filter((s) => s.id !== spacecraftId),
    log: log(state, `Disassembled ${craft.name}.`),
  };
}

export function endYear(state: GameState): GameState {
  if (state.year >= 1976) {
    return { ...state, phase: 'gameOver', log: log(state, 'The calendar has reached 1976. Game over.') };
  }

  const repairedInventory = state.inventory.map((item) =>
    item.location === 'inventory' ? { ...item, damaged: false } : item,
  );

  const healedAstronauts = state.astronauts.map((a) => ({ ...a, incapacitated: false }));

  const spacecraft = state.spacecraft.map((craft) => ({
    ...craft,
    timeTokens: Math.max(0, craft.timeTokens - 1),
  }));

  return {
    ...state,
    phase: 'playing',
    year: state.year + 1,
    money: 25,
    inventory: repairedInventory,
    astronauts: healedAstronauts,
    spacecraft,
    log: log(state, `Year ${state.year + 1} begins. Funding replenished to $25.`),
  };
}

export { COMPONENT_SUPPLY_LIMITS };
