"use client";

import { create } from "zustand";

/**
 * Tiny shared store so the Pricing section can preselect a plan
 * and the Join form reads it (both are client components).
 */
interface JoinState {
  planId: string | null;
  setPlanId: (planId: string | null) => void;
}

export const useJoinStore = create<JoinState>((set) => ({
  planId: null,
  setPlanId: (planId) => set({ planId }),
}));
