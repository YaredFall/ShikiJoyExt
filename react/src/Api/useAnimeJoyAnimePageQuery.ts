import { useQuery } from "react-query";
import { ApiLinks, defautlQueryConfig } from "./_config";
import ky from "ky";

const parser = new DOMParser();

let firstFetch = !import.meta.env.DEV;

export const useAnimeJoyAnimePageQuery = (animejoyFullID: string) => {
    
    return useQuery(
        ['animejoy', 'anime', animejoyFullID],
        () => {
            if (firstFetch) {
                firstFetch = false;
                return document;
            }
            
            return ky((import.meta.env.DEV ? ApiLinks.get("dev/animejoy") : "") + `/tv-serialy/${animejoyFullID}`)
                .text().then(page => parser.parseFromString(page, "text/html"))
        },
        defautlQueryConfig
    )
}