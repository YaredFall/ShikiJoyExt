window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["enabled"]).then((result) => {
        const toggle = document.querySelector("#toggle");
        toggle.checked = !!result.enabled;
        document.querySelector("#toggle-btn").classList.add("tgl-btn");
        toggle.addEventListener("change", (e) => {
            chrome.storage.local.set({ enabled: e.target.checked });
        })
    });

    const reloadBtn = document.querySelector("#reload");
    reloadBtn.addEventListener("click", () => {
        chrome.runtime.reload();
    })
})