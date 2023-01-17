import { create } from "zustand";
import { AnimeData } from "../types";

type AnimeDataState = {
    data: AnimeData | null
    set: (to: AnimeData) => void
}

export const useAnimeDataStore = create<AnimeDataState>()((set) => ({
    data: null,
    set: (to) => set(state => ({ data: to }))
}));