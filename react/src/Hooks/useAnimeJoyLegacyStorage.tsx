import { useCallback, useMemo } from "react";
import { AnimeJoyData } from "../types";
import { extractLocalStorageData } from "../Utils/legacyLocalStorageParse";

export const useAnimeJoyLegacyStorage = (animeData: AnimeJoyData) => {

    const setEpisodeAsWatched = useCallback((studioId: number, playerId: number, episodeId: number): boolean => {
        const file = animeData.studios[studioId].players[playerId].files[episodeId];
        if (file) {
            localStorage.setItem(`playlists-${animeData.id}-playlist-${file}`, "1");
            watchedEpisodes.add(episodeId);
            return true;
        } else {
            return false;
        }
    }, [animeData]);


    /**
     * @description NOTE: removes ALL localStorage records of given episode
     */
    const removeEpisodeFromWatched = useCallback((episodeID: number) => {
        animeData.studios.forEach(s => {
            s.players.forEach(p => {
                const file = p.files[episodeID];
                if (file) {
                    localStorage.removeItem(`playlists-${animeData.id}-playlist-${file}`);
                    watchedEpisodes.delete(episodeID);
                }
            })
        });
    }, [animeData]);


    const { watchedEpisodes } = useMemo(() => extractLocalStorageData(animeData), [animeData]);

    return { removeEpisodeFromWatched, setEpisodeAsWatched } as const
}