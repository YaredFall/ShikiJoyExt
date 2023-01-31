import { RefObject, useEffect, useRef } from "react";

export const usePlayersFixes = (iframeRef: RefObject<HTMLIFrameElement>) => {

    const mouseJustEntered = useRef(true)

    useEffect(() => {
        //autofocus iframe on page load
        const onLoad = () => {
            iframeRef.current?.focus()
        };

        //autofocus iframe when window gets focused
        const onFocus = () => {
            if (mouseJustEntered.current) {
                // console.log("active", document.activeElement)
                mouseJustEntered.current = false;
                setTimeout(() => {
                    // console.log("in timeout active", document.activeElement)
                    if (document.activeElement === document.body) {
                        iframeRef.current?.focus()
                        // console.log("focus", document.activeElement)
                    }
                }, 0)
            }
        }

        //helps to detect when window gets focus
        const onMouseEnter = () => {
            if (!document.hasFocus() && !mouseJustEntered.current) {
                mouseJustEntered.current = true;
            }
        }

        window.addEventListener("load", onLoad);
        document.body.addEventListener("mouseenter", onMouseEnter);
        window.addEventListener("focus", onFocus);
        return () => {
            window.removeEventListener("load", onLoad);
            window.removeEventListener("focus", onFocus);
            document.body.removeEventListener("mouseenter", onMouseEnter);
        };
    }, []);
}