chrome.runtime.onInstalled.addListener(async (details) => {

    let reactPorts = [];
    let fixesPorts = [];
    chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name === "react" || port.name === "fixes");
        if (port.name === "react") {
            
            reactPorts = reactPorts.filter(rp => rp.sender.tab.id !== port.sender.tab.id);
            reactPorts.push(port);
            
            reactPorts.at(-1).onMessage.addListener(function(msg, sender) {
                if (msg.request) {
                    if (msg.request === "tabId") {
                        reactPorts.at(-1).postMessage({tabId: sender.sender.tab.id})
                    }
                } else {
                    fixesPorts.find(fp => fp.sender.tab.id === sender.sender.tab.id)?.postMessage({...msg, to: sender.sender.tab.id});
                }
            });
        } else if (port.name === "fixes") {

            fixesPorts = fixesPorts.filter(fp => fp.sender.tab.id !== port.sender.tab.id);
            fixesPorts.push(port);
            
            fixesPorts.at(-1).onMessage.addListener(function(msg, sender) {
                if (msg.request) {
                    if (msg.request === "tabId") {
                        fixesPorts.at(-1).postMessage({tabId: sender.sender.tab.id})
                    }
                } else {
                    reactPorts.find(rp => rp.sender.tab.id === sender.sender.tab.id)?.postMessage({...msg, to: sender.sender.tab.id});
                }
            });
        }
    });

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
        excludeMatches: [
            "https://*.animejoy.ru/engine/*",
            "https://*.animejoy.ru/*.png"
        ],
        runAt: "document_start",
        js: ["content.js"],
        css: ["content.scss"]
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
            "*://*.mail.ru/*",
            "*://aniqit.com/*",
            "*://politician.as.alloeclub.com/*"
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
