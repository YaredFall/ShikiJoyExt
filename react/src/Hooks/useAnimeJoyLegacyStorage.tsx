import { useCallback, useMemo, useState } from "react";
import { AnimeData } from "../types";

export const useAnimeJoyLegacyStorage = (animeData: AnimeData) => {

    const setEpisodeAsWatched = useCallback((studioId: number, playerId: number, episodeId: number): boolean => {
        const file = animeData.studios[studioId].players[playerId].files[episodeId];
        if (file) {
            localStorage.setItem(`playlists-${animeData.id}-playlist-${file}`, "1");
            watchedEpisodes.add(episodeId);
            setWatchedEpisodesState(new Set(watchedEpisodes));
            return true;
        } else {
            return false;
        }
    }, [animeData]);

    const removeEpisodeFromWatched = useCallback((studioId: number, playerId: number, episodeId: number): boolean => {
        const file = animeData.studios[studioId].players[playerId].files[episodeId];
        if (file) {
            localStorage.removeItem(`playlists-${animeData.id}-playlist-${file}`);
            watchedEpisodes.delete(episodeId);
            setWatchedEpisodesState(new Set(watchedEpisodes));
            return true;
        } else {
            return false;
        }
    }, [animeData]);

    const { watchedEpisodes, studiosUsage, playersUsage } = useMemo(() => {
        const watchedEpisodes = new Set<number>();
        const studiosUsage = Array<number>();
        const playersUsage = Array<Array<number>>();

        animeData.studios.forEach((s, sID) => {
            let watchedWithStudio = 0;
            playersUsage.push(Array<number>());
            s.players.forEach(p => {
                let watchedWithPlayer = 0;
                p.files.forEach((f, i) => {
                    if (localStorage.getItem(`playlists-${animeData.id}-playlist-${f}`) === "1") {
                        watchedEpisodes.add(i);
                        watchedWithPlayer++;
                    }
                });
                watchedWithStudio += watchedWithPlayer;
                playersUsage[sID].push(watchedWithPlayer)
            })
            studiosUsage.push(watchedWithStudio);
        })

        return { watchedEpisodes, studiosUsage, playersUsage };
    }, [animeData]);

    const [watchedEpisodesState, setWatchedEpisodesState] = useState(watchedEpisodes);

    return { watchedEpisodesState, playersUsage, studiosUsage, setEpisodeAsWatched } as const
}