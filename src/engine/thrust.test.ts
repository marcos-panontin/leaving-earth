import { describe, expect, it } from 'vitest';
import { calculateThrustNeeded, canPerformManeuver } from '@/engine/thrust';
import {
  assembleSpacecraft,
  buyComponent,
  canPerformSpacecraftManeuver,
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
});
