
window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("shikijoy");

    const toDelete = [];

    document.head.childNodes.forEach(c => {
        if (c.tagName === "STYLE" || (c.tagName === "LINK" && c.getAttribute("type") === "text/css")) {
            toDelete.push(c);
        }
    })

    toDelete.forEach(c => document.head.removeChild(c))
})

const interval = setInterval(() => {

    const playlists = document.querySelector("div.playlists-ajax");
    if (!playlists?.textContent) return;

    clearInterval(interval);

    document.body.textContent = null;
    document.body.classList.add("show");

    const playersHTML = playlists.querySelectorAll(".playlists-player .playlists-lists .playlists-items ul li");
    let players = [];
    playersHTML.forEach(e => {
        players.push({ playerId: e.getAttribute("data-id").split("_").at(-1), name: e.textContent });
    })

    const filesHTML = playlists.querySelectorAll(".playlists-player .playlists-videos .playlists-items ul li");
    const files = [];
    filesHTML.forEach(e => {
        files.push({ playerId: e.getAttribute("data-id").split("_").at(-1), file: e.getAttribute("data-file") });
    })

    players = players.map(e => ({ name: e.name, files: files.filter(f => f.playerId === e.playerId).map(f => f.file) }));
    const appEL = document.createElement("div");
    appEL.setAttribute("id", "app");
    document.body.appendChild(appEL);
    // console.log(JSON.stringify(players));

    (async () => {
        const react = await import(chrome.runtime.getURL("react/dist/index.js"));
    })();

}, 50);


