import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../Dexie/db";

export const useAnimeRecord = (id: string) => useLiveQuery(async () => {
    let anime = await db.anime.where({ animejoyID: id }).first();
    return anime;
}, [id])