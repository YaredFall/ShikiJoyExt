import React, { FC, useContext } from 'react';
import styles from "./Player.module.scss";
import PlayerLabel from "./PlayerLabel";
import { fullStudioName, splitTitleOrStudioAndEpisodeCount } from "../../../Utils/scraping";
import DotSplitter from "../../Common/DotSplitter";
import PlayerSelect from "./PlayerSelect";
import { NestedChildrenMemoPolymorphicComponent as Section } from "../../Common/PolymorphicComponent";
import { PlayerContext } from "./Player";

type PlayerTopSectionProps = {}

const PlayerTopSection: FC<PlayerTopSectionProps> = () => {


    const {
        animejoyData,
        currentStudio,
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
             <PlayerSelect />
            }
        </Section>
    );
};

export default PlayerTopSection;