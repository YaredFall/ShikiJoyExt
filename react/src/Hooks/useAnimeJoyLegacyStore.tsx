import {playerData} from "../Components/Player";
import {useMemo} from "react";

export const useAnimeJoyLegacyStore = (availablePlayers: playerData[]) => {

    const watchedEpisodes = useMemo(() => {
        const watchedEpisodes = new Set<number>();
        availablePlayers.forEach(p => {
            p.files.forEach((f, i) => {
                if (localStorage.getItem(f) === "1") {
                    watchedEpisodes.add(i)
                }
            })
        })
        console.log(watchedEpisodes);
        return watchedEpisodes;
    }, [availablePlayers]);

    return [watchedEpisodes] as const
}