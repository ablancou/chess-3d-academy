import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProgressState {
  xp: number;
  completedNodes: string[];
  currentNodeId: string;
}

interface ProgressStore extends ProgressState {
  addXP: (amount: number) => void;
  completeNode: (nodeId: string) => void;
  setCurrentNode: (nodeId: string) => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      xp: 0,
      completedNodes: [],
      currentNodeId: "basics-1",
      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
      completeNode: (nodeId) =>
        set((state) => ({
          completedNodes: state.completedNodes.includes(nodeId)
            ? state.completedNodes
            : [...state.completedNodes, nodeId],
        })),
      setCurrentNode: (nodeId) => set({ currentNodeId: nodeId }),
    }),
    { name: "chess-3d-progress" }
  )
);
