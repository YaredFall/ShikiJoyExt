console.log("ShikiJoy loaded!");

//Removes default styling
window.addEventListener("DOMContentLoaded", () => {
    const toDelete = [];

    document.head.childNodes.forEach(c => {
        if (c.tagName === "STYLE" || (c.tagName === "LINK" && c.getAttribute("type") === "text/css")) {
            toDelete.push(c);
        }
    })

    toDelete.forEach(c => document.head.removeChild(c))
})


promiseQuery("div.playlists-ajax", true, 5000).then((playlistsHTML) => {
    document.body.textContent = null;
    document.body.classList.add("show");

    const animeId = playlistsHTML.getAttribute("data-news_id");

    window.shikijoyData = {
        id: animeId,
        players: getPlayersWithFiles(playlistsHTML)
    };

    initReactApp();
}, () => alert("query promise was timed out")).catch(() => alert("Error occurred"));


/** Returns document.querySelector(selector) on resolve, or null on reject after specified time
 * @param {string} selector - selector
 * @param {boolean} [checkContent = true] - check if element has content before resolving
 * @param {number} [cancelAfter = undefined] - reject promise after specified time in milliseconds (not sooner than N*interval)
 * @param {number} [interval = 50] - time interval in milliseconds between resolving attempts */
function promiseQuery(selector, checkContent = true, cancelAfter = undefined, interval = 50) {
    return new Promise((res, rej) => {
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

function initReactApp() {
    const appEL = document.createElement("div");
    appEL.setAttribute("id", "app");
    document.body.appendChild(appEL);

    (async () => {
        const react = await import(chrome.runtime.getURL("react/dist/index.js"));
    })();
}

function getPlayersWithFiles(playlistsHTML) {
    const playersHTML = playlistsHTML.querySelectorAll(".playlists-player .playlists-lists .playlists-items ul li");
    let players = [];
    playersHTML.forEach(e => {
        players.push({ playerId: e.getAttribute("data-id").split("_").at(-1), name: e.textContent });
    })

    const filesHTML = playlistsHTML.querySelectorAll(".playlists-player .playlists-videos .playlists-items ul li");
    const files = [];
    filesHTML.forEach(e => {
        files.push({ playerId: e.getAttribute("data-id").split("_").at(-1), file: e.getAttribute("data-file") });
    })

    players = players.map(e => ({ name: e.name, files: files.filter(f => f.playerId === e.playerId).map(f => f.file) }));

    return players;
}
