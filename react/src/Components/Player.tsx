import React, { FC, memo, useState } from 'react';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { useAnimeJoyLegacyStorage } from "../Hooks/useAnimeJoyLegacyStorage";
import { isSinglePagePlayer } from '../misc';
import { AnimeData } from "../types";
import { fullStudioName } from "../Utils/scraping";
import styles from './Player.module.scss'
import { NestedChildrenMemoPolymorphicComponent as Section } from "./PolymorphicComponent";
import PlayerSelect from './PlayerSelect';

type PlayerProps = {
    animeData: AnimeData
}

const MemoizedLeftIcon = memo(SlArrowLeft);
const MemoizedRightIcon = memo(SlArrowRight);


const Player: FC<PlayerProps> = memo(({ animeData }) => {

    const { watchedEpisodes, setEpisodeAsWatched, playersUsage, studiosUsage } = useAnimeJoyLegacyStorage(animeData);

    const lastNotWatched = watchedEpisodes.size > 0 ? Math.max(...watchedEpisodes) + 1 : 0;
    const mostUsedStudioId = studiosUsage.length === 1 ? 0 : studiosUsage.indexOf(Math.max(...studiosUsage))
    const mostUsedPlayerId = playersUsage[mostUsedStudioId].indexOf(Math.max(...playersUsage[mostUsedStudioId]))

    const [currentStudioId, setCurrentStudioId] = useState(mostUsedStudioId);
    const [currentPlayerId, setCurrentPlayerId] = useState(mostUsedPlayerId);
    const [currentEpisodeId, setCurrentEpisodeId] = useState(lastNotWatched);

    const currentPlayer = animeData.studios[currentStudioId].players[currentPlayerId];

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
                    {watchedEpisodes.has(currentEpisodeId) &&
                     <span className={styles.currentEpWatched} children={"Посмотрено"} />}
                </div>
                {
                    animeData.studios.length > 1 &&
                    <div className={styles.currentStudioLabel} children={fullStudioName(animeData.studios[currentStudioId].name)} title={"Студия"} />
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
                     className={`${styles.rightSection}${!canChangeEpisodeId("next") ? " hide" : " show"}`}
                     onClick={() => {
                         if (!watchedEpisodes.has(currentEpisodeId)) {
                             setEpisodeAsWatched(currentStudioId, currentPlayerId, currentEpisodeId);
                         }
                         changeEpisodeId("next")
                     }}
            >
                <div className={styles.wrapper}>
                    <MemoizedRightIcon />
                    <div className={styles.hint} children={"Следующая серия"} />
                </div>
            </Section>
        </section>
    );
});

export default Player;
