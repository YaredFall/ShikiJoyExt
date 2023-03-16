import { useQuery } from "react-query";
import { useRef } from "react";
import { defautlQueryConfig } from "./_config";
import ky from "ky";

const parser = new DOMParser();

export const useAnimeJoyAnimePageQuery = (animejoyFullID: string) => {

    const firstFetch = useRef(true);

    return useQuery(
        ['animejoy', 'anime', animejoyFullID],
        () => {
            if (import.meta.env.DEV)
                return ky(`http://localhost:3000/api/test/animejoy/tv-serialy/${animejoyFullID}`)
                    .text().then(page => parser.parseFromString(page, "text/html"))

            if (firstFetch.current) {
                firstFetch.current = false;
                return document;
            }

            return ky(`https://animejoy.ru/tv-serialy/${animejoyFullID}`)
                .text().then(page => parser.parseFromString(page, "text/html"))
        },
        defautlQueryConfig
    )
}