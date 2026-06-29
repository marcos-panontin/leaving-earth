import { describe, expect, it } from 'vitest';
import { calculateThrustNeeded, canPerformManeuver } from '@/engine/thrust';
import {
  assembleSpacecraft,
  buyComponent,
  canPerformSpacecraftManeuver,
  endYear,
  performSpacecraftManeuver,
  researchAdvancement,
} from '@/engine/actions';
import { createInitialState, getRemainingMissionPoints } from '@/engine/setup';
import { getManeuver } from '@/data/maneuvers';

describe('thrust engine', () => {
  it('calculates thrust required as mass times difficulty', () => {
    expect(calculateThrustNeeded(2, { difficulty: 2 })).toBe(4);
    expect(calculateThrustNeeded(4, { difficulty: 3 })).toBe(12);
  });

  it('checks whether thrust is sufficient', () => {
    expect(canPerformManeuver(2, 4, { difficulty: 2, exclamation: false })).toBe(true);
    expect(canPerformManeuver(2, 3, { difficulty: 2, exclamation: false })).toBe(false);
    expect(canPerformManeuver(99, 0, { difficulty: 9, exclamation: true })).toBe(true);
  });
});

describe('setup and actions', () => {
  it('draws missions for a hard solo game', () => {
    const state = createInitialState('hard');
    expect(state.missions).toHaveLength(8);
    expect(state.year).toBe(1956);
    expect(state.money).toBe(25);
  });

  it('buys and researches with funding checks', () => {
    let state = createInitialState('hard');
    state = researchAdvancement(state, 'juno');
    expect(state.advancements).toHaveLength(1);
    expect(state.money).toBe(15);
    expect(state.advancements[0].outcomeCards).toHaveLength(3);
    expect(state.outcomeDeck.length).toBe(87);
    state = buyComponent(state, 'juno');
    expect(state.inventory).toHaveLength(1);
    expect(state.money).toBe(14);
  });

  it('tracks remaining mission points for solo scoring', () => {
    const state = createInitialState('hard');
    expect(getRemainingMissionPoints(state)).toBeGreaterThan(0);
  });

  it('executes a spacecraft maneuver and expends non-reusable rockets', () => {
    let state = createInitialState('hard');
    state = researchAdvancement(state, 'juno');
    state.advancements = state.advancements.map((advancement) =>
      advancement.advancementId === 'juno'
        ? { ...advancement, outcomeCards: ['success', 'success', 'success'] }
        : advancement,
    );
    state = buyComponent(state, 'probe');
    state = buyComponent(state, 'juno');
    state = buyComponent(state, 'juno');
    state = buyComponent(state, 'juno');
    state = buyComponent(state, 'juno');

    const inventoryIds = state.inventory.map((item) => item.instanceId);
    state = assembleSpacecraft(state, inventoryIds);
    const craftId = state.spacecraft[0].id;

    const maneuver = getManeuver('earth', 'suborbital-flight');
    expect(maneuver).toBeDefined();

    const check = canPerformSpacecraftManeuver(state, craftId, maneuver!.id);
    expect(check.ok).toBe(true);
    expect(check.requiredThrust).toBe(15);
    expect(check.providedThrust).toBe(16);

    state = performSpacecraftManeuver(state, craftId, maneuver!.id);
    expect(state.spacecraft[0].locationId).toBe('suborbital-flight');
    expect(state.spacecraft[0].componentInstanceIds).toHaveLength(1);
  });

  it('destroys spacecraft on re-entry without re-entry advancement', () => {
    let state = createInitialState('hard');
    state = buyComponent(state, 'vostok');
    const inventoryIds = state.inventory.map((item) => item.instanceId);
    state = assembleSpacecraft(state, inventoryIds);
    const craftId = state.spacecraft[0].id;
    state.spacecraft[0].locationId = 'earth-orbit';

    const maneuver = getManeuver('earth-orbit', 'earth');
    expect(maneuver).toBeDefined();

    state = performSpacecraftManeuver(state, craftId, maneuver!.id);
    expect(state.spacecraft.find((craft) => craft.id === craftId)).toBeUndefined();
  });

  it('destroys spacecraft on landing without landing advancement', () => {
    let state = createInitialState('hard');
    state = researchAdvancement(state, 'juno');
    state = buyComponent(state, 'probe');
    state = buyComponent(state, 'juno');
    state = buyComponent(state, 'juno');
    const inventoryIds = state.inventory.map((item) => item.instanceId);
    state = assembleSpacecraft(state, inventoryIds);
    const craftId = state.spacecraft[0].id;
    state.spacecraft[0].locationId = 'lunar-orbit';

    const maneuver = getManeuver('lunar-orbit', 'moon');
    expect(maneuver).toBeDefined();

    const canDo = canPerformSpacecraftManeuver(state, craftId, maneuver!.id);
    expect(canDo.ok).toBe(true);

    state = performSpacecraftManeuver(state, craftId, maneuver!.id);
    expect(state.spacecraft.find((craft) => craft.id === craftId)).toBeUndefined();
  });

  it('uses re-entry outcome cards and destroys on major failure', () => {
    let state = createInitialState('hard');
    state = buyComponent(state, 'vostok');
    const inventoryIds = state.inventory.map((item) => item.instanceId);
    state = assembleSpacecraft(state, inventoryIds);
    const craftId = state.spacecraft[0].id;
    state.spacecraft[0].locationId = 'earth-orbit';

    state.advancements.push({
      advancementId: 'reentry',
      outcomeCards: ['majorFailure'],
      revealedOutcomeCards: [],
    });

    const maneuver = getManeuver('earth-orbit', 'earth');
    expect(maneuver).toBeDefined();

    state = performSpacecraftManeuver(state, craftId, maneuver!.id);
    expect(state.spacecraft.find((craft) => craft.id === craftId)).toBeUndefined();
  });

  it('uses landing outcome cards and damages component on minor failure', () => {
    let state = createInitialState('hard');
    state = researchAdvancement(state, 'juno');
    state = buyComponent(state, 'probe');
    state = buyComponent(state, 'juno');
    state = buyComponent(state, 'juno');
    const inventoryIds = state.inventory.map((item) => item.instanceId);
    state = assembleSpacecraft(state, inventoryIds);
    const craftId = state.spacecraft[0].id;
    state.spacecraft[0].locationId = 'lunar-orbit';

    state.advancements.push({
      advancementId: 'landing',
      outcomeCards: ['minorFailure'],
      revealedOutcomeCards: [],
    });

    const maneuver = getManeuver('lunar-orbit', 'moon');
    expect(maneuver).toBeDefined();
    state = performSpacecraftManeuver(state, craftId, maneuver!.id);
    const craftAfter = state.spacecraft.find((craft) => craft.id === craftId);
    expect(craftAfter).toBeDefined();
    const damagedCount = state.inventory.filter(
      (item) => item.spacecraftId === craftId && item.damaged,
    ).length;
    expect(damagedCount).toBeGreaterThan(0);
  });

  it('auto-completes sounding rocket mission and awards points', () => {
    let state = createInitialState('hard');
    state.missions = [{ definitionId: 'sounding-rocket', completed: false, removed: false }];
    state.score = 0;

    state = researchAdvancement(state, 'juno');
    state.advancements = state.advancements.map((advancement) =>
      advancement.advancementId === 'juno'
        ? { ...advancement, outcomeCards: ['success', 'success', 'success'] }
        : advancement,
    );
    state = buyComponent(state, 'probe');
    state = buyComponent(state, 'juno');
    state = buyComponent(state, 'juno');
    state = buyComponent(state, 'juno');
    state = buyComponent(state, 'juno');

    const inventoryIds = state.inventory.map((item) => item.instanceId);
    state = assembleSpacecraft(state, inventoryIds);
    const craftId = state.spacecraft[0].id;
    const maneuver = getManeuver('earth', 'suborbital-flight');
    expect(maneuver).toBeDefined();

    state = performSpacecraftManeuver(state, craftId, maneuver!.id);
    expect(state.score).toBe(1);
    expect(state.missions[0].completed).toBe(true);
  });

  it('removes impossible mission when location is revealed destroyed', () => {
    let state = createInitialState('hard');
    state.missions = [{ definitionId: 'venus-lander', completed: false, removed: false }];
    state.revealedLocations = state.revealedLocations.map((location) =>
      location.locationId === 'venus'
        ? { ...location, revealed: true, variantId: 'venus-destroyed-1' }
        : location,
    );

    state = endYear(state);
    expect(state.missions[0].removed).toBe(true);
  });
});
