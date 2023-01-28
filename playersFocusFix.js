let observer = new MutationObserver(mutationRecords => {
    if (!document.body) return;

    const domain = document.domain;
    let onKeyUp = undefined;
    switch (domain) {
        //AllVideo
        case 'secvideo1.online': {
            const frame = document.querySelector("iframe");
            if (frame) {
                frame.setAttribute("tabindex", "-1");
                onKeyUp = dealWithPlayerJS(15, 62, {playFlags: [(mouseIn) => !mouseIn]})
            }
            break;
        }
        //UStore
        case 'red.uboost.one': {
            // ! id of the buttons changed 1 number down. So it can be unstable
            const frame = document.querySelector("iframe");
            if (frame) {
                document.querySelectorAll("iframe").forEach(e => e.setAttribute("tabindex", "-1"));
                onKeyUp = dealWithPlayerJS(17, 99, {playFlags: [(mouseIn) => !mouseIn]})
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
                onKeyUp = dealWithPlayerJS(17, 83, {playFlags: [(mouseIn) => !mouseIn]})
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
                document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
                    .forEach(e => e.setAttribute("tabindex", "-1"))
                observer.disconnect();
                let active = false;
                let muted = true;
                window.onfocus = () => {
                    active = false;
                }
                onKeyUp = (e) => {
                    if (e.code === "Space" && !active) {
                        const playBtn = document.querySelector('[data-control-name="play"]');
                        if (playBtn) {
                            playBtn.click();
                        } else {
                            div.click();
                        }
                        if (muted) {
                            const interval = setInterval(() => {
                                const muteDiv = document.querySelector('div[class][style="pointer-events: auto;"]')
                                if (muteDiv) {
                                    muteDiv.click();
                                    setTimeout(() => {
                                        document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
                                            .forEach(e => e.setAttribute("tabindex", "-1"))
                                    }, 0)
                                    muted = false;
                                    clearInterval(interval);
                                }
                            }, 50)
                        }
                    } else if (e.code === "KeyF") {
                        const fsBtn = document.querySelector('[data-control-name="fullscreen"]');
                        if (fsBtn) {
                            fsBtn.click();
                            if (muted && !active) {
                                const interval = setInterval(() => {
                                    const mdivs = document.querySelectorAll('div[class][style="pointer-events: auto;"]')
                                    if (mdivs.length > 1) {
                                        mdivs[1].click();
                                        let paused = false;
                                        let noJokePaused = false
                                        const pauseInterval = setInterval(() => {
                                            document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
                                                .forEach(e => e.setAttribute("tabindex", "-1"))
                                            const videoEl = document.querySelector("video");
                                            if (videoEl.paused && noJokePaused) {
                                                clearInterval(pauseInterval);
                                            }
                                            if (paused && !videoEl.paused) {
                                                videoEl.pause()
                                                noJokePaused = true;
                                            }
                                            if (!paused && !videoEl.paused) {
                                                videoEl.pause();
                                                paused = true
                                            }


                                        }, 50)
                                        muted = false;
                                        clearInterval(interval);
                                    }
                                }, 50)
                            }
                            active = true;
                        }
                    }
                }
            }

            break;
        }
        case 'ok.ru': {
            //* (hard to fix) video plays on f key
            const img = document.querySelector("img");
            if (img) {
                observer.disconnect();
                let active = false;
                onKeyUp = (e) => {
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
                onKeyUp = (e) => {
                    if (e.code === "KeyF") {
                        fsBtn.click();
                    }
                }
                observer.disconnect()
            }
            break;
        }
    }
    if (onKeyUp) {
        document.removeEventListener("keyup", onKeyUp);
        document.body.addEventListener("focus", () => {
            document.removeEventListener("keyup", onKeyUp);
            console.log("got focus", document)
        })
        document.body.addEventListener("blur", () => {
            if (!document.fullscreenElement) {
                document.addEventListener("keyup", onKeyUp)
            }
            console.log("lost focus", document)
        })
        document.addEventListener("keyup", onKeyUp)
        console.log("added onKeyUp to", document)
    }
    if (onFocus) {
        window.addEventListener("focus", onFocus);
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
        let mouseIn = false;
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

        //prevents unwanted behavior after player being clicked
        document.body.addEventListener("click", () => {
            document.removeEventListener("keyup", handler);
        })
        return handler;
    } else
        return undefined;
}