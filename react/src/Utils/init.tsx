import { getStudiosPlayersAndFiles, promiseQuery } from "./scraping";
import { AnimeData, Titles } from "../types";
import ReactDOM from "react-dom/client";
import React from "react";
import App from "../App";

function removeDefaultStylesOnLoad() {
    window.addEventListener("DOMContentLoaded", () => {
        const toDelete = Array<Element>();

        Array.from(document.head.children).forEach(c => {
            if (c.tagName === "STYLE" || (c.tagName === "LINK" && c.getAttribute("type") === "text/css")) {
                toDelete.push(c);
            }
        })

        toDelete.forEach(c => document.head.removeChild(c))
    })
}

function prepareDOM() {
    document.body.textContent = null;
    document.body.classList.add("show");

    const appEL = document.createElement("div");
    appEL.setAttribute("id", "app");
    document.body.appendChild(appEL);
}

export function Render(data: AnimeData) {
    ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
        <React.StrictMode>
            <App data={data} />
        </React.StrictMode>,
    )
}

export function prepareAndRender() {
    removeDefaultStylesOnLoad();

    promiseQuery("div.playlists-ajax", true, 5000).then((playlistsHTML) => {
        const titles: Titles = {
            ru: document.querySelector(".ntitle")!.textContent!,
            romanji: document.querySelector(".romanji")!.textContent!
        }

        prepareDOM();

        const shikijoyData: AnimeData = {
            id: playlistsHTML.getAttribute("data-news_id")!,
            title: titles,
            studios: getStudiosPlayersAndFiles(playlistsHTML)
        };

        Render(shikijoyData);
    }, () => alert("query promise was timed out")).catch(() => alert("Error occurred"));
}