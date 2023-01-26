chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        chrome.storage.local.set({ enabled: true, usePlayersFixes: true });
    } else if (details.reason === "update") {
        const data = await chrome.storage.local.get(["enabled", "usePlayersFixes"])
        if (data.enabled) {
            if (data.usePlayersFixes) {
                injectFixes();
            }
            injectMainScript();
            refreshAnimeJoyTabs();
        }
    }
});

const injectMainScript = async () => {
    const script = {
        id: "shikijoyScript",
        matches: ["https://*.animejoy.ru/*"],
        runAt: "document_start",
        js: ["react/dist/index.js"],
        css: ["react/dist/index.scss"]
    }
    return await chrome.scripting.registerContentScripts([script], () => {
        console.log("injected React");
    })
}

const ejectMainScript = async () => {
    return await chrome.scripting.unregisterContentScripts({ ids: ["shikijoyScript"] }, () => {
        console.log("ejected React");
    });
}

const injectFixes = async () => {
    const script = {
        id: "playersFixes",
        allFrames: true,
        matches: [
            "*://animejoy.ru/*",
            "*://secvideo1.online/*",
            "*://red.uboost.one/*",
            "*://video.sibnet.ru/*",
            "*://vk.com/*",
            "*://dzen.ru/*",
            "*://ok.ru/*",
            "*://*.mail.ru/*"
        ],
        runAt: "document_start",
        js: ["playersFocusFix.js"]
    }
    return await chrome.scripting.registerContentScripts([script], () => {
        console.log("injected Fixes");
    })
}

const ejectFixes = async () => {
    return await chrome.scripting.unregisterContentScripts({ ids: ["playersFixes"] }, () => {
        console.log("ejected Fixes");
    });
}

chrome.storage.onChanged.addListener(async (changes, area) => {
    console.log({ changes, area });

    if (changes.enabled && changes.enabled.newValue === true) {
        const data = await chrome.storage.local.get(["usePlayersFixes"])
        if (data.usePlayersFixes)
            injectFixes();
        injectMainScript();
        refreshAnimeJoyTabs();
    } else if (changes.enabled && changes.enabled.newValue === false) {
        const data = await chrome.storage.local.get(["usePlayersFixes"])
        if (data.usePlayersFixes)
            ejectFixes();
        ejectMainScript();
        refreshAnimeJoyTabs();
    } else if (changes.usePlayersFixes && changes.usePlayersFixes.newValue === true) {
        const data = await chrome.storage.local.get(["enabled"])
        if (data.enabled) {
            injectFixes();
            refreshAnimeJoyTabs();
        }
    } else if (changes.usePlayersFixes && changes.usePlayersFixes.newValue === false) {
        const data = await chrome.storage.local.get(["enabled"])
        if (data.enabled) {
            ejectFixes();
            refreshAnimeJoyTabs();
        }
    }
})

async function refreshAnimeJoyTabs() {
    let queryOptions = { url: "https://animejoy.ru/*" };
    let tabs = await chrome.tabs.query(queryOptions);
    if (tabs) {
        tabs.forEach(tab => chrome.tabs.reload(tab.id));
    }
}
