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
    playlistCategoriesItemsHTML = playlistCategoriesItemsHTML.filter((ci => ci.length > 1)); // ? Not sure
    const studiosHTML = playlistCategoriesItemsHTML.length > 1 ? playlistCategoriesItemsHTML[0]
                                                         : null;
    const playersHTML = playlistCategoriesItemsHTML.at(-1)!;
    const studios = studiosHTML === null ? [{ id: '0', name: undefined }] : Array.from(studiosHTML).map(s => ({
        id: s.getAttribute("data-id")!.split("_").at(-1)!,
        name: s.textContent!
    }));
    const players = Array.from(playersHTML).map(p => {
        const ids = p.getAttribute("data-id")!.split("_");
        return ({
            studioId: ids.at(-2)!,
            playerId: ids.at(-1)!,
            name: p.textContent === "Наш плеер" ? "AnimeJoy" : p.textContent!
        });
    });

    const filesHTML = playlistsHTML.querySelectorAll(".playlists-player .playlists-videos .playlists-items ul li");
    const files = Array.from(filesHTML).map(f => {
        const ids = f.getAttribute("data-id")!.split("_");
        return ({
            studioId: ids.at(-2)!,
            playerId: ids.at(-1)!,
            file: f.getAttribute("data-file")!,
            label: f.textContent as string
        });
    });

    const studiosPlayersAndFiles: StudioData[] = studios.map(s => ({
        name: s.name,
        players: players.filter(p => p.studioId === s.id).map(p => ({
            name: p.name,
            files: files.filter(f => f.studioId === s.id && f.playerId === p.playerId).map(f => ({
                file: f.file,
                label: f.label.replace(/(\d*) (серия)/, '$2 $1')
            }))
        }))
    }));
    console.log(studiosPlayersAndFiles);

    return studiosPlayersAndFiles;
}

// * May be incomplete
const namesList: { short: string, full: string }[] = [
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
    namesList.forEach(n => {
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