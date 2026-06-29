import type { AgencyDefinition } from '@/engine/types';

export const AGENCIES: AgencyDefinition[] = [
  { id: 'nasa', name: 'NASA', country: 'United States', color: '#2563eb' },
  { id: 'okb1', name: 'OKB-1', country: 'Soviet Union', color: '#dc2626' },
  { id: 'cnes', name: 'CNES', country: 'France', color: '#6b7280' },
  { id: 'isas', name: 'ISAS', country: 'Japan', color: '#f8fafc' },
  { id: 'sac', name: 'SAC', country: 'China', color: '#facc15' },
];

export const DEFAULT_AGENCY_ID = 'nasa';

/** Max payload chart from rulebook (mass per rocket type at difficulty). */
export const MAX_PAYLOAD_CHART: Record<string, Record<number, number>> = {
  juno: { 1: 3, 2: 1, 3: 1 / 3, 4: 0.75, 5: 0.4, 6: 0.5, 7: 0.43, 8: 1, 9: 0.22 },
  atlas: { 1: 23, 2: 9.5, 3: 5, 4: 2.75, 5: 1.4, 6: 4 / 3, 7: 2.43, 8: 1, 9: 0.22 },
  soyuz: { 1: 71, 2: 31, 3: 17 + 2 / 3, 4: 11, 5: 7, 6: 4 + 1 / 3, 7: 2.43, 8: 1, 9: 0.22 },
  saturn: { 1: 180, 2: 80, 3: 46 + 2 / 3, 4: 30, 5: 20, 6: 13 + 1 / 3, 7: 8.57, 8: 5, 9: 2.22 },
};
