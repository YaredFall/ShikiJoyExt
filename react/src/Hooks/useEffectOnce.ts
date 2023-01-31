import { EffectCallback, useEffect, useRef } from "react";
import { tryAddAnime } from "../Dexie";

export const useEffectOnce = (effect: EffectCallback) => {
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            effect()
        }
    }, [])
}