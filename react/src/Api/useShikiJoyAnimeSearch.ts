import { useQuery } from "react-query";
import { ShikiJoyAnimeData } from "../types";
import ky from "ky";
import { useParams } from "react-router-dom";
import { ApiLinks, defautlQueryConfig } from "./_config";

export function useShikiJoyAnimeSearch(shikimoriID:  string | undefined) {

    const { id: fullID } = useParams();

    return useQuery(
        ['shikijoy', 'find', fullID],
        () => {
            return ky.get((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + `api/shikimori/anime/find?id=${shikimoriID}`,
                {
                    credentials: "include"
                })
              .json<ShikiJoyAnimeData>();
        }
        ,
        { ...defautlQueryConfig, enabled: !!shikimoriID }
    );
}