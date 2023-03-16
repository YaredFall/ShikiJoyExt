window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["enabled"]).then((result) => {
        const toggle = document.querySelector("#ext-toggle");
        toggle.checked = !!result.enabled;
        document.querySelector("#ext-toggle-btn").classList.add("tgl-btn");
        toggle.addEventListener("change", (e) => {
            chrome.storage.local.set({ enabled: e.target.checked });
        })
    });

    chrome.storage.local.get(["usePlayersFixes"]).then((result) => {
        const toggle = document.querySelector("#pff-toggle");
        toggle.checked = !!result.usePlayersFixes;
        document.querySelector("#pff-toggle-btn").classList.add("tgl-btn");
        toggle.addEventListener("change", (e) => {
            chrome.storage.local.set({ usePlayersFixes: e.target.checked });
        })
    });

    const reloadBtn = document.querySelector("#reload");
    reloadBtn.addEventListener("click", () => {
        chrome.runtime.reload();
    })
})