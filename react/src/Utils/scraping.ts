import { StudioData, Titles } from "../types";

export function getTitles(parentNode: ParentNode = document): Titles {
    return {
        ru: parentNode.querySelector(".ntitle")!.textContent!,
        romanji: parentNode.querySelector(".romanji")!.textContent!
    }
}

/**
 * @param playlistsHTML - div.playlists-ajax
 */
export function getStudiosPlayersAndFiles(playlistsHTML: Element) {
    const studiosAndPlayersHTML = playlistsHTML.querySelectorAll(".playlists-player .playlists-lists .playlists-items");
    const studiosHTML = studiosAndPlayersHTML.length > 1 ? studiosAndPlayersHTML[0].querySelectorAll("ul li")
                                                         : null;
    const playersHTML = studiosAndPlayersHTML[1] ? studiosAndPlayersHTML[1].querySelectorAll("ul li")
                                                 : studiosAndPlayersHTML[0].querySelectorAll("ul li");
    const studios = studiosHTML === null ? [{ id: '0', name: undefined }] : Array.from(studiosHTML).map(s => ({
        id: s.getAttribute("data-id")!.split("_").at(-1)!,
        name: s.textContent!
    }))
    const players = Array.from(playersHTML).map(p => {
        const ids = p.getAttribute("data-id")!.split("_")
        return ({
            studioId: ids.at(-2)!,
            playerId: ids.at(-1)!,
            name: p.textContent === "Наш плеер" ? "AnimeJoy" : p.textContent!
        })
    })

    const filesHTML = playlistsHTML.querySelectorAll(".playlists-player .playlists-videos .playlists-items ul li");
    const files = Array.from(filesHTML).map(f => {
        const ids = f.getAttribute("data-id")!.split("_");
        return ({
            studioId: ids.at(-2)!,
            playerId: ids.at(-1)!,
            file: f.getAttribute("data-file")!
        })
    })

    const studiosPlayersAndFiles: StudioData[] = studios.map(s => ({
        name: s.name?.match(/(.*?) ([0-9]+)/g) ? s.name?.replace(/(.*?) ([0-9]+)/g, "$1 [$2]") : s.name,
        players: players.filter(p => p.studioId === s.id).map(p => ({
            name: p.name,
            files: files.filter(f => f.studioId === s.id && f.playerId === p.playerId).map(f => f.file)
        }))
    }))

    return studiosPlayersAndFiles;
}

//TODO: expand list
const namesList: {short: string, full: string}[] = [
    { short: "AL", full: "AniLibria" },
    { short: "SR", full: "SovetRomantica" },
    { short: "YRT", full: "YRteam" },
    { short: "TPDB", full: "TheProverbialDustBiter"}
]
export function fullStudioName(name: string | undefined) {
    if (name === undefined || name === "undefined") return undefined;
    let fullName = name;
    namesList.forEach(n => {
        if (fullName.includes(n.short)) {
            fullName = fullName.replace(n.short, n.full);
            return fullName;
        }
    })
    return fullName;
}