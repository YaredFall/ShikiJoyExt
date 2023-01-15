import {useMemo} from "react";
import {AnimeData} from "../types";

export const useAnimeJoyLegacyStore = (animeData: AnimeData) => {

    const watchedEpisodes = useMemo(() => {
        const watchedEpisodes = new Set<number>();
        animeData.players.forEach(p => {
            p.files.forEach((f, i) => {
                if (localStorage.getItem(`playlists-${animeData.id}-playlist-${f}`) === "1") {
                    watchedEpisodes.add(i);
                }
            })
        })
        console.log(watchedEpisodes);
        return watchedEpisodes;
    }, [animeData]);

    return [watchedEpisodes] as const
}