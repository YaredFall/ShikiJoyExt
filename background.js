chrome.runtime.onInstalled.addListener( async (details) => {
    if (details.reason === "install") {
        chrome.storage.local.set({ enabled: true });
    }
    else if (details.reason === "update") {
        const enabled = (await chrome.storage.local.get(["enabled"])).enabled;
        if (enabled) {
            injectScript();
            refreshAnimeJoyTabs();
        }
    }
});

const injectScript = async () => {
    const script = {
        id: "shikijoyScript",
        matches: ["https://*.animejoy.ru/*"],
        runAt: "document_start",
        js: ["react/dist/index.js"],
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
        refreshAnimeJoyTabs();
    } else if (changes.enabled.newValue === false) {
        ejectScript();
        refreshAnimeJoyTabs();
    }
})

async function refreshAnimeJoyTabs() {
    let queryOptions = { url: "https://animejoy.ru/*" };
    let tabs = await chrome.tabs.query(queryOptions);
    if (tabs) {
        tabs.forEach(tab => chrome.tabs.reload(tab.id));
    }
}
