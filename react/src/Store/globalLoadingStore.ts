import { create } from "zustand";

type globalLoadingState = {
    count: number
    increase: () => void
    decrease: () => void
}

export const useGlobalLoadingStore = create<globalLoadingState>()((set) => {
    return ({
        count: 1,
        increase: () => set((state) => ({count: state.count + 1})),
        decrease: () => set((state) => ({count: state.count - 1}))
    });
});