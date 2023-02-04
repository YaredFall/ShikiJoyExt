import React, { FC, RefObject, useEffect, useState } from 'react';
import styles from "./Player.module.scss";
import { isSinglePagePlayer } from "../../misc";
import { PlayerData } from "../../types";
import Player from "./Player";

type PlayerMiddleSectionProps = {
    iframeRef: RefObject<HTMLIFrameElement>
    leftBtnRef: RefObject<HTMLButtonElement>
    currentPlayer: PlayerData
    currentEpisodeId: number
} | {
    iframeRef?: undefined
    leftBtnRef?: undefined
    currentPlayer?: undefined
    currentEpisodeId?: undefined
}

const PlayerMiddleSection: FC<PlayerMiddleSectionProps> = ({
    currentPlayer,
    currentEpisodeId,
    iframeRef,
    leftBtnRef
}) => {
    const [isIFrameLoading, setIsIFrameLoading] = useState(true);
    useEffect(() => {
        setIsIFrameLoading(true);
    }, [currentEpisodeId, currentPlayer]);

    const shouldShowSkeleton = iframeRef === undefined || leftBtnRef === undefined ||
        currentPlayer === undefined || currentEpisodeId === undefined;

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

    const source = (currentPlayer: PlayerData, currentEpisodeId: number) => {
        if (isSinglePagePlayer(currentPlayer.name)) {
            return currentPlayer.files[0] + (currentPlayer.files[0].includes('?') ? "&" : "?") + `episode=${currentEpisodeId + 1}`;
        } else {
            return currentPlayer.files[currentEpisodeId];
        }
    }

    return (
        <a onFocus={onFocusHandler}
           className={`${styles.middleSection} ${(isIFrameLoading === undefined || isIFrameLoading) ? styles.loading : styles.loaded}`}
           tabIndex={0}
        >
            <iframe ref={iframeRef}
                    loading={"lazy"}
                    className={styles.playerIframe}
                    onLoad={onLoadHandler}
                    src={shouldShowSkeleton ? undefined : source(currentPlayer, currentEpisodeId)}
                    allowFullScreen={true}
            />
        </a>
    );
};


export default PlayerMiddleSection;