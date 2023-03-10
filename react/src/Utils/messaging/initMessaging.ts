// @ts-nocheck
export const port = chrome.runtime?.connect({name: "react"});

let onMessage = Array<(msg: any) => void>()

export function addMessageListener(callback: (msg: any) => void) {
    onMessage.push(callback);
}

export function removeMessageListener(callback: (msg: any) => void) {
    onMessage = onMessage.filter(cb => cb !== callback);
}

export function initMessaging() {
    if (port) {
        let tabId = undefined;

        port.onMessage.addListener(function(msg) {
            // console.log("react got message: ", msg);
            if (msg.tabId) {
                tabId ||= msg.tabId
            } else if (tabId && tabId === msg.to) {
                onMessage.forEach(cb => cb(msg));
            }
        });
        port.postMessage({request: "tabId"})

    }
}