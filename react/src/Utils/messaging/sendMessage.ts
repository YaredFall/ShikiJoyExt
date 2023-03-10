import { port } from "./initMessaging";

export function sendMessage(msg: any) {
    if (port) {
        port.postMessage(msg);
    }
}