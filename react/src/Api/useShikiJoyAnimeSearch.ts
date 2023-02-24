import { useQuery } from "react-query";
import { ShikiJoyAnimeData } from "../types";
import ky from "ky";
import { useParams } from "react-router-dom";
import { defautlQueryConfig } from "./_config";

export function useShikiJoyAnimeSearch(shikimoriID:  string | undefined) {

    const { id: fullID } = useParams();

    return useQuery(
        ['shikijoy', 'find', fullID],
        () => ky.get(`https://shikijoy.fly.dev/api/shikimori/anime/find?id=${shikimoriID}`)
                               .json<ShikiJoyAnimeData>()
        ,
        { ...defautlQueryConfig, enabled: !!shikimoriID }
    );
}