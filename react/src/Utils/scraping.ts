import { StudioData, Titles } from "../types";

export function getTitles(parentNode: ParentNode = document): Titles | undefined {
    return parentNode ? {
        ru: parentNode.querySelector(".ntitle")!.textContent!,
        romanji: parentNode.querySelector(".romanji")!.textContent!
    } : undefined;
}

/**
 * @param playlistsHTML - element that contains div.playlists-player
 */
export function getStudiosPlayersAndFiles(playlistsHTML: Element) {
    const playlistCategoriesHTML = Array.from(playlistsHTML.querySelectorAll(".playlists-player .playlists-lists .playlists-items"));
    let playlistCategoriesItemsHTML = playlistCategoriesHTML.map(c => c.querySelectorAll("ul li"));

    const filesHTML = Array.from(playlistsHTML.querySelectorAll(".playlists-player .playlists-videos .playlists-items ul li"));

    type Category = {
        label: string,
        children: Category[] | string | undefined
    }

    let categories = (
        function category(parentID: string = "0", n: number = 0): Category[] | undefined {
            if (playlistCategoriesItemsHTML[n]) {
                return Array.from(playlistCategoriesItemsHTML[n]).map(c => {
                    const id = c.getAttribute("data-id")!;

                    let files = filesHTML.filter(f => id === f.getAttribute("data-id")!).map(f => ({
                        label: f.textContent! ,
                        children: f.getAttribute("data-file")!
                    }));

                    return id.startsWith(parentID + "_") ? {
                        label: c.textContent! === "Наш плеер" ? "AnimeJoy" : c.textContent!,
                        children: files.length > 0 ? files : category(id, n + 1)
                    } : null;
                }).filter(c => c !== null) as Category[];
            } else {
                return undefined;
            }
        })();

    const episodeSetPattern = /^(\d*)(?:\+|-\d*)/i;
    if (playlistCategoriesItemsHTML.length > 1 && categories) {
        categories = (function mergeEpisodeSets(categories: Category[]): Category[] {
            if (!Array.isArray(categories)) {
                return categories;
            } else if (categories.some(c => c.label.match(episodeSetPattern))) {
                const shouldInvert = +categories[0].label.match(episodeSetPattern)![1] < +categories.at(-1)!.label.match(episodeSetPattern)![1];
                    return (shouldInvert ? categories : categories.reverse()).reduce((acc, c) => {
                        if ((c.children as Category[]).some(sc => typeof sc.children === "string")) {
                            acc.push(...(c.children as Category[]));
                        } else {
                            (c.children as Category[]).forEach(sc => {
                                const match = acc.find(uc => uc.label === sc.label);
                                if (match) {
                                    (match.children as Category[]).push(...(sc.children as Category[]));
                                } else {
                                    acc.push(sc);
                                }
                            });
                        }
                        return acc;
                    }, Array<Category>());

            } else {
                return categories.map(c => ({ label: c.label, children: mergeEpisodeSets((c.children as Category[])) }));
            }
        })(categories);
    }

    console.log({ categories });

    const studiosPlayersAndFiles: StudioData[] = ((categories![0].children as Category[])[0].children as Category[])[0]?.children ? categories!.map(c => ({
        name: c.label,
        players: (c.children as Category[]).map(sc => ({
            name: sc.label,
            files: (sc.children as Category[]).map(fc => ({
                label: fc.label,
                file: fc.children as string
            }))
        }))
    })) : [{
        name: undefined,
        players: categories!.map(c => ({
            name: c.label,
            files: (c.children as Category[]).map(fc => ({
                label: fc.label,
                file: fc.children as string
            }))
        }))
    }]

    console.log({ studiosPlayersAndFiles });

    return studiosPlayersAndFiles;
}

// * May be incomplete
const studioNames: { short: string, full: string }[] = [
    { short: "AL", full: "AniLibria" },
    { short: "SR", full: "SovetRomantica" },
    { short: "YRT", full: "YRteam" },
    { short: "TPDB", full: "TheProverbialDustBiter" },
    { short: "UO", full: "Ушастая Озвучка" },
    { short: "YSS", full: "YakuSub Studio" },
    { short: "PV", full: "Трейлеры" },
    { short: "NF", full: "Netflix" }
];

export function fullStudioName(name: string | undefined) {
    if (name === undefined || name === "undefined") return undefined;
    let fullName = name;
    studioNames.forEach(n => {
        if (fullName.includes(n.short)) {
            fullName = fullName.replace(n.short, n.full);
            return fullName;
        }
    });
    return fullName;
}

const matchPattern = /(?<name>^[^\n[]+?)(?= \d{1,4}$| \[\d{1,4} из [\dXХ]{1,4}\]| \[Анонс\]|$) ?(?<count>\d{1,4}|\[\d{1,4} из [\dXХ]{1,4}\]|\[Анонс\])?/mu;

export function splitTitleOrStudioAndEpisodeCount(titleOrStudio: string | undefined) {
    if (titleOrStudio === undefined || titleOrStudio === "undefined") return [undefined, undefined] as const;

    const match = titleOrStudio.match(matchPattern);
    return match ? [match.groups?.name, match.groups?.count] as const : [titleOrStudio, undefined] as const;
}

export function getShikimoriLink(page: Document | undefined) {
    if (!page) return undefined;
    const links = [...page.querySelectorAll(".block .abasel li")].map(e => e.querySelector("a"));
    return links ? links.find(e => e!.textContent === "Shikimori")?.getAttribute("href") : undefined;
}

export function getShikimoriID(page: Document | undefined) {
    const link = getShikimoriLink(page);
    return link?.match(/https:\/\/shikimori\.one\/animes\/\D?(?<id>\d*)-.*/mi)?.groups?.id;
}