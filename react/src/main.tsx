import { prepareAndRender, Render } from "./Utils/init";

console.log("ShikiJoy React app starting!");

if (!document.querySelector("#app")) {
    prepareAndRender();
} else {
    Render()
}

