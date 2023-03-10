import { prepareAndRender, Render } from "./Utils/init";
import { initMessaging } from "./Utils/messaging"

console.log("ShikiJoy React app starting!");

initMessaging();

if (!document.querySelector("#app")) {
    prepareAndRender();
} else {
    Render()
}

