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
            const endSlash = !path.match(/(?:\/|\.[a-z]{1,4})$/)

            const url = import.meta.env.DEV ? ApiLinks.get("dev/animejoy") + path.replace(/\/$/, '') 
                                            : path + (endSlash ? "/" : "")
            
            return ky(url).text().then(page => parser.parseFromString(page, "text/html"))
        },
        defautlQueryConfig
    )
}