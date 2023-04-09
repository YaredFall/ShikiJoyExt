import React, { FC, memo, useContext } from 'react';
import styles from "./Player.module.scss";
import { updateAnimeRecord } from "../../../Dexie";
import { isSinglePagePlayer } from "../../../Utils/misc";
import { useQueryClient } from "react-query";
import { IoClose } from "react-icons/io5";
import { PlayerContext } from "./Player";


const MemoizedCrossIcon = memo(IoClose);

type PlayerLabelProps = {}

const PlayerLabel: FC<PlayerLabelProps> = () => {

    const queryClient = useQueryClient();

    const {
        animeRecord,
        animejoyData,
        removeEpisodeFromWatched,
        watchedEpisodes,
        currentStudioId,
        currentPlayerId,
        currentPlayer,
        currentEpisodeId,
        singlePageEpisodeID
    } = useContext(PlayerContext);

    const episodeLabel = () => {
        if (isSinglePagePlayer(currentPlayer.name) || isSinglePagePlayer(currentPlayer.files[0].label)) {
            const season = currentPlayer.files.length > 1 ? `${currentEpisodeId + 1} Сезон  ` : "";
            return singlePageEpisodeID !== undefined ? (season || `${currentEpisodeId + 1} Серия`) : `${animeRecord.lastEpisode + 1} Серия`;
        } else {
            return animejoyData.studios[currentStudioId].players[currentPlayerId].files[currentEpisodeId]?.label;
        }
    };

    console.log("~~~~ LABEL RENDER ~~~~", currentEpisodeId);


    return (
        <h2 className={styles.currentEpLabel}>
            <span children={episodeLabel()} />
            {watchedEpisodes.has(currentEpisodeId) &&
                <button className={styles.currentEpWatched}
                        onClick={() => {
                            const newWE = new Set<number>(watchedEpisodes);
                            newWE.delete(currentEpisodeId);
                            updateAnimeRecord(animeRecord.animejoyID, { watchedEpisodes: newWE },
                                () => queryClient.refetchQueries(['animeRecord', animejoyData.id]));
                            removeEpisodeFromWatched(currentEpisodeId);
                        }}
                >
                    <span children={"Посмотрено"} />
                    <MemoizedCrossIcon />
                </button>}
        </h2>
    );
};

export default PlayerLabel;