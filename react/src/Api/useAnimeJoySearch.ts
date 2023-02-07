import { useQuery } from "react-query";
import ky from "ky";

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

                return ky.post("/index.php?do=search", {
                    body: formData
                }).text().then(page => {
                    const doc = parser.parseFromString(page, "text/html");
                    const articles = Array.from(doc.querySelectorAll("article.block.story.shortstory"));
                    if (!articles || articles.length === 0) {
                        return undefined;
                    }
                    return articles.map(e => ({
                        link: e.querySelector(".ntitle > a")?.getAttribute("href")?.replace("https://animejoy.ru", "") || undefined,
                        ru: e.querySelector(".ntitle")?.textContent || undefined,
                        romanji: e.querySelector(".romanji")?.textContent || undefined,
                        posterSrc: e.querySelector("img")?.getAttribute("src") || undefined
                    }))
                })
            } else {
                return undefined;
            }
        },
        {
            retry: false,
            staleTime: 60 * 1000 * 60 * 12,
            cacheTime: 60 * 1000 * 60 * 12
        }
        )
}