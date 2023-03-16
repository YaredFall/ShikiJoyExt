import React, { FC, RefObject, useEffect, useState } from 'react';
import styles from "./Player.module.scss";
import { isSinglePagePlayer } from "../../Utils/misc";
import { PlayerData } from "../../types";
import Player from "./Player";

type PlayerMiddleSectionProps = {
    iframeRef: RefObject<HTMLIFrameElement>
    leftBtnRef: RefObject<HTMLButtonElement>
    source: string
} | {
    iframeRef?: undefined
    leftBtnRef?: undefined
    source?: undefined
}

const PlayerMiddleSection: FC<PlayerMiddleSectionProps> = ({
    source,
    iframeRef,
    leftBtnRef
}) => {
    const [isIFrameLoading, setIsIFrameLoading] = useState(true);
    useEffect(() => {
        setIsIFrameLoading(true);
    }, [source]);

    const shouldShowSkeleton = iframeRef === undefined || leftBtnRef === undefined || source === undefined;

    const onLoadHandler = () => {
        if (shouldShowSkeleton) return;

        setIsIFrameLoading(false);
    };

    const onFocusHandler = (e: React.FocusEvent) => {
        if (shouldShowSkeleton) return;

        if (e.relatedTarget !== iframeRef.current) {
            iframeRef.current?.focus();
        } else {
            leftBtnRef.current?.focus();
        }
    };

    return (
        <a onFocus={onFocusHandler}
           className={`${styles.middleSection} ${(isIFrameLoading === undefined || isIFrameLoading) ? styles.loading : styles.loaded}`}
           tabIndex={0}
        >
            <iframe ref={iframeRef}
                    loading={"lazy"}
                    className={styles.playerIframe}
                    onLoad={onLoadHandler}
                    src={shouldShowSkeleton ? undefined : source}
                    allowFullScreen={true}
            />
        </a>
    );
};


export default PlayerMiddleSection;