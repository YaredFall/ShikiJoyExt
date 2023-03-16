import { useQuery } from "react-query";
import { StudioData } from "../types";
import { getStudiosPlayersAndFiles } from "../Utils/scraping";
import { defautlQueryConfig } from "./_config";
import ky from "ky";

type AnimeJoyPlaylistResponse = { 
    success: boolean, 
    response: string 
}

export const useAnimeJoyPlaylistQuery = (animejoyID: string) => {

    return useQuery<StudioData[]>(
        ['animejoy', 'playlist', animejoyID],
        () => {
            if (import.meta.env.DEV) {
                return ky(`http://localhost:3000/api/test/animejoy/engine/ajax/playlists.php?news_id=${animejoyID}&xfield=playlist`)
                    .json<AnimeJoyPlaylistResponse>().then(data => decodeURI(data.response))
                    .then(playlistString => {
                        const doc = document.implementation.createHTMLDocument();
                        doc.body.innerHTML = playlistString;

                        return getStudiosPlayersAndFiles(doc.body);
                    });
            }

            return ky(`/engine/ajax/playlists.php?news_id=${animejoyID}&xfield=playlist`)
                .json<AnimeJoyPlaylistResponse>().then(data => decodeURI(data.response))
                .then(playlistString => {
                    const doc = document.implementation.createHTMLDocument();
                    doc.body.innerHTML = playlistString;

                    return getStudiosPlayersAndFiles(doc.body);
                });
        },
        defautlQueryConfig
    )
}