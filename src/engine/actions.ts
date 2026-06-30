import { ADVANCEMENT_BY_ID, COMPONENT_BY_ID, COMPONENT_SUPPLY_LIMITS } from '@/data/components';
import { ASTRONAUT_BY_ID } from '@/data/astronauts';
import { generateSpacecraftName } from '@/data/spacecraftNames';
import { EXPLORABLE_LOCATIONS } from '@/data/locations';
import { MANEUVER_DEFINITIONS } from '@/data/maneuvers';
import { MISSION_BY_ID } from '@/data/missions';
import { toLocationName } from '@/data/locations';
import { createOutcomeDeck } from '@/engine/setup';
import { calculateRocketThrust, calculateThrustNeeded, canPerformManeuver } from '@/engine/thrust';
import type {
  ActiveMission,
  AdvancementId,
  ComponentInstance,
  GameState,
  ManeuverDefinition,
  MissionDefinition,
  OutcomeCardType,
  ResearchedAdvancement,
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

const ROCKET_ADVANCEMENT_BY_COMPONENT: Partial<Record<string, AdvancementId>> = {
  juno: 'juno',
  atlas: 'atlas',
  soyuz: 'soyuz',
  saturn: 'saturn',
  ion: 'ion',
};

const SAMPLEABLE_LOCATION_IDS = new Set([
  'moon',
  'mars',
  'venus',
  'ceres',
  'phobos',
]);

export const ASTRONAUT_RECRUIT_COST = 2;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function ensureOutcomeDeck(state: GameState): { deck: OutcomeCardType[]; discard: OutcomeCardType[] } {
  const deck = state.outcomeDeck ?? [];
  const discard = state.outcomeDiscard ?? [];
  if (deck.length === 0 && discard.length === 0) {
    return { deck: createOutcomeDeck(), discard: [] };
  }
  return { deck: [...deck], discard: [...discard] };
}

function drawOutcomeCards(
  state: GameState,
  count: number,
): { state: GameState; drawn: OutcomeCardType[] } {
  let { deck, discard } = ensureOutcomeDeck(state);
  const drawn: OutcomeCardType[] = [];

  while (drawn.length < count) {
    if (deck.length === 0) {
      if (discard.length === 0) break;
      deck = shuffle(discard);
      discard = [];
    }
    const card = deck.shift();
    if (!card) break;
    drawn.push(card);
  }

  return {
    state: {
      ...state,
      outcomeDeck: deck,
      outcomeDiscard: discard,
    },
    drawn,
  };
}

function gainAdvancementFromDeck(state: GameState, advancementId: AdvancementId): GameState {
  if (hasAdvancement(state, advancementId)) return state;
  const definition = ADVANCEMENT_BY_ID[advancementId];
  const drawn = drawOutcomeCards(state, definition.outcomeCount);
  return {
    ...drawn.state,
    advancements: [
      ...drawn.state.advancements,
      {
        advancementId,
        outcomeCards: drawn.drawn,
        revealedOutcomeCards: [],
      },
    ],
  };
}

function drawAdvancementOutcome(
  state: GameState,
  advancementId: AdvancementId,
): { state: GameState; outcome: OutcomeCardType | 'autoSuccess'; autoResearched: boolean } {
  let nextState = state;
  let autoResearched = false;
  if (!hasAdvancement(nextState, advancementId)) {
    nextState = gainAdvancementFromDeck(nextState, advancementId);
    autoResearched = true;
  }

  const index = nextState.advancements.findIndex(
    (advancement) => advancement.advancementId === advancementId,
  );
  if (index === -1) {
    return { state: nextState, outcome: 'autoSuccess', autoResearched };
  }

  const advancement = nextState.advancements[index];
  if (advancement.outcomeCards.length === 0) {
    return { state: nextState, outcome: 'autoSuccess', autoResearched };
  }

  const randomIndex = Math.floor(Math.random() * advancement.outcomeCards.length);
  const outcome = advancement.outcomeCards[randomIndex];

  const updatedAdvancement: ResearchedAdvancement = {
    ...advancement,
    revealedOutcomeCards: [...advancement.revealedOutcomeCards, outcome],
  };

  // Rulebook: if only one success remains, it may be removed for free.
  if (advancement.outcomeCards.length === 1 && outcome === 'success') {
    updatedAdvancement.outcomeCards = [];
    nextState = {
      ...nextState,
      outcomeDiscard: [...(nextState.outcomeDiscard ?? []), outcome],
    };
  }

  const advancements = [...nextState.advancements];
  advancements[index] = updatedAdvancement;

  return {
    state: {
      ...nextState,
      advancements,
    },
    outcome,
    autoResearched,
  };
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
  astronauts: GameState['astronauts'],
  spacecraftId: string,
): {
  inventory: ComponentInstance[];
  spacecraft: Spacecraft[];
  astronauts: GameState['astronauts'];
  astronautLosses: number;
} {
  const astronautLosses = astronauts.filter((astronaut) => astronaut.spacecraftId === spacecraftId).length;
  return {
    inventory: inventory.filter((component) => component.spacecraftId !== spacecraftId),
    spacecraft: spacecraft.filter((craft) => craft.id !== spacecraftId),
    astronauts: astronauts.filter((astronaut) => astronaut.spacecraftId !== spacecraftId),
    astronautLosses,
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

function hasUndamagedProbeOrCapsuleOnCraft(state: GameState, spacecraftId: string): boolean {
  return state.inventory.some((component) => {
    if (component.spacecraftId !== spacecraftId || component.damaged) return false;
    const definition = COMPONENT_BY_ID[component.definitionId];
    return Boolean(definition && (definition.type === 'probe' || definition.type === 'capsule'));
  });
}

function hasHealthyAstronautOnCraft(state: GameState, spacecraftId: string): boolean {
  return state.astronauts.some(
    (astronaut) => astronaut.spacecraftId === spacecraftId && !astronaut.incapacitated,
  );
}

function getSpacecraftSeatCapacity(state: GameState, spacecraftId: string): number {
  return state.inventory
    .filter((component) => component.spacecraftId === spacecraftId)
    .reduce((sum, component) => {
      const definition = COMPONENT_BY_ID[component.definitionId];
      if (!definition || definition.type !== 'capsule') return sum;
      return sum + definition.seats;
    }, 0);
}

function getSpacecraftAstronautCount(state: GameState, spacecraftId: string): number {
  return state.astronauts.filter((astronaut) => astronaut.spacecraftId === spacecraftId).length;
}

function isSampleComponentOnEarth(state: GameState, component: ComponentInstance): boolean {
  if (component.definitionId !== 'sample') return false;
  if (component.location === 'inventory') return true;
  if (component.location !== 'spacecraft' || !component.spacecraftId) return false;
  const craft = getSpacecraft(state, component.spacecraftId);
  return craft?.locationId === 'earth';
}

function getRevealedVariantType(state: GameState, locationId: string): string | null {
  const revealed = state.revealedLocations.find(
    (location) => location.locationId === locationId && location.revealed,
  );
  if (!revealed) return null;
  const definition = EXPLORABLE_LOCATIONS.find((location) => location.id === locationId);
  const variant = definition?.variants.find((item) => item.id === revealed.variantId);
  return variant?.type ?? null;
}

function isMissionImpossible(state: GameState, mission: MissionDefinition): boolean {
  if (!mission.targetLocation) return false;
  if (!['probe', 'sampleReturn', 'manned', 'spaceStation'].includes(mission.type)) return false;

  // "Sounding Rocket" and "Artificial Satellite" are not tied to explorable locations.
  if (mission.id === 'sounding-rocket' || mission.id === 'artificial-satellite') return false;

  const variantType = getRevealedVariantType(state, mission.targetLocation);
  return variantType === 'destroyed';
}

function isMissionCompleted(state: GameState, mission: MissionDefinition): boolean {
  if (mission.id === 'sounding-rocket') {
    return state.spacecraft.some(
      (craft) => craft.locationId !== 'earth' && hasUndamagedProbeOrCapsuleOnCraft(state, craft.id),
    );
  }

  if (mission.id === 'artificial-satellite') {
    return state.spacecraft.some(
      (craft) =>
        craft.locationId === 'earth-orbit' && hasUndamagedProbeOrCapsuleOnCraft(state, craft.id),
    );
  }

  if (mission.type === 'survey' && mission.targetLocation) {
    return Boolean(
      state.revealedLocations.find(
        (location) =>
          location.locationId === mission.targetLocation && location.revealed,
      ),
    );
  }

  if (mission.type === 'probe' && mission.targetLocation) {
    return state.spacecraft.some(
      (craft) =>
        craft.locationId === mission.targetLocation &&
        hasUndamagedProbeOrCapsuleOnCraft(state, craft.id),
    );
  }

  if (mission.type === 'sampleReturn' && mission.targetLocation) {
    return state.inventory.some(
      (component) =>
        component.definitionId === 'sample' &&
        component.sampleSourceLocationId === mission.targetLocation &&
        isSampleComponentOnEarth(state, component),
    );
  }

  if (mission.type === 'extraterrestrialLife') {
    return state.inventory.some((component) => {
      if (component.definitionId !== 'sample' || !component.sampleSourceLocationId) return false;
      if (!isSampleComponentOnEarth(state, component)) return false;
      const variantType = getRevealedVariantType(state, component.sampleSourceLocationId);
      return variantType === 'life';
    });
  }

  if (mission.type === 'manned') {
    return state.astronauts.some((astronaut) => {
      const spacecraft = astronaut.spacecraftId ? getSpacecraft(state, astronaut.spacecraftId) : undefined;
      const onEarthNow = !astronaut.spacecraftId || spacecraft?.locationId === 'earth';
      if (!onEarthNow) return false;

      if (mission.id === 'man-in-space') {
        return astronaut.visitedLocationIds.some((locationId) => locationId !== 'earth');
      }
      if (mission.id === 'man-in-orbit' || mission.targetLocation === 'earth-orbit') {
        return astronaut.visitedLocationIds.includes('earth-orbit');
      }
      if (mission.targetLocation) {
        return astronaut.visitedLocationIds.includes(mission.targetLocation);
      }
      return false;
    });
  }

  if (mission.type === 'spaceStation' && mission.targetLocation) {
    return state.spacecraft.some(
      (craft) =>
        craft.locationId === mission.targetLocation &&
        hasHealthyAstronautOnCraft(state, craft.id),
    );
  }

  if (mission.type === 'spaceStation') {
    return state.spacecraft.some(
      (craft) => craft.locationId !== 'earth' && hasHealthyAstronautOnCraft(state, craft.id),
    );
  }

  return false;
}

function updateMissionState(
  state: GameState,
  trigger: 'onTurn' | 'startOfYear',
): GameState {
  let nextState = state;
  let missionsChanged = false;
  const missions: ActiveMission[] = [...nextState.missions];

  for (let index = 0; index < missions.length; index += 1) {
    const missionSlot = missions[index];
    if (missionSlot.completed || missionSlot.removed) continue;

    const mission = MISSION_BY_ID[missionSlot.definitionId];
    if (!mission) continue;

    if (isMissionImpossible(nextState, mission)) {
      missions[index] = { ...missionSlot, removed: true };
      missionsChanged = true;
      nextState = {
        ...nextState,
        missions,
        log: log(nextState, `${mission.name} removed: impossible with revealed conditions.`),
      };
      continue;
    }

    if (mission.trigger !== trigger) continue;
    if (!isMissionCompleted(nextState, mission)) continue;

    missions[index] = { ...missionSlot, completed: true };
    missionsChanged = true;
    nextState = {
      ...nextState,
      missions,
      score: nextState.score + mission.points,
      log: log(nextState, `Mission completed: ${mission.name} (+${mission.points} points).`),
    };
  }

  return missionsChanged ? nextState : state;
}

export function resolveMissionChecks(state: GameState, trigger: 'onTurn' | 'startOfYear'): GameState {
  return updateMissionState(state, trigger);
}

export interface AstronautCheck {
  ok: boolean;
  reason?: string;
}

export function canRecruitAstronaut(state: GameState, astronautId: string): AstronautCheck {
  if (!ASTRONAUT_BY_ID[astronautId]) return { ok: false, reason: 'Unknown astronaut.' };
  if (state.money < ASTRONAUT_RECRUIT_COST) {
    return { ok: false, reason: `Need $${ASTRONAUT_RECRUIT_COST} to recruit astronaut.` };
  }
  const alreadyRecruited = state.astronauts.some((astronaut) => astronaut.definitionId === astronautId);
  if (alreadyRecruited) return { ok: false, reason: 'Astronaut already recruited.' };
  return { ok: true };
}

export function recruitAstronaut(state: GameState, astronautId: string): GameState {
  const check = canRecruitAstronaut(state, astronautId);
  if (!check.ok) return state;

  const astronautName = ASTRONAUT_BY_ID[astronautId]?.name ?? astronautId;
  return {
    ...state,
    money: state.money - ASTRONAUT_RECRUIT_COST,
    astronauts: [
      ...state.astronauts,
      {
        instanceId: nextId('astronaut'),
        definitionId: astronautId,
        incapacitated: false,
        visitedLocationIds: ['earth'],
      },
    ],
    log: log(state, `Recruited astronaut ${astronautName} for $${ASTRONAUT_RECRUIT_COST}.`),
  };
}

export function canBoardAstronaut(
  state: GameState,
  astronautInstanceId: string,
  spacecraftId: string,
): AstronautCheck {
  const craft = getSpacecraft(state, spacecraftId);
  if (!craft) return { ok: false, reason: 'Unknown spacecraft.' };
  if (craft.locationId !== 'earth') return { ok: false, reason: 'Boarding only allowed on Earth.' };

  const astronaut = state.astronauts.find((entry) => entry.instanceId === astronautInstanceId);
  if (!astronaut) return { ok: false, reason: 'Unknown astronaut.' };
  if (astronaut.spacecraftId) return { ok: false, reason: 'Astronaut already boarded.' };
  if (astronaut.incapacitated) return { ok: false, reason: 'Incapacitated astronaut cannot board.' };

  const seats = getSpacecraftSeatCapacity(state, spacecraftId);
  const occupants = getSpacecraftAstronautCount(state, spacecraftId);
  if (seats <= occupants) return { ok: false, reason: 'No available seats in spacecraft capsules.' };
  return { ok: true };
}

export function boardAstronaut(
  state: GameState,
  astronautInstanceId: string,
  spacecraftId: string,
): GameState {
  const check = canBoardAstronaut(state, astronautInstanceId, spacecraftId);
  if (!check.ok) return state;

  const craft = getSpacecraft(state, spacecraftId);
  const astronaut = state.astronauts.find((entry) => entry.instanceId === astronautInstanceId);
  if (!craft || !astronaut) return state;

  const astronautName = ASTRONAUT_BY_ID[astronaut.definitionId]?.name ?? astronaut.definitionId;
  return {
    ...state,
    astronauts: state.astronauts.map((entry) =>
      entry.instanceId === astronautInstanceId ? { ...entry, spacecraftId } : entry,
    ),
    spacecraft: state.spacecraft.map((entry) =>
      entry.id === spacecraftId
        ? { ...entry, astronautInstanceIds: [...entry.astronautInstanceIds, astronautInstanceId] }
        : entry,
    ),
    log: log(state, `${astronautName} boarded ${craft.name}.`),
  };
}

export function canUnboardAstronaut(
  state: GameState,
  astronautInstanceId: string,
): AstronautCheck {
  const astronaut = state.astronauts.find((entry) => entry.instanceId === astronautInstanceId);
  if (!astronaut) return { ok: false, reason: 'Unknown astronaut.' };
  if (!astronaut.spacecraftId) return { ok: false, reason: 'Astronaut is not aboard a spacecraft.' };
  const craft = getSpacecraft(state, astronaut.spacecraftId);
  if (!craft) return { ok: false, reason: 'Astronaut craft no longer exists.' };
  if (craft.locationId !== 'earth') return { ok: false, reason: 'Unboarding only allowed on Earth.' };
  return { ok: true };
}

export function unboardAstronaut(state: GameState, astronautInstanceId: string): GameState {
  const check = canUnboardAstronaut(state, astronautInstanceId);
  if (!check.ok) return state;

  const astronaut = state.astronauts.find((entry) => entry.instanceId === astronautInstanceId);
  if (!astronaut?.spacecraftId) return state;
  const craft = getSpacecraft(state, astronaut.spacecraftId);
  const astronautName = ASTRONAUT_BY_ID[astronaut.definitionId]?.name ?? astronaut.definitionId;

  return {
    ...state,
    astronauts: state.astronauts.map((entry) =>
      entry.instanceId === astronautInstanceId ? { ...entry, spacecraftId: undefined } : entry,
    ),
    spacecraft: state.spacecraft.map((entry) =>
      entry.id === astronaut.spacecraftId
        ? {
            ...entry,
            astronautInstanceIds: entry.astronautInstanceIds.filter((id) => id !== astronautInstanceId),
          }
        : entry,
    ),
    log: log(state, `${astronautName} unboarded${craft ? ` from ${craft.name}` : ''}.`),
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

export interface SampleCheck {
  ok: boolean;
  reason?: string;
}

export function canCollectSample(state: GameState, spacecraftId: string): SampleCheck {
  const craft = getSpacecraft(state, spacecraftId);
  if (!craft) return { ok: false, reason: 'Unknown spacecraft.' };
  if (craft.timeTokens > 0) {
    return { ok: false, reason: 'Spacecraft is still in transit (time tokens remain).' };
  }
  if (!SAMPLEABLE_LOCATION_IDS.has(craft.locationId)) {
    return { ok: false, reason: 'Samples can only be collected on solid bodies.' };
  }

  const revealed = state.revealedLocations.find((entry) => entry.locationId === craft.locationId);
  if (revealed && !revealed.revealed) {
    return { ok: false, reason: 'Location must be explored before sampling.' };
  }

  const hasCollector =
    hasUndamagedProbeOrCapsuleOnCraft(state, spacecraftId) ||
    hasHealthyAstronautOnCraft(state, spacecraftId);
  if (!hasCollector) {
    return { ok: false, reason: 'Need undamaged probe/capsule or healthy astronaut to collect sample.' };
  }

  return { ok: true };
}

export function collectSample(state: GameState, spacecraftId: string): GameState {
  const check = canCollectSample(state, spacecraftId);
  const craft = getSpacecraft(state, spacecraftId);
  if (!craft) return state;
  if (!check.ok) {
    return {
      ...state,
      log: log(state, `${craft.name} could not collect sample: ${check.reason ?? 'Invalid action.'}`),
    };
  }

  const sample: ComponentInstance = {
    instanceId: nextId('sample'),
    definitionId: 'sample',
    damaged: false,
    location: 'spacecraft',
    spacecraftId,
    sampleSourceLocationId: craft.locationId,
  };

  const nextState: GameState = {
    ...state,
    inventory: [...state.inventory, sample],
    spacecraft: state.spacecraft.map((entry) =>
      entry.id !== spacecraftId
        ? entry
        : { ...entry, componentInstanceIds: [...entry.componentInstanceIds, sample.instanceId] },
    ),
    log: log(state, `${craft.name} collected a sample at ${toLocationName(craft.locationId)}.`),
  };

  return updateMissionState(nextState, 'onTurn');
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

  let nextState = state;
  const craftComponents = getSpacecraftComponents(nextState, spacecraftId);
  let consumedRocketIds: string[] = [];
  let damagedRocketIds: string[] = [];
  let providedThrust = 0;

  if (!maneuver.exclamation) {
    const rocketComponents = craftComponents.filter((component) => {
      const definition = COMPONENT_BY_ID[component.definitionId];
      return Boolean(definition && definition.type === 'rocket' && !component.damaged);
    });

    for (const rocket of rocketComponents) {
      const definition = COMPONENT_BY_ID[rocket.definitionId];
      if (!definition) continue;

      const advancementId = ROCKET_ADVANCEMENT_BY_COMPONENT[definition.id];
      if (advancementId) {
        const draw = drawAdvancementOutcome(nextState, advancementId);
        nextState = draw.state;
        if (draw.autoResearched) {
          nextState = {
            ...nextState,
            log: log(nextState, `${craft.name} auto-gained ${ADVANCEMENT_BY_ID[advancementId].name} before firing.`),
          };
        }

        if (draw.outcome === 'majorFailure') {
          const destroyed = destroySpacecraft(
            nextState.inventory,
            nextState.spacecraft,
            nextState.astronauts,
            spacecraftId,
          );
          nextState = {
            ...nextState,
            ...destroyed,
            lostAstronauts: nextState.lostAstronauts + destroyed.astronautLosses,
            log: log(nextState, `${definition.name} major failure: ${craft.name} destroyed during launch.`),
          };
          return updateMissionState(nextState, 'onTurn');
        }
        if (draw.outcome === 'minorFailure') {
          damagedRocketIds.push(rocket.instanceId);
          nextState = {
            ...nextState,
            log: log(nextState, `${definition.name} minor failure: rocket damaged, no thrust generated.`),
          };
          continue;
        }
      }

      const thrustFromRocket = definition.isReusable
        ? definition.thrust * Math.max(1, maneuver.hourglasses)
        : definition.thrust;
      providedThrust += thrustFromRocket;

      if (!definition.isReusable) {
        consumedRocketIds.push(rocket.instanceId);
      }
    }

    const required = calculateThrustNeeded(check.mass, maneuver);
    if (providedThrust < required) {
      const inventoryAfterFailure = nextState.inventory
        .filter((item) => !consumedRocketIds.includes(item.instanceId))
        .map((item) =>
          damagedRocketIds.includes(item.instanceId) ? { ...item, damaged: true } : item,
        );

      const spacecraftAfterFailure = nextState.spacecraft.map((entry) =>
        entry.id !== spacecraftId
          ? entry
          : {
              ...entry,
              componentInstanceIds: entry.componentInstanceIds.filter(
                (id) => !consumedRocketIds.includes(id),
              ),
            },
      );

      nextState = {
        ...nextState,
        inventory: inventoryAfterFailure,
        spacecraft: spacecraftAfterFailure,
        log: log(
          nextState,
          `${craft.name} failed to maneuver: thrust ${providedThrust}/${required} after outcomes.`,
        ),
      };
      return updateMissionState(nextState, 'onTurn');
    }
  }

  let inventory = nextState.inventory
    .filter((item) => !consumedRocketIds.includes(item.instanceId))
    .map((item) => (damagedRocketIds.includes(item.instanceId) ? { ...item, damaged: true } : item));

  let spacecraft = nextState.spacecraft.map((entry) => {
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
    : `mass ${check.mass}, thrust ${providedThrust}/${check.requiredThrust}`;
  const spentLog = consumedRocketIds.length > 0 ? `; expended ${consumedRocketIds.length} rocket(s)` : '';
  nextState = {
    ...nextState,
    inventory,
    spacecraft,
    astronauts: nextState.astronauts.map((astronaut) =>
      astronaut.spacecraftId === spacecraftId
        ? {
            ...astronaut,
            visitedLocationIds: astronaut.visitedLocationIds.includes(maneuver.to)
              ? astronaut.visitedLocationIds
              : [...astronaut.visitedLocationIds, maneuver.to],
          }
        : astronaut,
    ),
    log: log(
      nextState,
      `${craft.name} maneuvered ${toLocationName(maneuver.from)} → ${toLocationName(maneuver.to)} (${thrustLog}${spentLog}).`,
    ),
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
    const currentComponents = getSpacecraftComponents(nextState, spacecraftId);
    const capsules = currentComponents.filter(
      (component) => COMPONENT_BY_ID[component.definitionId]?.type === 'capsule',
    );
    if (capsules.length > 0) {
      if (!hasAdvancement(nextState, 'reentry')) {
        const result = destroySpacecraft(
          nextState.inventory,
          nextState.spacecraft,
          nextState.astronauts,
          spacecraftId,
        );
        nextState = {
          ...nextState,
          ...result,
          lostAstronauts: nextState.lostAstronauts + result.astronautLosses,
          log: log(nextState, `${craft.name} was destroyed during re-entry (Re-entry advancement missing).`),
        };
        return updateMissionState(nextState, 'onTurn');
      }

      const draw = drawAdvancementOutcome(nextState, 'reentry');
      nextState = draw.state;
      if (draw.outcome === 'majorFailure') {
        const result = destroySpacecraft(
          nextState.inventory,
          nextState.spacecraft,
          nextState.astronauts,
          spacecraftId,
        );
        nextState = {
          ...nextState,
          ...result,
          lostAstronauts: nextState.lostAstronauts + result.astronautLosses,
          log: log(nextState, `Re-entry major failure: ${craft.name} destroyed.`),
        };
        return updateMissionState(nextState, 'onTurn');
      }
      if (draw.outcome === 'minorFailure') {
        const capsuleToDamage = nextState.inventory.find(
          (component) =>
            component.spacecraftId === spacecraftId &&
            COMPONENT_BY_ID[component.definitionId]?.type === 'capsule' &&
            !component.damaged,
        );
        if (capsuleToDamage) {
          nextState = {
            ...nextState,
            inventory: nextState.inventory.map((component) =>
              component.instanceId === capsuleToDamage.instanceId
                ? { ...component, damaged: true }
                : component,
            ),
            log: log(nextState, `Re-entry minor failure: capsule damaged.`),
          };
        } else {
          nextState = { ...nextState, log: log(nextState, 'Re-entry minor failure: no undamaged capsule to damage.') };
        }
      }
      if (draw.outcome === 'success' || draw.outcome === 'autoSuccess') {
        nextState = { ...nextState, log: log(nextState, 'Re-entry outcome: success.') };
      }
    }
  }

  if (maneuver.landing && !maneuver.optionalLanding) {
    if (!hasAdvancement(nextState, 'landing')) {
      const result = destroySpacecraft(
        nextState.inventory,
        nextState.spacecraft,
        nextState.astronauts,
        spacecraftId,
      );
      nextState = {
        ...nextState,
        ...result,
        lostAstronauts: nextState.lostAstronauts + result.astronautLosses,
        log: log(nextState, `${craft.name} was destroyed landing (Landing advancement missing).`),
      };
      return updateMissionState(nextState, 'onTurn');
    }

    const draw = drawAdvancementOutcome(nextState, 'landing');
    nextState = draw.state;

    if (draw.outcome === 'majorFailure') {
      const result = destroySpacecraft(
        nextState.inventory,
        nextState.spacecraft,
        nextState.astronauts,
        spacecraftId,
      );
      nextState = {
        ...nextState,
        ...result,
        lostAstronauts: nextState.lostAstronauts + result.astronautLosses,
        log: log(nextState, `Landing major failure: spacecraft destroyed.`),
      };
      return updateMissionState(nextState, 'onTurn');
    }
    if (draw.outcome === 'minorFailure') {
      const damaged = damageFirstUndamagedComponent(nextState.inventory, spacecraftId);
      nextState = {
        ...nextState,
        inventory: damaged.inventory,
        log: log(nextState, `Landing minor failure: component damaged.`),
      };
    }
    if (draw.outcome === 'success' || draw.outcome === 'autoSuccess') {
      nextState = {
        ...nextState,
        log: log(nextState, 'Landing outcome: success.'),
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

  return updateMissionState(nextState, 'onTurn');
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
  const outcomeDraw = drawOutcomeCards(state, def.outcomeCount);
  return {
    ...outcomeDraw.state,
    money: outcomeDraw.state.money - def.researchCost,
    advancements: [
      ...outcomeDraw.state.advancements,
      {
        advancementId,
        outcomeCards: outcomeDraw.drawn,
        revealedOutcomeCards: [],
      },
    ],
    log: log(outcomeDraw.state, `Researched ${def.name} for $${def.researchCost}.`),
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
  const normalizedName = name?.trim();
  const spacecraft: Spacecraft = {
    id: spacecraftId,
    name:
      normalizedName && normalizedName.length > 0
        ? normalizedName
        : generateSpacecraftName(
            state.agencyId,
            state.spacecraft.map((craft) => craft.name),
          ),
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

  const astronauts = state.astronauts.map((astronaut) =>
    astronaut.spacecraftId === spacecraftId ? { ...astronaut, spacecraftId: undefined } : astronaut,
  );

  return {
    ...state,
    inventory,
    astronauts,
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

  const nextState: GameState = {
    ...state,
    phase: 'playing',
    year: state.year + 1,
    money: 25,
    inventory: repairedInventory,
    astronauts: healedAstronauts,
    spacecraft,
    log: log(state, `Year ${state.year + 1} begins. Funding replenished to $25.`),
  };

  return updateMissionState(nextState, 'startOfYear');
}

export { COMPONENT_SUPPLY_LIMITS };
