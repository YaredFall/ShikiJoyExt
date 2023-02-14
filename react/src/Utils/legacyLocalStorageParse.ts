import { AnimeJoyData } from "../types";

export function extractLocalStorageData(animeData: AnimeJoyData) {
    const watchedEpisodes = new Set<number>();
    const watchedEpisodesDetails = Array<{
        episodeID: number,
        records: Array<{
            studioID: number,
            studioName: string | undefined,
            playerID: number,
            playerName: string
        }>
    }>()

    animeData.studios.forEach((s, sID) => {
        s.players.forEach((p, pID) => {
            p.files.forEach((f, i) => {
                if (localStorage.getItem(`playlists-${animeData.id}-playlist-${f.file}`) === "1") {
                    watchedEpisodes.add(i);
                    const ep = watchedEpisodesDetails.find(e => e.episodeID === i);
                    if (!ep) {
                        watchedEpisodesDetails.push({
                            episodeID: i,
                            records: [{ studioID: sID, studioName: s.name, playerID: pID, playerName: p.name }]
                        })
                    } else {
                        ep.records.push({ studioID: sID, studioName: s.name, playerID: pID, playerName: p.name })
                    }

                }
            });
        })
    })

    return {
        watchedEpisodes,
        watchedEpisodesDetails
    }
}