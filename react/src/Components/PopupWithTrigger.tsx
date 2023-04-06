import { FC, ReactNode, RefObject, useEffect, useState } from 'react';
import PopupPortal from "./PopupPortal";

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

    const [position, setPosition] = useState({
        top: ~~((triggerRef?.current?.getBoundingClientRect().top || 0) + document.documentElement.scrollTop),
        left: ~~(triggerRef?.current?.getBoundingClientRect().right || 0)
    });

    useEffect(() => {
        const handler = () => {
            triggerRef && setPosition(prev => ({
                top: ~~((triggerRef?.current?.getBoundingClientRect().top || 0) + document.documentElement.scrollTop),
                left: ~~(triggerRef?.current?.getBoundingClientRect().right || 0)
            }));
        };
        handler();
        window.addEventListener("resize", handler, true);
        return () => {
            window.removeEventListener("resize", handler, true);
        };
    }, []);

    let timeout: number | undefined = undefined;


    return (
        <PopupPortal isOpen={isPopupOpen || isMouseInsidePopup}>
            <div className={`${containerClassName} ${isHidden ? "remove" : ""}`}
                 style={{ top: position.top + "px", left: position.left + "px" }}
                 onMouseOver={(e) => {
                     const hoveredThis = (e.target as Element).closest(`div[style="top: ${position.top}px; left: ${position.left}px;"]`);
                     if (hoveredThis) {
                         setTimeout(() => {
                             clearTimeout(timeout);
                             timeout = undefined;
                             setIsMouseInsidePopup(true);
                         }, 0);
                     }
                 }}
                 onMouseLeave={() => {
                     timeout = setTimeout(() => {
                         setIsMouseInsidePopup(false);
                         timeout = undefined;
                     }, 500);
                 }}
                 onMouseMove={(e) => {
                     const hoveredThis = (e.target as Element).closest(`div[style="top: ${position.top}px; left: ${position.left}px;"]`);
                     if (!hoveredThis && !isHidden && !timeout) {
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