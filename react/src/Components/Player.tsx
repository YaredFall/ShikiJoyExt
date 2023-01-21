import React, { FC, memo, useState } from 'react';
import { BsCheck2 } from 'react-icons/bs';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { useAnimeJoyLegacyStorage } from "../Hooks/useAnimeJoyLegacyStorage";
import { isSinglePagePlayer } from '../misc';
import { AnimeData } from "../types";
import { fullStudioName } from "../Utils/scraping";
import styles from './Player.module.scss'
import PlayerSelect from './PlayerSelect';
import { NestedChildrenMemoPolymorphicComponent as Section } from "./PolymorphicComponent";

type PlayerProps = {
    animeData: AnimeData
}

const MemoizedLeftIcon = memo(SlArrowLeft);
const MemoizedRightIcon = memo(SlArrowRight);
const MemoizedCheckIcon = memo(BsCheck2);

const Player: FC<PlayerProps> = memo(({ animeData }) => {

    const {
        watchedEpisodesState,
        setEpisodeAsWatched,
        playersUsage,
        studiosUsage
    } = useAnimeJoyLegacyStorage(animeData);


    const mostUsedStudioId = studiosUsage.length === 1 ? 0 : studiosUsage.indexOf(Math.max(...studiosUsage))
    const mostUsedPlayerId = playersUsage[mostUsedStudioId].indexOf(Math.max(...playersUsage[mostUsedStudioId]))

    const [currentStudioId, setCurrentStudioId] = useState(mostUsedStudioId);
    const [currentPlayerId, setCurrentPlayerId] = useState(mostUsedPlayerId);

    const currentPlayer = animeData.studios[currentStudioId].players[currentPlayerId];
    const lastWatched = watchedEpisodesState.size > 0 ? Math.max(...watchedEpisodesState) : -1;
    const lastNotWatched = (lastWatched + 1 > currentPlayer.files.length) ? lastWatched + 1 : currentPlayer.files.length - 1;
    console.log({ lastWatched, lastNotWatched })

    const [currentEpisodeId, setCurrentEpisodeId] = useState(lastNotWatched);

    const changeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") newId = currentEpisodeId - 1;

        if (currentPlayer.files[+newId]) {
            setCurrentEpisodeId(_ => +newId);
        }
    }

    const canChangeEpisodeId = (to: "next" | "prev" | number) => {
        if (isSinglePagePlayer(currentPlayer.name)) return false;

        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") newId = currentEpisodeId - 1;

        return (currentPlayer.files[+newId] !== undefined)
    }

    const epLabel = isSinglePagePlayer(currentPlayer.name) ? currentPlayer.name : `Серия ${currentEpisodeId + 1}`;


    return (
        <section className={styles.player}>
            <Section className={styles.topSection}>
                <div
                    className={`${styles.currentEpLabel}${isSinglePagePlayer(currentPlayer.name) ? " hide" : " show"}`}
                >
                    <span children={epLabel} />
                    {watchedEpisodesState.has(currentEpisodeId) &&
                     <span className={styles.currentEpWatched} children={"Посмотрено"} />}
                </div>
                {
                    animeData.studios.length > 1 &&
                    <div className={styles.currentStudioLabel}
                         children={fullStudioName(animeData.studios[currentStudioId].name)}
                         title={"Студия"}
                    />
                }
                <PlayerSelect availableStudiosAndPlayers={animeData.studios}
                              currentStudioId={currentStudioId}
                              currentPlayerId={currentPlayerId}
                              setCurrentPlayerId={setCurrentPlayerId}
                              setCurrentStudioId={setCurrentStudioId}
                />
            </Section>
            <Section as={"button"}
                     className={`${styles.leftSection}${!canChangeEpisodeId("prev") ? " hide" : " show"}`}
                     onClick={() => changeEpisodeId("prev")}
                     disabled={!canChangeEpisodeId("prev")}
            >
                <div className={styles.wrapper}>
                    <MemoizedLeftIcon />
                    <div className={styles.hint} children={"Предыдущая серия"} />
                </div>
            </Section>
            <Section as={"iframe"}
                     className={styles.playerIframe}
                     src={currentPlayer.files[isSinglePagePlayer(currentPlayer.name) ? 0 : currentEpisodeId]}
                     allowFullScreen={true}
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
        </section>
    );
});

export default Player;
