import { useQuery } from "react-query";
import { ShikiJoyAnimeData, ShikimoriAnimeCoreData, ShikimoriAnimePreviewData } from "../types";
import ky from "ky";
import { getTitles } from "../Utils/scraping";
import { useParams } from "react-router-dom";
import { defautlQueryConfig } from "./_config";

export function useShikiJoyAnimeSearch(pageDocument: Document | undefined) {

    const { id: fullID } = useParams();

    return useQuery(
        ['shikijoy', 'find', fullID],
        () => ky.get(`https://shikijoy.fly.dev/api/shikimori/anime/find?name=${getTitles(pageDocument).romanji}`)
                               .json<ShikiJoyAnimeData>()
        ,
        { ...defautlQueryConfig, enabled: !!pageDocument }
    );
}