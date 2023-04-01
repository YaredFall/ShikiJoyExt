import { getDocumentTitle } from "./scraping";

const singlePagePlayers = ["Alloha", "Kodik"]

export const isSinglePagePlayer = (name: string | undefined) => {
    return name && singlePagePlayers.includes(name);
}

export function updateDocumentTitle(newPage: Document | undefined) {
    const newTitle = getDocumentTitle(newPage);
    if (newTitle) {
        document.title = newTitle;
    }
}