import { useQuery } from "react-query";
import { ApiLinks, defautlQueryConfig } from "./_config";
import ky from "ky";

const parser = new DOMParser();

export const useAnimeJoyAnimePageQuery = (animejoyFullID: string) => {

    return useQuery(
        ['animejoy', 'anime', animejoyFullID],
        () => {
            return ky((import.meta.env.DEV ? ApiLinks.get("dev/animejoy") : "") + `/tv-serialy/${animejoyFullID}`)
                .text().then(page => parser.parseFromString(page, "text/html"))
        },
        defautlQueryConfig
    )
}