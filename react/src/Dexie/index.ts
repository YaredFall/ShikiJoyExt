import { db } from "./db";

export const tryAddAnime = async (id: string) => {
    let anime = await db.anime.where({ animejoyID: id }).first();
    if (!anime) {
        anime = {
            animejoyID: id,
            lastEpisode: 0,
            lastPlayer: 0,
            lastStudio: 0
        }
        db.anime.add(anime)
    }
}

type UpdateProps = {
    lastStudio?: number;
    lastPlayer?: number;
    lastEpisode?: number;
}
export const updateAnimeRecord = (id: string, newProps: UpdateProps) => {
    db.anime.where("animejoyID").equals(id).modify(newProps);
}