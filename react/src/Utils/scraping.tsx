import {PlayerData} from "../types";

/** Returns document.querySelector(selector) on resolve, or null on reject after specified time
 * @param {string} selector - selector
 * @param {boolean} [checkContent = true] - check if element has content before resolving
 * @param {number} [cancelAfter = undefined] - reject promise after specified time in milliseconds (not sooner than N*interval)
 * @param {number} [interval = 50] - time interval in milliseconds between resolving attempts */
export function promiseQuery(selector: string, checkContent = true, cancelAfter: number | undefined = undefined, interval = 50) {
    return new Promise<Element>((res, rej) => {
        let pendingTime = 0;

        const queryInterval = setInterval(() => {
            if (cancelAfter && (pendingTime > cancelAfter)) {
                clearInterval(queryInterval);
                rej(null);
            }

            const queryResult = document.querySelector(selector);
            if ((!checkContent && queryResult) || (checkContent && queryResult?.textContent)) {
                clearInterval(queryInterval);
                res(queryResult)
            }

            pendingTime += interval;
        }, interval)
    })
}

export function getPlayersWithFiles(playlistsHTML: Element) {
    const playersHTML = playlistsHTML.querySelectorAll(".playlists-player .playlists-lists .playlists-items ul li");
    let players = Array<{playerId: string, name: string}>();
    playersHTML.forEach(e => {
        players.push({ playerId: e.getAttribute("data-id")!.split("_").at(-1)!, name: e.textContent! });
    })

    const filesHTML = playlistsHTML.querySelectorAll(".playlists-player .playlists-videos .playlists-items ul li");
    const files = Array<{playerId: string, file: string}>();
    filesHTML.forEach(e => {
        files.push({ playerId: e.getAttribute("data-id")!.split("_").at(-1)!, file: e.getAttribute("data-file")! });
    })

    const playersWithFiles: PlayerData[] = players.map(e => ({ name: e.name, files: files.filter(f => f.playerId === e.playerId).map(f => f.file) }));

    return playersWithFiles;
}