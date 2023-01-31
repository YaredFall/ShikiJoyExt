import React, { FC, RefObject, useEffect, useState } from 'react';
import styles from "./Player.module.scss";
import { isSinglePagePlayer } from "../../misc";
import { PlayerData } from "../../types";

type PlayerMiddleSectionProps = {
    iframeRef: RefObject<HTMLIFrameElement>
    leftBtnRef: RefObject<HTMLButtonElement>
    currentPlayer: PlayerData
    currentEpisodeId: number
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

    const onLoadHandler = () => {
        setIsIFrameLoading(false);
    }

    const onFocusHandler = (e: React.FocusEvent) => {
        if (e.relatedTarget !== iframeRef.current) {
            iframeRef.current?.focus();
        } else {
            leftBtnRef.current?.focus();
        }
    }

    return (
        <a onFocus={onFocusHandler}
           className={`${styles.middleSection} ${isIFrameLoading ? styles.loading : styles.loaded}`}
           tabIndex={0}
        >
            <iframe ref={iframeRef}
                    loading={"lazy"}
                    className={styles.playerIframe}
                    onLoad={onLoadHandler}
                    src={currentPlayer.files[isSinglePagePlayer(currentPlayer.name) ? 0 : currentEpisodeId]}
                    allowFullScreen={true}
            />
        </a>
    );
};


export default PlayerMiddleSection;