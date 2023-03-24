import { db } from "./db";
import { extractLocalStorageData } from "../Utils/legacyLocalStorageParse";
import { AnimeJoyData } from "../types";

export const tryAddAnime = async (animejoyData: AnimeJoyData) => {
    let anime = await db.anime.where({ animejoyID: animejoyData.id }).first();
    if (!anime) {
        const { watchedEpisodes, watchedEpisodesDetails } = extractLocalStorageData(animejoyData)

        const wasWatched = watchedEpisodes.size > 0;
        const lastWatchedEpisode = wasWatched ? Math.max(...watchedEpisodes) : -1;
        const { studioID, playerID } = wasWatched
                                       ? watchedEpisodesDetails.find(e => e.episodeID === lastWatchedEpisode)!.records[0]
                                       : { studioID: 0, playerID: 0}

        anime = {
            animejoyID: animejoyData.id,
            lastEpisode: animejoyData.studios[studioID].players[playerID].files[lastWatchedEpisode+1] ? lastWatchedEpisode+1 : lastWatchedEpisode,
            lastPlayer: playerID,
            lastStudio: studioID,
            watchedEpisodes: watchedEpisodes
        }
        await db.anime.add(anime);
    }
}

type UpdateProps = {
    lastStudio?: number;
    lastPlayer?: number;
    lastEpisode?: number;
    watchedEpisodes?: Set<number>;
}
export const updateAnimeRecord = (id: string, newProps: UpdateProps, onUpdate?: () => void) => {
    db.anime.where("animejoyID").equals(id).modify(newProps).then(_ => onUpdate && onUpdate());
}