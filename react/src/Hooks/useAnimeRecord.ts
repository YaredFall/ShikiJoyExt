import { db } from "../Dexie/db";
import { useQuery } from "react-query";

export const useAnimeRecord = (id: string) => useQuery(
    ["animeRecord", id],
    async () => {
        let anime = await db.anime.where({ animejoyID: id }).first();
        return anime;
    }
)