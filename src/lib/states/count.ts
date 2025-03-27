import { create } from "zustand";
import { CountType } from "@/lib/types";

interface CountsData {
  total_attempts: number;
  solved_boards: number;
}

interface CounterState {
  total: number;
  solved: number;
  getCounts: () => void;
  saveCount: (type: CountType) => void;
}

const STORAGE_KEY = "minesweeper_counts";

// Helper functions for localStorage
const getCountsFromStorage = (): CountsData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { total_attempts: 0, solved_boards: 0 };
};

const saveCountsToStorage = (data: CountsData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const useCounterStore = create<CounterState>((set) => ({
  total: 0,
  solved: 0,

  getCounts: () => {
    const counts = getCountsFromStorage();
    set({
      total: counts.total_attempts,
      solved: counts.solved_boards,
    });
  },

  saveCount: (type) => {
    const counts = getCountsFromStorage();

    // Update counts based on the type
    counts.total_attempts += 1;
    if (type === "solved_boards") {
      counts.solved_boards += 1;
    }

    // Save to localStorage
    saveCountsToStorage(counts);

    // Update state
    set({
      total: counts.total_attempts,
      solved: counts.solved_boards,
    });
  },
}));
