chrome.runtime.onInstalled.addListener( async (details) => {
    if (details.reason === "install") {
        chrome.storage.local.set({ enabled: true });
    }
    else if (details.reason === "update") {
        const enabled = (await chrome.storage.local.get(["enabled"])).enabled;
        if (enabled) {
            injectScript();
        }
    }
});

const injectScript = async () => {
    const script = {
        id: "shikijoyScript",
        matches: ["https://*.animejoy.ru/*"],
        runAt: "document_start",
        js: ["script.js"],
        css: ["react/dist/index.scss"]
    }
    return await chrome.scripting.registerContentScripts([script], () => {
        console.log("injected JS");
    })
}

const ejectScript = async () => {
    return await chrome.scripting.unregisterContentScripts({ ids: ["shikijoyScript"]}, () => {
        console.log("ejected JS");
    });
}

chrome.storage.onChanged.addListener((changes, area) => {
    console.log({changes, area});
    if (changes.enabled.newValue === true) {
        injectScript();
    } else if (changes.enabled.newValue === false) {
        ejectScript();
    }
})
