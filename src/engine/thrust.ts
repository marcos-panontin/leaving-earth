import type { ComponentDefinition, ManeuverDefinition } from '@/engine/types';
import { COMPONENT_BY_ID } from '@/data/components';

export function calculateMass(componentIds: string[], getDefinition: (id: string) => ComponentDefinition | undefined): number {
  return componentIds.reduce((total, id) => {
    const def = getDefinition(id);
    return total + (def?.mass ?? 0);
  }, 0);
}

export function calculateThrustNeeded(mass: number, maneuver: Pick<ManeuverDefinition, 'difficulty'>): number {
  return mass * maneuver.difficulty;
}

export function calculateRocketThrust(
  rockets: Array<{ definitionId: string; quantity: number }>,
  maneuver: Pick<ManeuverDefinition, 'hourglasses'>,
): number {
  return rockets.reduce((total, rocket) => {
    const def = COMPONENT_BY_ID[rocket.definitionId];
    if (!def) return total;
    if (def.isReusable) {
      return total + def.thrust * rocket.quantity * Math.max(maneuver.hourglasses, 1);
    }
    return total + def.thrust * rocket.quantity;
  }, 0);
}

export function canPerformManeuver(
  mass: number,
  thrustProvided: number,
  maneuver: Pick<ManeuverDefinition, 'difficulty' | 'exclamation'>,
): boolean {
  if (maneuver.exclamation) return true;
  return thrustProvided >= calculateThrustNeeded(mass, maneuver);
}

export function calculateMaxPayload(
  rocketMass: number,
  thrustProvided: number,
  maneuver: Pick<ManeuverDefinition, 'difficulty'>,
): number | 'inf' {
  if (thrustProvided <= 0) return 0;
  if (maneuver.difficulty === 0) return 'inf';
  const payload = thrustProvided / maneuver.difficulty - rocketMass;
  return Math.max(0, Math.round(payload * 100) / 100);
}
