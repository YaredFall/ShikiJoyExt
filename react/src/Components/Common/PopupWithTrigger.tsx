import { CSSProperties, FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import PopupPortal from "./PopupPortal";

const POPUP_WIDTH = 480;
const POPUP_HEIGHT = 290;
const POPUP_MARGIN = 20;

type PopupWithTriggerProps = {
    triggerRef: RefObject<HTMLElement>
    children?: ReactNode
    containerClassName?: string;
}

const PopupWithTrigger: FC<PopupWithTriggerProps> = ({ triggerRef, children, containerClassName = "" }) => {

    const [isMouseInsideTrigger, setIsMouseInsideTrigger] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const [isMouseInsidePopup, setIsMouseInsidePopup] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    function onMouseOverTrigger() {
        setIsMouseInsideTrigger(true);
    }

    function onMouseLeaveTrigger() {
        setIsMouseInsideTrigger(false);
        setTimeout(() => {
            if (!isMouseInsidePopup) {
                setIsPopupOpen(false);
            }
        }, 500);
    }

    useEffect(() => {
        if (triggerRef) {
            triggerRef.current?.addEventListener("mouseover", onMouseOverTrigger);
            triggerRef.current?.addEventListener("mouseleave", onMouseLeaveTrigger);
        }
    }, [triggerRef]);


    useEffect(() => {
        let triggerTimeout: number | undefined = undefined;
        if (isMouseInsideTrigger) {
            triggerTimeout = setTimeout(() => {
                setIsHidden(false);
                setIsPopupOpen(true);
            }, 500);
        } else {
            clearTimeout(triggerTimeout);
        }
        return () => {
            clearTimeout(triggerTimeout);
        };
    }, [isMouseInsideTrigger]);

    const [popupCSSProps, setPopupCSSProps] = useState({
        "--top": "0px",
        "--left": "0px",
        "--width": `${POPUP_WIDTH}px`,
        "--height": `${POPUP_HEIGHT}px`,
        "--margin": `${POPUP_MARGIN}px`
    });

    useEffect(() => {
        const handler = () => {
            const triggerRect = triggerRef?.current?.getBoundingClientRect();
            if (triggerRect) {
                const topLimit = document.documentElement.scrollTop + window.innerHeight - POPUP_HEIGHT - 2;

                //right
                let top: number = Math.min(~~((triggerRect.top || POPUP_MARGIN) + document.documentElement.scrollTop), topLimit);
                let left: number = ~~(triggerRect.right || 84) + POPUP_MARGIN; // 84 is SideNav width

                if (left + POPUP_WIDTH + POPUP_MARGIN > window.innerWidth) {
                    //left
                    left = ~~(triggerRect.left || 0) - POPUP_MARGIN - POPUP_WIDTH;

                    if (left < 84 + 2) { // 84 is SideNav width
                        //down
                        left = ~~(triggerRect.left || 0);
                        left -= Math.max(0, left + POPUP_WIDTH + POPUP_MARGIN - window.innerWidth);
                        top = Math.min(top + triggerRect.height + POPUP_MARGIN, topLimit);
                    }
                }

                setPopupCSSProps(prev => ({
                    ...prev,
                    "--top": `${top}px`,
                    "--left": `${left}px`
                }));
            }
        };
        handler();
        window.addEventListener("resize", handler, true);
        return () => {
            window.removeEventListener("resize", handler, true);
        };
    }, [isHidden, isPopupOpen]);

    let timeout: number | undefined = undefined;

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <PopupPortal isOpen={isPopupOpen || isMouseInsidePopup}>
            <div className={`${containerClassName} ${isHidden ? "remove" : ""}`}
                 ref={containerRef}
                 style={popupCSSProps as CSSProperties}
                 onMouseOver={(e) => {
                     clearTimeout(timeout);
                     timeout = undefined;
                     setIsMouseInsidePopup(true);
                 }}
                 onMouseLeave={() => {
                     timeout = setTimeout(() => {
                         setIsMouseInsidePopup(false);
                         timeout = undefined;
                     }, 500);
                 }}
                 onMouseMove={(e) => {
                     const hoveringThis = containerRef.current?.contains(e.target as Node);
                     if (!hoveringThis && !isHidden && !timeout) {
                         timeout = setTimeout(() => {
                             setIsHidden(true);
                             timeout = undefined;
                         }, 500);
                     }
                 }}
            >
                {children}
            </div>
        </PopupPortal>
    );
};

export default PopupWithTrigger;