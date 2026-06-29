import { ADVANCEMENT_BY_ID, COMPONENT_BY_ID, COMPONENT_SUPPLY_LIMITS } from '@/data/components';
import { EXPLORABLE_LOCATIONS } from '@/data/locations';
import { MANEUVER_DEFINITIONS } from '@/data/maneuvers';
import { toLocationName } from '@/data/locations';
import { calculateRocketThrust, calculateThrustNeeded, canPerformManeuver } from '@/engine/thrust';
import type {
  AdvancementId,
  ComponentInstance,
  GameState,
  ManeuverDefinition,
  Spacecraft,
} from '@/engine/types';

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

function getSpacecraft(state: GameState, spacecraftId: string): Spacecraft | undefined {
  return state.spacecraft.find((s) => s.id === spacecraftId);
}

function getSpacecraftComponents(state: GameState, spacecraftId: string): ComponentInstance[] {
  return state.inventory.filter((item) => item.spacecraftId === spacecraftId);
}

function rocketGroupsFromComponents(components: ComponentInstance[]): Array<{ definitionId: string; quantity: number }> {
  const counts = new Map<string, number>();
  for (const component of components) {
    const def = COMPONENT_BY_ID[component.definitionId];
    if (!def || def.type !== 'rocket' || component.damaged) continue;
    counts.set(component.definitionId, (counts.get(component.definitionId) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([definitionId, quantity]) => ({ definitionId, quantity }));
}

function getManeuver(maneuverId: string): ManeuverDefinition | undefined {
  return MANEUVER_DEFINITIONS.find((m) => m.id === maneuverId);
}

function getSpacecraftMass(components: ComponentInstance[]): number {
  return components.reduce((sum, component) => {
    const def = COMPONENT_BY_ID[component.definitionId];
    return sum + (def?.mass ?? 0);
  }, 0);
}

function rollD8(): number {
  return Math.floor(Math.random() * 8) + 1;
}

function getRadiationLevel(state: GameState): number {
  const revealed = state.revealedLocations.find((location) => location.locationId === 'solar-radiation');
  if (!revealed) return 1;
  const definition = EXPLORABLE_LOCATIONS.find((location) => location.id === 'solar-radiation');
  const variant = definition?.variants.find((item) => item.id === revealed.variantId);
  if (!variant) return 1;
  const match = variant.label.match(/(\d+)/);
  return match ? Number(match[1]) : 1;
}

function damageFirstUndamagedComponent(
  inventory: ComponentInstance[],
  spacecraftId: string,
): { inventory: ComponentInstance[]; damagedId?: string } {
  const index = inventory.findIndex(
    (component) => component.spacecraftId === spacecraftId && component.location === 'spacecraft' && !component.damaged,
  );
  if (index === -1) return { inventory };
  const next = [...inventory];
  next[index] = { ...next[index], damaged: true };
  return { inventory: next, damagedId: next[index].instanceId };
}

function destroySpacecraft(
  inventory: ComponentInstance[],
  spacecraft: Spacecraft[],
  spacecraftId: string,
): { inventory: ComponentInstance[]; spacecraft: Spacecraft[] } {
  return {
    inventory: inventory.filter((component) => component.spacecraftId !== spacecraftId),
    spacecraft: spacecraft.filter((craft) => craft.id !== spacecraftId),
  };
}

function revealExplorableIfNeeded(state: GameState, destinationId: string): { state: GameState; message?: string } {
  const index = state.revealedLocations.findIndex((location) => location.locationId === destinationId);
  if (index === -1) return { state };
  if (state.revealedLocations[index].revealed) return { state };

  const definition = EXPLORABLE_LOCATIONS.find((location) => location.id === destinationId);
  const variant = definition?.variants.find((item) => item.id === state.revealedLocations[index].variantId);

  const revealedLocations = [...state.revealedLocations];
  revealedLocations[index] = { ...revealedLocations[index], revealed: true };

  const nextState: GameState = {
    ...state,
    revealedLocations,
  };

  if (!variant) return { state: nextState };

  return {
    state: nextState,
    message: `${toLocationName(destinationId)} explored: ${variant.label}.`,
  };
}

export interface ManeuverCheck {
  ok: boolean;
  reason?: string;
  requiredThrust: number;
  providedThrust: number;
  mass: number;
}

export function canPerformSpacecraftManeuver(
  state: GameState,
  spacecraftId: string,
  maneuverId: string,
): ManeuverCheck {
  const craft = getSpacecraft(state, spacecraftId);
  const maneuver = getManeuver(maneuverId);

  if (!craft) {
    return { ok: false, reason: 'Unknown spacecraft.', requiredThrust: 0, providedThrust: 0, mass: 0 };
  }

  if (!maneuver) {
    return { ok: false, reason: 'Unknown maneuver.', requiredThrust: 0, providedThrust: 0, mass: 0 };
  }

  if (craft.locationId !== maneuver.from) {
    return {
      ok: false,
      reason: `Craft is at ${toLocationName(craft.locationId)}, not ${toLocationName(maneuver.from)}.`,
      requiredThrust: 0,
      providedThrust: 0,
      mass: 0,
    };
  }

  if (craft.timeTokens > 0) {
    return {
      ok: false,
      reason: 'This spacecraft is still in transit (time tokens remain).',
      requiredThrust: 0,
      providedThrust: 0,
      mass: 0,
    };
  }

  const components = getSpacecraftComponents(state, spacecraftId);
  const mass = getSpacecraftMass(components);
  const requiredThrust = calculateThrustNeeded(mass, maneuver);
  const providedThrust = calculateRocketThrust(rocketGroupsFromComponents(components), maneuver);

  if (!canPerformManeuver(mass, providedThrust, maneuver)) {
    return {
      ok: false,
      reason: `Insufficient thrust (${providedThrust}/${requiredThrust}).`,
      requiredThrust,
      providedThrust,
      mass,
    };
  }

  return { ok: true, requiredThrust, providedThrust, mass };
}

export function performSpacecraftManeuver(
  state: GameState,
  spacecraftId: string,
  maneuverId: string,
): GameState {
  const check = canPerformSpacecraftManeuver(state, spacecraftId, maneuverId);
  const craft = getSpacecraft(state, spacecraftId);
  const maneuver = getManeuver(maneuverId);

  if (!craft || !maneuver) return state;
  if (!check.ok) {
    return {
      ...state,
      log: log(state, `${craft.name} could not perform maneuver: ${check.reason ?? 'Invalid move.'}`),
    };
  }

  const craftComponents = getSpacecraftComponents(state, spacecraftId);
  const consumedRocketIds = maneuver.exclamation
    ? []
    : craftComponents
        .filter((component) => {
          const def = COMPONENT_BY_ID[component.definitionId];
          return Boolean(def && def.type === 'rocket' && !def.isReusable && !component.damaged && def.thrust > 0);
        })
        .map((component) => component.instanceId);

  let inventory = state.inventory.filter((item) => !consumedRocketIds.includes(item.instanceId));

  let spacecraft = state.spacecraft.map((entry) => {
    if (entry.id !== spacecraftId) return entry;
    return {
      ...entry,
      locationId: maneuver.to,
      timeTokens: maneuver.hourglasses,
      componentInstanceIds: entry.componentInstanceIds.filter((id) => !consumedRocketIds.includes(id)),
    };
  });

  const thrustLog = maneuver.exclamation
    ? 'automatic maneuver'
    : `mass ${check.mass}, thrust ${check.providedThrust}/${check.requiredThrust}`;
  const spentLog = consumedRocketIds.length > 0 ? `; expended ${consumedRocketIds.length} rocket(s)` : '';
  let nextState: GameState = {
    ...state,
    inventory,
    spacecraft,
    log: log(state, `${craft.name} maneuvered ${toLocationName(maneuver.from)} → ${toLocationName(maneuver.to)} (${thrustLog}${spentLog}).`),
  };

  if (maneuver.solarRadiation) {
    const years = Math.max(1, maneuver.hourglasses);
    const level = getRadiationLevel(nextState);
    const threshold = level * years;
    const crew = nextState.astronauts.filter(
      (astronaut) => astronaut.spacecraftId === spacecraftId && !astronaut.incapacitated,
    );
    if (crew.length === 0) {
      nextState = { ...nextState, log: log(nextState, `Radiation hazard: no astronauts aboard ${craft.name}.`) };
    } else {
      let astronauts = [...nextState.astronauts];
      for (const astronaut of crew) {
        const roll = rollD8();
        if (roll <= threshold) {
          astronauts = astronauts.map((candidate) =>
            candidate.instanceId === astronaut.instanceId ? { ...candidate, incapacitated: true } : candidate,
          );
          nextState = {
            ...nextState,
            astronauts,
            log: log(nextState, `Radiation roll ${roll} ≤ ${threshold}: astronaut incapacitated.`),
          };
        } else {
          nextState = {
            ...nextState,
            log: log(nextState, `Radiation roll ${roll} > ${threshold}: astronaut remains healthy.`),
          };
        }
      }
    }
  }

  if (maneuver.reentry) {
    const craftComponents = getSpacecraftComponents(nextState, spacecraftId);
    const capsules = craftComponents.filter((component) => COMPONENT_BY_ID[component.definitionId]?.type === 'capsule');
    if (capsules.length > 0) {
      if (!hasAdvancement(nextState, 'reentry')) {
        const result = destroySpacecraft(nextState.inventory, nextState.spacecraft, spacecraftId);
        nextState = {
          ...nextState,
          ...result,
          log: log(nextState, `${craft.name} was destroyed during re-entry (Re-entry advancement missing).`),
        };
        return nextState;
      }

      const roll = rollD8();
      if (roll <= 2) {
        const result = destroySpacecraft(nextState.inventory, nextState.spacecraft, spacecraftId);
        nextState = {
          ...nextState,
          ...result,
          log: log(nextState, `Re-entry major failure (roll ${roll}): ${craft.name} destroyed.`),
        };
        return nextState;
      }

      if (roll <= 4) {
        const damaged = damageFirstUndamagedComponent(nextState.inventory, spacecraftId);
        nextState = {
          ...nextState,
          inventory: damaged.inventory,
          log: log(nextState, `Re-entry minor failure (roll ${roll}): component damaged.`),
        };
      } else {
        nextState = {
          ...nextState,
          log: log(nextState, `Re-entry success (roll ${roll}).`),
        };
      }
    }
  }

  if (maneuver.landing && !maneuver.optionalLanding) {
    if (!hasAdvancement(nextState, 'landing')) {
      const result = destroySpacecraft(nextState.inventory, nextState.spacecraft, spacecraftId);
      nextState = {
        ...nextState,
        ...result,
        log: log(nextState, `${craft.name} was destroyed landing (Landing advancement missing).`),
      };
      return nextState;
    }

    const roll = rollD8();
    if (roll <= 2) {
      const result = destroySpacecraft(nextState.inventory, nextState.spacecraft, spacecraftId);
      nextState = {
        ...nextState,
        ...result,
        log: log(nextState, `Landing major failure (roll ${roll}): spacecraft destroyed.`),
      };
      return nextState;
    }
    if (roll <= 4) {
      const damaged = damageFirstUndamagedComponent(nextState.inventory, spacecraftId);
      nextState = {
        ...nextState,
        inventory: damaged.inventory,
        log: log(nextState, `Landing minor failure (roll ${roll}): component damaged.`),
      };
    } else {
      nextState = {
        ...nextState,
        log: log(nextState, `Landing success (roll ${roll}).`),
      };
    }
  }

  const revealed = revealExplorableIfNeeded(nextState, maneuver.to);
  nextState = revealed.state;
  if (revealed.message) {
    nextState = {
      ...nextState,
      log: log(nextState, revealed.message),
    };
  }

  return nextState;
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
