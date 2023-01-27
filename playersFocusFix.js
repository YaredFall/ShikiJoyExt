let observer = new MutationObserver(mutationRecords => {
    if (!document.body) return;

    const domain = document.domain;
    let handler = undefined;
    switch (domain) {
        //AllVideo
        //TODO: fix doble play if player in focus but mouse is not in window
        case 'secvideo1.online': {
            const frame = document.querySelector("iframe");
            if (frame) {
                frame.setAttribute("tabindex", "-1");
                handler = dealWithPlayerJS(15, 62, {playFlags: [(mouseIn) => !mouseIn]})
            }
            break;
        }
        //UStore
        case 'red.uboost.one': {
            // ! id of the buttons changed 1 number down. So it can be unstable
            const frame = document.querySelector("iframe");
            if (frame) {
                document.querySelectorAll("iframe").forEach(e => e.setAttribute("tabindex", "-1"));
                handler = dealWithPlayerJS(17, 99, {playFlags: [(mouseIn) => !mouseIn]})
            }
            break;
        }
        case 'video.sibnet.ru': {
            const wrapper = document.querySelector("div#video_html5_wrapper");
            const videoEl = document.querySelector("video");
            if (wrapper && videoEl) {
                setTimeout(() => {
                    wrapper.focus()
                }, 0)
                observer.disconnect();
            }
            break;
        }
        case 'animejoy.ru': {
            if (document.URL.startsWith("https://animejoy.ru/player/playerjs.html")) {
                handler = dealWithPlayerJS(17, 83, {playFlags: [(mouseIn) => !mouseIn]})
            }
            break;
        }
        case 'vk.com': {
            document.querySelector("div.videoplayer")?.focus();
            break;
        }
        case 'dzen.ru': {
            const div = document.querySelectorAll(`div[tabindex="-1"]`)[1]
            if (div) {
                setTimeout(() => {
                    div.focus();
                }, 50)
            }

            const muteDiv = document.querySelector('div[class][style="pointer-events: auto;"]');
            if (muteDiv) {
                let active = false;
                handler = (e) => {
                    if (!active && e.code === "Space") {
                        active = true;

                    }
                }
            }

            const videoEl = document.querySelector("video");
            if (videoEl && !videoEl.paused) {
                muteDiv.click();
                observer.disconnect();
            }

            break;
        }
        case 'ok.ru': {
            //* (hard to fix) video plays on f key
            const img = document.querySelector("img");
            if (img) {
                observer.disconnect();
                let active = false;
                handler = (e) => {
                    if (e.code === "Space") {
                        if (!active) {
                            img?.click();
                            active = true;
                        }
                        document.querySelector(".html5-vpl_panel_btn.html5-vpl_play")?.click();
                    }
                    if (e.code === "KeyF") {
                        if (!active) {
                            img?.click();
                            active = true;
                            const interval = setInterval(() => {
                                const video = document.querySelector("video");
                                if (video) {
                                    document.querySelector(".html5-vpl_panel_btn.html5-vpl_fullscreen")?.click();
                                    clearInterval(interval)
                                }
                            }, 50)
                        } else {
                            document.querySelector(".html5-vpl_panel_btn.html5-vpl_fullscreen")?.click();
                        }
                    }
                }
            }
            break;
        }
        case 'mail.ru': {
            const video = document.querySelector("video")
            const fsBtn = document.querySelector(".b-video-controls__fullscreen-button")
            if (video && fsBtn) {
                video.focus();
                handler = (e) => {
                    if (e.code === "KeyF") {
                        fsBtn.click();
                    }
                }
                observer.disconnect()
            }
            break;
        }
    }
    if (handler) {
        document.removeEventListener("keyup", handler);
        document.body.addEventListener("focus", () => {
            document.removeEventListener("keyup", handler);
            console.log("got focus", document)
        })
        document.body.addEventListener("blur", () => {
            if (!document.fullscreenElement) {
                document.addEventListener("keyup", handler)
            }
            console.log("lost focus", document)
        })
        document.addEventListener("keyup", handler)
        console.log("added handler to", document)
    }
});

// window.addEventListener("DOMContentLoaded", () => {
observer.observe(document, {
    childList: true,
    subtree: true,
});

// })


/**
 *
 * @param {number} playBtnId - play button id in document.querySelectorAll("pjsdiv") array
 * @param {number} fsBtnId - fullscreen button id in document.querySelectorAll("pjsdiv") array
 * @param {Object} [options] - options to tweak behavior
 * @param {Array<(mouseIn?: boolean) => boolean>} [options.playFlags = []] - prevents play button click if at least one flag is false
 * @param {Array<(mouseIn?: boolean) => boolean>} [options.fsFlags = []] - prevents fullscreen button click if at least one flag is false
 */
function dealWithPlayerJS(
    playBtnId,
    fsBtnId,
    options
) {
    options = {
        playFlags: options?.playFlags || [],
        fsFlags: options?.fsFlags || []
    }

    const a = document.querySelectorAll("pjsdiv");

    if (a.length > 0) {
        let mouseIn;
        document.addEventListener("mouseenter", () => {
            mouseIn = true
        });
        document.addEventListener("mouseleave", () => {
            mouseIn = false
        })

        observer.disconnect();
        const playBtn = a[playBtnId];
        const fsBtn = a[fsBtnId]
        const handler = (e) => {
            if (e.code === "Space" && options.playFlags.every(f => f(mouseIn) === true)) {
                playBtn.click();
            }
            if (e.code === "KeyF" && options.fsFlags.every(f => f(mouseIn) === true)) {
                fsBtn.click();
            }
        }
        return handler;
    } else
        return undefined;
}