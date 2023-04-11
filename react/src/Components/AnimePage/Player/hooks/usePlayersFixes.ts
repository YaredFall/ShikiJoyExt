import { RefObject, useEffect, useRef } from "react";

export const usePlayersFixes = (iframeRef: RefObject<HTMLIFrameElement>) => {
    
    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if (!e.metaKey && !e.altKey && !e.shiftKey && !e.ctrlKey) {
                if (document.activeElement === document.body && (e.code === "KeyF" || e.code === "Space")) {
                    e.preventDefault();
                    iframeRef.current?.focus();
                }
            }
        };
        
        const onKeyDown = (e: KeyboardEvent) => {
            if ((document.activeElement === iframeRef.current || document.activeElement === document.body) && e.code === "Space") {
                e.preventDefault();
            }
        }
        
        document.addEventListener("keyup", onKeyUp);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keyup", onKeyUp);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);
};