import React, { FC, useContext } from 'react';
import styles from "./Player.module.scss";
import PlayerLabel from "./PlayerLabel";
import { fullStudioName, splitTitleOrStudioAndEpisodeCount } from "../../../Utils/scraping";
import DotSplitter from "../../Common/DotSplitter";
import PlayerSelect from "./PlayerSelect";
import { updateAnimeRecord } from "../../../Dexie";
import { NestedChildrenMemoPolymorphicComponent as Section } from "../../Common/PolymorphicComponent";
import { PlayerContext } from "./Player";
import { useQueryClient } from "react-query";

type PlayerTopSectionProps = {}

const PlayerTopSection: FC<PlayerTopSectionProps> = () => {

    const queryClient = useQueryClient();

    const {
        animejoyData,
        currentStudio,
        currentStudioId,
        currentPlayerId,
        currentPlayer
    } = useContext(PlayerContext);

    const [studioName, studioEpisodesCount] = splitTitleOrStudioAndEpisodeCount(currentStudio.name);

    return (
        <Section className={styles.topSection}>
            <PlayerLabel />
            {
                animejoyData.studios.length > 1 &&
                <div className={styles.currentStudioLabel}>
                    <span title={fullStudioName(studioName)}>{fullStudioName(studioName)}</span>
                    {studioEpisodesCount &&
                        <><DotSplitter /><span title={`${studioEpisodesCount} серий`}>{studioEpisodesCount}</span></>
                    }
                </div>
            }
            {currentStudio.players.length === 1 && currentPlayer.name === undefined ? null :
             <PlayerSelect availableStudiosAndPlayers={animejoyData.studios}
                           currentStudioId={currentStudioId}
                           currentPlayerId={currentPlayerId}
                           setCurrentPlayerId={(newId) => updateAnimeRecord(animejoyData.id, { lastPlayer: +newId },
                               () => queryClient.refetchQueries(['animeRecord', animejoyData.id]))}
                           setCurrentStudioId={(newId) => updateAnimeRecord(animejoyData.id, { lastStudio: +newId },
                               () => queryClient.refetchQueries(['animeRecord', animejoyData.id]))}
             />
            }
        </Section>
    );
};

export default PlayerTopSection;