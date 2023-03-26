import { useQuery } from "react-query";
import { ApiLinks, defautlQueryConfig } from "./_config";
import ky from "ky";

const parser = new DOMParser();

let firstFetch = !import.meta.env.DEV;


// path should be related to domain
// (for example "/tv-serialy/2914-dlya-tebya-bessmertnyy-2-sezon.html")
export const useAnimeJoyAnimePageQuery = (path: string) => {
    
    return useQuery(
        ['animejoy', "page", path],
        () => {
            if (firstFetch) {
                firstFetch = false;
                return document;
            }

            return ky((import.meta.env.DEV ? ApiLinks.get("dev/animejoy") : "") + path)
                .text().then(page => parser.parseFromString(page, "text/html"))
        },
        defautlQueryConfig
    )
}