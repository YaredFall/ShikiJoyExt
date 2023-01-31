import { useQuery } from "react-query";
import mockupPage from "../devMockup/mockupAnimePage.html?raw";
import { useRef } from "react";

const parser = new DOMParser();

export const useAnimeJoyAnimePageQuery = (animejoyFullID: string) => {

    const firstFetch = useRef(true);

    return useQuery(
        ['animejoy', 'anime', animejoyFullID],
        () => {
            if (import.meta.env.DEV)
                return parser.parseFromString(mockupPage, "text/html");

            if (firstFetch.current) {
                firstFetch.current = false;
                return document;
            }

            return fetch(`https://animejoy.ru/tv-serialy/${animejoyFullID}`)
                .then(response => response.text().then(page => parser.parseFromString(page, "text/html")))
        },
        {
            retry: false,
            staleTime: 60 * 1000 * 60 * 12,
            cacheTime: 60 * 1000 * 60 * 12
        }
    )
}