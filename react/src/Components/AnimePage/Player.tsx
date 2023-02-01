import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { BsCheck2 } from 'react-icons/bs';
import { IoClose } from "react-icons/io5";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { useAnimeJoyLegacyStorage } from "../../Hooks/useAnimeJoyLegacyStorage";
import { isSinglePagePlayer } from '../../misc';
import { AnimeJoyData } from "../../types";
import { fullStudioName } from "../../Utils/scraping";
import styles from './Player.module.scss';
import PlayerSelect from './PlayerSelect';
import { NestedChildrenMemoPolymorphicComponent as Section } from "../PolymorphicComponent";
import { usePlayersFixes } from "../../Hooks/usePlayersFixes";
import { updateAnimeRecord } from "../../Dexie";
import PlayerMiddleSection from "./PlayerMiddleSection";
import { Anime } from "../../Dexie/db";


const MemoizedLeftIcon = memo(SlArrowLeft);
const MemoizedRightIcon = memo(SlArrowRight);
const MemoizedCheckIcon = memo(BsCheck2);
const MemoizedCrossIcon = memo(IoClose);

type PlayerProps = {
    animejoyData: AnimeJoyData,
    animeRecord: Anime
}
const Player: FC<PlayerProps> = memo(({ animejoyData, animeRecord }) => {

    const {
        watchedEpisodesState,
        setEpisodeAsWatched,
        removeEpisodeFromWatched,
    } = useAnimeJoyLegacyStorage(animejoyData);

    const [currentStudioId, setCurrentStudioId] = useState(animeRecord.lastStudio);
    const [currentPlayerId, setCurrentPlayerId] = useState(animeRecord.lastPlayer);

    const currentPlayer = animejoyData.studios[currentStudioId].players[currentPlayerId];

    const [currentEpisodeId, setCurrentEpisodeId] = useState(animeRecord.lastEpisode);

    useEffect(() => {
            setCurrentStudioId(animeRecord.lastStudio);
            setCurrentPlayerId(animeRecord.lastPlayer);
            setCurrentEpisodeId(animeRecord.lastEpisode);
    }, [animeRecord]);

    const changeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") newId = currentEpisodeId - 1;

        if (currentPlayer.files[+newId]) {
            setCurrentEpisodeId(_ => +newId);
            updateAnimeRecord(animejoyData.id, { lastEpisode: +newId });
        }
    };

    const canChangeEpisodeId = (to: "next" | "prev" | number) => {
        if (isSinglePagePlayer(currentPlayer.name)) return false;

        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") newId = currentEpisodeId - 1;

        return (currentPlayer.files[+newId] !== undefined);
    };

    const epLabel = isSinglePagePlayer(currentPlayer.name) ? currentPlayer.name : `Серия ${currentEpisodeId + 1}`;

    const leftBtnRef = useRef<HTMLButtonElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    usePlayersFixes(iframeRef);

    return (
        <div className={styles.player}>
            <Section className={styles.topSection}>
                <div className={`${styles.currentEpLabel}${isSinglePagePlayer(currentPlayer.name) ? " hide" : " show"}`}>
                    <span children={epLabel} />
                    {watchedEpisodesState.has(currentEpisodeId) &&
                        <button className={styles.currentEpWatched}
                                onClick={() => removeEpisodeFromWatched(currentEpisodeId)}
                        >
                            <span children={"Посмотрено"} />
                            <MemoizedCrossIcon />
                        </button>}
                </div>
                {
                    animejoyData.studios.length > 1 &&
                    <div className={styles.currentStudioLabel}
                         children={fullStudioName(animejoyData.studios[currentStudioId].name)}
                         title={"Студия"}
                    />
                }
                <PlayerSelect availableStudiosAndPlayers={animejoyData.studios}
                              currentStudioId={currentStudioId}
                              currentPlayerId={currentPlayerId}
                              setCurrentPlayerId={setCurrentPlayerId}
                              setCurrentStudioId={setCurrentStudioId}
                />
            </Section>
            <Section as={"button"}
                     ref={leftBtnRef}
                     className={`${styles.leftSection}${!canChangeEpisodeId("prev") ? " hide" : " show"}`}
                     onClick={() => {
                         changeEpisodeId("prev");
                         iframeRef.current?.focus();
                     }}
                     disabled={!canChangeEpisodeId("prev")}
            >
                <div className={styles.wrapper}>
                    <MemoizedLeftIcon />
                    <div className={styles.hint} children={"Предыдущая серия"} />
                </div>
            </Section>
            <PlayerMiddleSection iframeRef={iframeRef}
                                 leftBtnRef={leftBtnRef}
                                 currentPlayer={currentPlayer}
                                 currentEpisodeId={currentEpisodeId}
            />
            <Section as={"button"}
                     className={`${styles.rightSection}${(!canChangeEpisodeId("next") &&
                         watchedEpisodesState.has(currentEpisodeId))
                                                         ? " hide-immediate"
                                                         : " show"}`}
                     onClick={() => {
                         if (!watchedEpisodesState.has(currentEpisodeId)) {
                             setEpisodeAsWatched(currentStudioId, currentPlayerId, currentEpisodeId);
                         }
                         if (canChangeEpisodeId("next")) {
                             changeEpisodeId("next");
                             iframeRef.current?.focus();
                         } else {
                             setEpisodeAsWatched(currentStudioId, currentPlayerId, currentEpisodeId);
                         }
                     }}
                     disabled={!canChangeEpisodeId("next") &&
                         watchedEpisodesState.has(currentEpisodeId)}
            >
                <div className={styles.wrapper}>
                    {canChangeEpisodeId("next") ? <MemoizedRightIcon /> :
                     <MemoizedCheckIcon style={{ fontSize: "2rem" }} />}
                    <div className={styles.hint}
                         children={canChangeEpisodeId("next") ? "Следующая серия" : "Отметить посмотренным"}
                    />
                </div>
            </Section>
        </div>
    );
});

export default Player;
