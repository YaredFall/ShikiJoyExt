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
            if (import.meta.env.DEV)
                return ky(`http://localhost:3000/api/shikimori/anime/find?id=${shikimoriID}`)
                    .json<ShikiJoyAnimeData>();
            
            return ky.get((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + `api/shikimori/anime/find?id=${shikimoriID}`)
              .json<ShikiJoyAnimeData>();
        }
        ,
        { ...defautlQueryConfig, enabled: !!shikimoriID }
    );
}