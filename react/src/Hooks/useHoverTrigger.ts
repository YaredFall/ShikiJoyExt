import { RefObject, useEffect, useState } from "react";

export function useHoverTrigger(triggerRef: RefObject<HTMLElement>, delay: number = 500) {
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);

    let timeout: number | undefined = undefined;
    const onMouseEnter = () => {
        timeout = setTimeout(() => {
            setIsQueryEnabled(true);
        }, delay);
    };
    const onMouseLeave = () => {
        clearTimeout(timeout);
    };

    useEffect(() => {
        triggerRef.current?.addEventListener("mouseenter", onMouseEnter);
        triggerRef.current?.addEventListener("mouseleave", onMouseLeave);
    }, [triggerRef]);
    
    return [isQueryEnabled];
}