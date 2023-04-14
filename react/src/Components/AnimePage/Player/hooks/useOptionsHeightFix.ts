import { RefObject, useEffect, useLayoutEffect } from "react";
import styles from '../Player.module.scss';

export function useOptionsHeightFix<T extends any = any>(iframeRef: RefObject<HTMLElement>, updateDeps: Array<T>) {
    useLayoutEffect(() => {
        const setMaxHeight = () => {
            document.querySelector(`.${styles.player}`)?.setAttribute("style",
                "--max-options-height: " + (iframeRef.current?.getBoundingClientRect().height! + 2) + "px");
        };
        setMaxHeight();
        console.log("IFRAME HEIGHT IS " + iframeRef.current?.getBoundingClientRect().height);

        window.addEventListener('resize', setMaxHeight);
        return () => {
            window.removeEventListener('resize', setMaxHeight);
        };
    }, [...updateDeps]);
}