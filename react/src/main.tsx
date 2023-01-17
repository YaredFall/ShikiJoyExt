import {prepareAndRender, Render} from "./Utils/init";
import mockupData from './devMockupData.json';

console.log("ShikiJoy React app starting!");

if (!document.querySelector("#app")) {
    prepareAndRender();
} else {
    Render(mockupData)
}

