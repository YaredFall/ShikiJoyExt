import { useQuery } from "react-query";
import ky from "ky";
import { ApiLinks, defautlQueryConfig } from "./_config";
import { getStoryList } from "../Utils/scraping";

const parser = new DOMParser();

export function useAnimeJoySearch(searchTerm: string) {
    return useQuery(
        ["quickSearch", searchTerm],
        () => {
            if (searchTerm && searchTerm.length >= 3) {
                const formData = new FormData();
                formData.append("do", "search");
                formData.append("subaction", "search");
                formData.append("search_start", "0");
                formData.append("full_start", "0");
                formData.append("result_from", "1");
                formData.append("story", searchTerm);

                return ky.post((import.meta.env.DEV ? ApiLinks.get("dev/animejoy") : "") + "/index.php?do=search", {
                    body: formData
                }).text().then(page => {
                    const doc = parser.parseFromString(page, "text/html");

                    return getStoryList(doc)
                });
            } else {
                return undefined;
            }
        },
        { ...defautlQueryConfig, retry: import.meta.env.DEV ? 2 : false}
    );
}