import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
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
import { addMessageListener, removeMessageListener } from "../../Utils/messaging";


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
    const watchedEpisodes = animeRecord.watchedEpisodes;

    const [currentStudioId, setCurrentStudioId] = useState(animeRecord.lastStudio);
    const [currentPlayerId, setCurrentPlayerId] = useState(animeRecord.lastPlayer);
    const currentStudio = animejoyData.studios[currentStudioId];
    const currentPlayer = currentStudio.players[currentPlayerId];

    useEffect(() => {
        setCurrentStudioId(animeRecord.lastStudio);
        setCurrentPlayerId(animeRecord.lastPlayer);
    }, [animeRecord]);

    const [currentEpisodeId, setCurrentEpisodeId] = useState(0);
    console.log({ currentStudioId, currentPlayerId, currentEpisodeId, animejoyData });

    const [singlePageEpisodeID, setSinglePageEpisodeID] = useState<number | undefined>(undefined);
    const [singlePageEpisodesAvailable, setSinglePageEpisodesAvailable] = useState<number | undefined>(undefined);
    useEffect(() => {
        const onMessage = (msg: any) => {
            if (msg.episodesAvailable !== undefined && singlePageEpisodesAvailable !== msg.episodesAvailable) {
                setSinglePageEpisodesAvailable(msg.episodesAvailable);
            }
            if (msg.currentEpisodeID !== undefined) {
                setSinglePageEpisodeID(msg.currentEpisodeID);
                if (currentPlayer.files.length === 1) {
                    changeEpisodeId(msg.currentEpisodeID);
                }
            }
        };
        addMessageListener(onMessage);

        return () => {
            removeMessageListener(onMessage);
        };
    }, []);

    useEffect(() => {
        setSinglePageEpisodesAvailable(undefined);
        setSinglePageEpisodeID(undefined);
    }, [currentStudioId, currentPlayerId]);

    useEffect(() => {
        let availableEps;
        if (isSinglePagePlayer(currentPlayer.name) && singlePageEpisodesAvailable && currentPlayer.files.length === 1) {
            availableEps = singlePageEpisodesAvailable;
        } else if (!isSinglePagePlayer(currentPlayer.name) || currentPlayer.files.length > 1) {
            availableEps = currentPlayer.files.length;
        }
        console.log({ availableEps, currentEpisodeId });
        if (availableEps) {
            setCurrentEpisodeId(animeRecord.lastEpisode >= availableEps ? availableEps - 1 : animeRecord.lastEpisode);
        }
    }, [currentStudioId, currentPlayerId, animeRecord, singlePageEpisodesAvailable]);


    const changeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") {
            newId = currentEpisodeId - 1;
        }

        setCurrentEpisodeId(_ => +newId);
        updateAnimeRecord(animejoyData.id, { lastEpisode: +newId });
    };

    const canChangeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") {
            newId = currentEpisodeId - 1;
        }

        if (isSinglePagePlayer(
            currentPlayer.name) && currentPlayer.files.length === 1 && singlePageEpisodesAvailable && singlePageEpisodeID !== undefined) {
            return newId >= 0 && newId < singlePageEpisodesAvailable;
        }

        return (currentPlayer.files[+newId] !== undefined);
    };

    const [studioName, studioEpisodesCount] = splitTitleOrStudioAndEpisodeCount(currentStudio.name);

    const leftBtnRef = useRef<HTMLButtonElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    usePlayersFixes(iframeRef);

    //sets player select options max-height to iframe height
    useEffect(() => {
        document.querySelector(`.${styles.player}`)?.setAttribute("style",
            "--max-options-height: " + (iframeRef.current?.getBoundingClientRect().height! + 2) + "px");
        const onResize = () => {
            document.querySelector(`.${styles.player}`)?.setAttribute("style",
                "--max-options-height: " + (iframeRef.current?.getBoundingClientRect().height! + 2) + "px");
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const episodeLabel = () => {
        if (isSinglePagePlayer(currentPlayer.name)) {
            const season = currentPlayer.files.length > 1 ? `${currentEpisodeId + 1} Сезон  ` : "";
            return singlePageEpisodeID !== undefined ? (season || `${currentEpisodeId + 1} Серия`) : `${animeRecord.lastEpisode + 1} Серия`;
        } else {
            return animejoyData.studios[currentStudioId].players[currentPlayerId].files[currentEpisodeId]?.label;
        }
    };

    const source = useMemo(() => {
        if (isSinglePagePlayer(currentPlayer.name)) {
            if (currentPlayer.files.length === 1) {
                const file = currentPlayer.files[0].file;
                return file + (file.includes('?') ? "&" : "?") + `episode=${animeRecord.lastEpisode + 1}`;
            }
            return currentPlayer.files[currentEpisodeId] ? currentPlayer.files[currentEpisodeId].file : currentPlayer.files.at(-1)!.file;
        } else {
            return currentPlayer.files[currentEpisodeId] ? currentPlayer.files[currentEpisodeId].file : "";
        }
    }, [currentStudioId, currentPlayerId, animejoyData, currentEpisodeId]);


    return (
        <section className={styles.player}>
            <Section className={styles.topSection}>
                <h2 className={styles.currentEpLabel}>
                    <span children={episodeLabel()} />
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
                                 source={source}
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
