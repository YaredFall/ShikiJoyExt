import { create } from "zustand";
import { AnimeJoyData } from "../types";

type AnimeDataState = {
    data: AnimeJoyData | null
    set: (to: AnimeJoyData) => void
}

export const useAnimeDataStore = create<AnimeDataState>()((set) => ({
    data: null,
    set: (to) => set(state => ({ data: to }))
}));