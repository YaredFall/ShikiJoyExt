import { useEffect } from "react";
import { isAnyMetaKeyPressed } from "../Utils/misc";

export function useBlurOnEscapeKey() {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!isAnyMetaKeyPressed(e) && e.code === "Escape") {
                setTimeout(() => {
                    (document.activeElement as HTMLElement)?.blur();
                }, 0)
            }
        }
        document.body.addEventListener("keydown", handler);
        return () => {
            document.body.removeEventListener("keydown", handler);
        };
    }, []);
}