import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdvancementId, GameDifficulty, GameState } from '@/engine/types';
import {
  assembleSpacecraft,
  buyComponent,
  disassembleSpacecraft,
  endYear,
  researchAdvancement,
  resetIdCounter,
} from '@/engine/actions';
import { createInitialState, isGameOver, isSoloVictory } from '@/engine/setup';

interface GameStore {
  state: GameState;
  selectedInventoryIds: string[];
  newGame: (difficulty?: GameDifficulty) => void;
  toggleInventorySelection: (instanceId: string) => void;
  clearSelection: () => void;
  buy: (componentId: string) => void;
  research: (advancementId: AdvancementId) => void;
  assemble: () => void;
  disassemble: (spacecraftId: string) => void;
  advanceYear: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      state: createInitialState('hard'),
      selectedInventoryIds: [],

      newGame: (difficulty = 'hard') => {
        resetIdCounter();
        set({
          state: createInitialState(difficulty),
          selectedInventoryIds: [],
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

      buy: (componentId) => {
        set((store) => ({ state: buyComponent(store.state, componentId) }));
      },

      research: (advancementId) => {
        set((store) => ({ state: researchAdvancement(store.state, advancementId) }));
      },

      assemble: () => {
        const { state, selectedInventoryIds } = get();
        const next = assembleSpacecraft(state, selectedInventoryIds);
        set({ state: next, selectedInventoryIds: [] });
      },

      disassemble: (spacecraftId) => {
        set((store) => ({ state: disassembleSpacecraft(store.state, spacecraftId) }));
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
