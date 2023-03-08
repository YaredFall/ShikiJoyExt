import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { BsCheck2 } from 'react-icons/bs';
import { IoClose } from "react-icons/io5";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { useAnimeJoyLegacyStorage } from "../../Hooks/useAnimeJoyLegacyStorage";
import { isSinglePagePlayer } from '../../misc';
import { AnimeJoyData } from "../../types";
import { fullStudioName, splitTitleOrStudioAndEpisodeCount } from "../../Utils/scraping";
import styles from './Player.module.scss';
import PlayerSelect from './PlayerSelect';
import { NestedChildrenMemoPolymorphicComponent as Section } from "../PolymorphicComponent";
import { usePlayersFixes } from "../../Hooks/usePlayersFixes";
import { updateAnimeRecord } from "../../Dexie";
import PlayerMiddleSection from "./PlayerMiddleSection";
import { Anime } from "../../Dexie/db";
import DotSplitter from "../DotSplitter";


const MemoizedLeftIcon = memo(SlArrowLeft);
const MemoizedRightIcon = memo(SlArrowRight);
const MemoizedCheckIcon = memo(BsCheck2);
const MemoizedCrossIcon = memo(IoClose);

type PlayerProps = {
    animejoyData: AnimeJoyData,
    animeRecord: Anime
}
const Player: FC<PlayerProps> = memo(({ animejoyData, animeRecord }) => {

    const { setEpisodeAsWatched, removeEpisodeFromWatched, } = useAnimeJoyLegacyStorage(animejoyData);
    const watchedEpisodes = animeRecord.watchedEpisodes

    const [currentStudioId, setCurrentStudioId] = useState(animeRecord.lastStudio);
    const [currentPlayerId, setCurrentPlayerId] = useState(animeRecord.lastPlayer);

    const currentStudio = animejoyData.studios[currentStudioId];
    const currentPlayer = currentStudio.players[currentPlayerId];

    const [currentEpisodeId, setCurrentEpisodeId] = useState(animeRecord.lastEpisode);

    useEffect(() => {
            setCurrentStudioId(animeRecord.lastStudio);
            setCurrentPlayerId(animeRecord.lastPlayer);
            const availableEps = currentPlayer.files.length;
            setCurrentEpisodeId(animeRecord.lastEpisode >= availableEps ? availableEps - 1 : animeRecord.lastEpisode );
    }, [animeRecord]);

    const changeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") newId = currentEpisodeId - 1;

        setCurrentEpisodeId(_ => +newId);
        updateAnimeRecord(animejoyData.id, { lastEpisode: +newId });
    };

    const canChangeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") newId = currentEpisodeId - 1;

        if (isSinglePagePlayer(currentPlayer.name)) {
            const availableCount = studioEpisodesCount || Math.max(...currentStudio.players.map(p => p.files.length))
            return newId >= 0 && newId < availableCount
        }

        return (currentPlayer.files[+newId] !== undefined);
    };

    const [studioName, studioEpisodesCount] = splitTitleOrStudioAndEpisodeCount(currentStudio.name)

    const leftBtnRef = useRef<HTMLButtonElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    usePlayersFixes(iframeRef);

    //sets player select options max-height to iframe height
    useEffect(() => {
        document.querySelector(`.${styles.player}`)?.setAttribute("style",
            "--max-options-height: " + (iframeRef.current?.getBoundingClientRect().height! + 2) + "px")
        const onResize = () => {
            document.querySelector(`.${styles.player}`)?.setAttribute("style",
                "--max-options-height: " + (iframeRef.current?.getBoundingClientRect().height! + 2) + "px")
        };
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, []);


    return (
        <section className={styles.player}>
            <Section className={styles.topSection}>
                <h2 className={styles.currentEpLabel}>
                    <span children={animejoyData.studios[currentStudioId].players[currentPlayerId].files[currentEpisodeId]?.label} />
                    {watchedEpisodes.has(currentEpisodeId) &&
                        <button className={styles.currentEpWatched}
                                onClick={() => {
                                    const newWE = new Set(watchedEpisodes);
                                    newWE.delete(currentEpisodeId);
                                    updateAnimeRecord(animeRecord.animejoyID, { watchedEpisodes: newWE });
                                    removeEpisodeFromWatched(currentEpisodeId);
                                }}
                        >
                            <span children={"Посмотрено"} />
                            <MemoizedCrossIcon />
                        </button>}
                </h2>
                {
                    animejoyData.studios.length > 1 &&
                    <div className={styles.currentStudioLabel}>
                        <span title={fullStudioName(studioName)}>{fullStudioName(studioName)}</span>
                        {studioEpisodesCount &&
                            <><DotSplitter /><span title={`${studioEpisodesCount} серий`}>{studioEpisodesCount}</span></>
                        }
                    </div>
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
                         watchedEpisodes.has(currentEpisodeId))
                                                         ? " hide-immediate"
                                                         : " show"}`}
                     onClick={() => {
                         if (!watchedEpisodes.has(currentEpisodeId)) {
                             const newWE = new Set(watchedEpisodes);
                             newWE.add(currentEpisodeId);
                             updateAnimeRecord(animeRecord.animejoyID, { watchedEpisodes: newWE });
                             setEpisodeAsWatched(currentStudioId, currentPlayerId, currentEpisodeId);
                         }
                         if (canChangeEpisodeId("next")) {
                             changeEpisodeId("next");
                         }
                     }}
                     disabled={!canChangeEpisodeId("next") && watchedEpisodes.has(currentEpisodeId)}
            >
                <div className={styles.wrapper}>
                    {canChangeEpisodeId("next") ? <MemoizedRightIcon /> :
                     <MemoizedCheckIcon style={{ fontSize: "2rem" }} />}
                    <div className={styles.hint}
                         children={canChangeEpisodeId("next") ? "Следующая серия" : "Отметить посмотренным"}
                    />
                </div>
            </Section>
        </section>
    );
});

export default Player;
