import { useQuery } from "react-query";
import { StudioData } from "../types";
import { getStudiosPlayersAndFiles } from "../Utils/scraping";
import mockupData from "../devMockup/mockupAnimeJoyPlaylistData.json";

export const useAnimeJoyPlaylistQuery = (animejoyID: string) => {

    return useQuery<StudioData[]>(
        ['animejoy', 'playlist', animejoyID],
        () => {
            if (import.meta.env.DEV)
                return mockupData;

            return fetch(`/engine/ajax/playlists.php?news_id=${animejoyID}&xfield=playlist`)
                .then(response => response.json().then(data => decodeURI(data.response)))
                .then(playlistString => {
                    const doc = document.implementation.createHTMLDocument();
                    doc.body.innerHTML = playlistString;

                    return getStudiosPlayersAndFiles(doc.body)
                })
        },
        {
            retry: false,
            staleTime: 60 * 1000 * 60 * 12,
            cacheTime: 60 * 1000 * 60 * 12
        }
    )
}