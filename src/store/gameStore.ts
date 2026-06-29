import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdvancementId, GameDifficulty, GameState } from '@/engine/types';
import {
  assembleSpacecraft,
  buyComponent,
  canCollectSample,
  canPerformSpacecraftManeuver,
  collectSample,
  disassembleSpacecraft,
  endYear,
  performSpacecraftManeuver,
  researchAdvancement,
  resetIdCounter,
} from '@/engine/actions';
import { createInitialState, isGameOver, isSoloVictory } from '@/engine/setup';

interface GameStore {
  state: GameState;
  selectedInventoryIds: string[];
  selectedSpacecraftId: string | null;
  newGame: (difficulty?: GameDifficulty) => void;
  toggleInventorySelection: (instanceId: string) => void;
  clearSelection: () => void;
  selectSpacecraft: (spacecraftId: string | null) => void;
  buy: (componentId: string) => void;
  research: (advancementId: AdvancementId) => void;
  assemble: () => void;
  disassemble: (spacecraftId: string) => void;
  performManeuver: (maneuverId: string) => void;
  canManeuver: (maneuverId: string) => ReturnType<typeof canPerformSpacecraftManeuver>;
  collectSample: () => void;
  canCollectSample: () => ReturnType<typeof canCollectSample>;
  advanceYear: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      state: createInitialState('hard'),
      selectedInventoryIds: [],
      selectedSpacecraftId: null,

      newGame: (difficulty = 'hard') => {
        resetIdCounter();
        set({
          state: createInitialState(difficulty),
          selectedInventoryIds: [],
          selectedSpacecraftId: null,
        });
      },

      toggleInventorySelection: (instanceId) => {
        const current = get().selectedInventoryIds;
        set({
          selectedInventoryIds: current.includes(instanceId)
            ? current.filter((id) => id !== instanceId)
            : [...current, instanceId],
        });
      },

      clearSelection: () => set({ selectedInventoryIds: [] }),
      selectSpacecraft: (spacecraftId) => set({ selectedSpacecraftId: spacecraftId }),

      buy: (componentId) => {
        set((store) => ({ state: buyComponent(store.state, componentId) }));
      },

      research: (advancementId) => {
        set((store) => ({ state: researchAdvancement(store.state, advancementId) }));
      },

      assemble: () => {
        const { state, selectedInventoryIds } = get();
        const next = assembleSpacecraft(state, selectedInventoryIds);
        const latestCraft =
          next.spacecraft.length > 0 ? next.spacecraft[next.spacecraft.length - 1] : undefined;
        set({ state: next, selectedInventoryIds: [], selectedSpacecraftId: latestCraft?.id ?? null });
      },

      disassemble: (spacecraftId) => {
        set((store) => ({
          state: disassembleSpacecraft(store.state, spacecraftId),
          selectedSpacecraftId:
            store.selectedSpacecraftId === spacecraftId ? null : store.selectedSpacecraftId,
        }));
      },

      performManeuver: (maneuverId) => {
        const { selectedSpacecraftId } = get();
        if (!selectedSpacecraftId) return;
        set((store) => {
          const state = performSpacecraftManeuver(store.state, selectedSpacecraftId, maneuverId);
          const stillExists = state.spacecraft.some((craft) => craft.id === selectedSpacecraftId);
          return {
            state,
            selectedSpacecraftId: stillExists ? selectedSpacecraftId : null,
          };
        });
      },

      canManeuver: (maneuverId) => {
        const { state, selectedSpacecraftId } = get();
        if (!selectedSpacecraftId) {
          return {
            ok: false,
            reason: 'Select a spacecraft first.',
            requiredThrust: 0,
            providedThrust: 0,
            mass: 0,
          };
        }
        return canPerformSpacecraftManeuver(state, selectedSpacecraftId, maneuverId);
      },

      collectSample: () => {
        const { selectedSpacecraftId } = get();
        if (!selectedSpacecraftId) return;
        set((store) => ({
          state: collectSample(store.state, selectedSpacecraftId),
        }));
      },

      canCollectSample: () => {
        const { state, selectedSpacecraftId } = get();
        if (!selectedSpacecraftId) {
          return { ok: false, reason: 'Select a spacecraft first.' };
        }
        return canCollectSample(state, selectedSpacecraftId);
      },

      advanceYear: () => {
        set((store) => ({ state: endYear(store.state) }));
      },
    }),
    {
      name: 'leaving-earth-save',
      partialize: (store) => ({ state: store.state }),
    },
  ),
);

export function useGameStatus() {
  const state = useGameStore((s) => s.state);
  return {
    gameOver: isGameOver(state),
    victory: isSoloVictory(state),
    phase: state.phase,
  };
}
