import type { ExplorableLocationDefinition, FixedLocationDefinition } from '@/engine/types';

export const FIXED_LOCATIONS: FixedLocationDefinition[] = [
  { id: 'phobos', name: 'Phobos', image: '/images/locationImages/PhobosUnexplored.jpg', gridArea: 'PhobosUnexplored', rotation: 90 },
  { id: 'mars-flyby', name: 'Mars Fly-By', image: '/images/locationImages/MarsFlyby.jpg', gridArea: 'MarsFlyby', rotation: 90 },
  { id: 'ceres', name: 'Ceres', image: '/images/locationImages/Ceres-unexplored.jpg', gridArea: 'CeresUnexplored' },
  { id: 'venus-orbit', name: 'Venus Orbit', image: '/images/locationImages/VenusOrbit.jpg', gridArea: 'VenusOrbit', rotation: -90 },
  { id: 'venus', name: 'Venus', image: '/images/locationImages/VenusUnexplored.jpg', gridArea: 'VenusUnexplored', rotation: -90 },
  { id: 'mars', name: 'Mars', image: '/images/locationImages/MarsUnexplored.jpg', gridArea: 'MarsUnexplored', rotation: 90 },
  { id: 'lunar-orbit', name: 'Lunar Orbit', image: '/images/locationImages/LunarOrbit.jpg', gridArea: 'LunarOrbit', rotation: -90 },
  { id: 'mars-orbit', name: 'Mars Orbit', image: '/images/locationImages/MarsOrbit.jpg', gridArea: 'MarsOrbit', rotation: 90 },
  { id: 'inner-planets-transfer', name: 'Inner Planets Transfer', image: '/images/locationImages/InnerPlanetsTransferWithMercury.jpg', gridArea: 'InnerPlanetsTransferWithMercury' },
  { id: 'venus-flyby', name: 'Venus Fly-By', image: '/images/locationImages/VenusFlyby.jpg', gridArea: 'VenusFlyby', rotation: -90 },
  { id: 'earth-orbit', name: 'Earth Orbit', image: '/images/locationImages/Earthorbit.jpg', gridArea: 'Earthorbit' },
  { id: 'moon', name: 'Moon', image: '/images/locationImages/MoonUnexplored.jpg', gridArea: 'MoonUnexplored', rotation: -90 },
  { id: 'suborbital-flight', name: 'Suborbital Flight', image: '/images/locationImages/SuborbitalFlightUnexplored.jpg', gridArea: 'SuborbitalFlightUnexplored' },
  { id: 'lunar-flyby', name: 'Lunar Fly-By', image: '/images/locationImages/LunarFlyBy.jpg', gridArea: 'LunarFlyBy', rotation: -90 },
  { id: 'earth', name: 'Earth', image: '/images/locationImages/Earth.jpg', gridArea: 'Earth' },
  { id: 'solar-radiation', name: 'Solar Radiation', image: '/images/locationImages/SolarRadiationUnexplored.jpg', gridArea: 'SolarRadiationUnexplored' },
];

export const EXPLORABLE_LOCATIONS: ExplorableLocationDefinition[] = [
  {
    id: 'moon',
    name: 'Moon',
    imageUnexplored: '/images/locationImages/MoonUnexplored.jpg',
    variants: [
      { id: 'moon-empty-1', type: 'empty', label: 'Barren lunar surface' },
      { id: 'moon-minerals-1', type: 'minerals', label: 'Mineral deposits' },
      { id: 'moon-supplies-1', type: 'supplies', label: 'Recoverable supplies' },
      { id: 'moon-destroyed-1', type: 'destroyed', label: 'Impossible landing' },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    imageUnexplored: '/images/locationImages/MarsUnexplored.jpg',
    variants: [
      { id: 'mars-empty-1', type: 'empty', label: 'Barren desert' },
      { id: 'mars-life-1', type: 'life', label: 'Signs of life' },
      { id: 'mars-destroyed-1', type: 'destroyed', label: 'Impossible landing' },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    imageUnexplored: '/images/locationImages/VenusUnexplored.jpg',
    variants: [
      { id: 'venus-empty-1', type: 'empty', label: 'Hostile but landable' },
      { id: 'venus-destroyed-1', type: 'destroyed', label: 'Surface destroyed' },
      { id: 'venus-sickness-1', type: 'sickness', label: 'Sickness hazard' },
      { id: 'venus-life-1', type: 'life', label: 'Airborne life' },
    ],
  },
  {
    id: 'ceres',
    name: 'Ceres',
    imageUnexplored: '/images/locationImages/Ceres-unexplored.jpg',
    variants: [
      { id: 'ceres-minerals-1', type: 'minerals', label: 'Mineral rich' },
      { id: 'ceres-empty-1', type: 'empty', label: 'Barren asteroid' },
      { id: 'ceres-destroyed-1', type: 'destroyed', label: 'Impossible landing' },
    ],
  },
  {
    id: 'phobos',
    name: 'Phobos',
    imageUnexplored: '/images/locationImages/PhobosUnexplored.jpg',
    variants: [
      { id: 'phobos-empty-1', type: 'empty', label: 'Small moonlet' },
      { id: 'phobos-alien-1', type: 'alienOrigin', label: 'Hollow alien origin' },
      { id: 'phobos-destroyed-1', type: 'destroyed', label: 'Impossible landing' },
    ],
  },
  {
    id: 'solar-radiation',
    name: 'Solar Radiation',
    imageUnexplored: '/images/locationImages/SolarRadiationUnexplored.jpg',
    variants: [
      { id: 'solar-rad-1', type: 'sickness', label: 'Radiation level 1' },
      { id: 'solar-rad-2', type: 'sickness', label: 'Radiation level 2' },
      { id: 'solar-rad-3', type: 'sickness', label: 'Radiation level 3' },
      { id: 'solar-rad-4', type: 'sickness', label: 'Radiation level 4' },
    ],
  },
  {
    id: 'suborbital-flight',
    name: 'Suborbital Flight',
    imageUnexplored: '/images/locationImages/SuborbitalFlightUnexplored.jpg',
    variants: [
      { id: 'suborbital-safe-1', type: 'empty', label: 'Survivable' },
      { id: 'suborbital-fatal-1', type: 'destroyed', label: 'Fatal to astronauts' },
      { id: 'suborbital-fatal-2', type: 'destroyed', label: 'Fatal to astronauts' },
      { id: 'suborbital-fatal-3', type: 'destroyed', label: 'Fatal to astronauts' },
    ],
  },
];

export const ALL_LOCATION_IDS = [
  ...FIXED_LOCATIONS.map((l) => l.id),
];

export const LOCATION_NAME_BY_ID: Record<string, string> = Object.fromEntries(
  FIXED_LOCATIONS.map((l) => [l.id, l.name]),
);

/** Map legacy maneuver location strings to canonical ids. */
export const MANEUVER_LOCATION_ALIASES: Record<string, string> = {
  'Earth': 'earth',
  'Earth Orbit': 'earth-orbit',
  'Suborbital Flight': 'suborbital-flight',
  'Suborbital Space': 'suborbital-flight',
  'Lunar FlyBy': 'lunar-flyby',
  'Lunar Fly-By': 'lunar-flyby',
  'Lunar Orbit': 'lunar-orbit',
  'Moon': 'moon',
  'Inner Planets Transfer': 'inner-planets-transfer',
  'Inner Plan Trans': 'inner-planets-transfer',
  'Mars FlyBy': 'mars-flyby',
  'Mars Fly-By': 'mars-flyby',
  'Mars Orbit': 'mars-orbit',
  'Mars': 'mars',
  'Phobos': 'phobos',
  'Ceres': 'ceres',
  'Venus FlyBy': 'venus-flyby',
  'Venus Fly-By': 'venus-flyby',
  'Venus Orbit': 'venus-orbit',
  'Venus': 'venus',
  'Solar Radiation': 'solar-radiation',
};

export function toLocationId(name: string): string {
  return MANEUVER_LOCATION_ALIASES[name] ?? name.toLowerCase().replace(/\s+/g, '-');
}

export function toLocationName(id: string): string {
  return LOCATION_NAME_BY_ID[id] ?? id;
}
