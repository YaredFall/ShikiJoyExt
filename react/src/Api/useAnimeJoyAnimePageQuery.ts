import { useQuery } from "react-query";
import { useRef } from "react";
import { ApiLinks, defautlQueryConfig } from "./_config";
import ky from "ky";

const parser = new DOMParser();

export const useAnimeJoyAnimePageQuery = (animejoyFullID: string) => {

    const firstFetch = useRef(true);

    return useQuery(
        ['animejoy', 'anime', animejoyFullID],
        () => {
            if (firstFetch.current) {
                firstFetch.current = false;
                return document;
            }

            return ky((import.meta.env.DEV ? ApiLinks.get("dev/animejoy") : "") + `/tv-serialy/${animejoyFullID}`)
                .text().then(page => parser.parseFromString(page, "text/html"))
        },
        defautlQueryConfig
    )
}