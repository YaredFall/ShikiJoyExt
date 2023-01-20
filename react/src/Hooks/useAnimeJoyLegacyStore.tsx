import {useMemo} from "react";
import {AnimeData} from "../types";

export const useAnimeJoyLegacyStore = (animeData: AnimeData) => {

    const [watchedEpisodes, playersUsage] = useMemo(() => {
        const watchedEpisodes = new Set<number>();
        const playersUsage = Array<number>();

        animeData.studios.forEach(s => {
            s.players.forEach(p => {
                let watchedWithPlayer = 0;
                p.files.forEach((f, i) => {
                    if (localStorage.getItem(`playlists-${animeData.id}-playlist-${f}`) === "1") {
                        watchedEpisodes.add(i);
                        watchedWithPlayer++;
                    }
                });
                playersUsage.push(watchedWithPlayer)
            })
        })

        console.log({ watchedEpisodes, playersUsage });
        return [watchedEpisodes, playersUsage];
    }, [animeData]);

    return [watchedEpisodes, playersUsage] as const
}