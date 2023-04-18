import React, { FC, memo, useContext } from 'react';
import styles from "./Player.module.scss";
import { updateAnimeRecord } from "../../../Dexie";
import { NestedChildrenMemoPolymorphicComponent as Section } from "../../Common/PolymorphicComponent";
import { PlayerContext } from "./Player";
import { useQueryClient } from "react-query";
import { SlArrowRight } from "react-icons/sl";
import { BsCheck2 } from "react-icons/bs";

const MemoizedRightIcon = memo(SlArrowRight);
const MemoizedCheckIcon = memo(BsCheck2);

type RightButtonProps = {}

const RightButton: FC<RightButtonProps> = () => {

    const queryClient = useQueryClient();

    const {
        canChangeEpisodeId,
        watchedEpisodes,
        currentEpisodeId,
        animeRecord,
        animejoyData,
        setEpisodeAsWatched,
        currentStudioId,
        currentPlayerId,
        changeEpisodeId
    } = useContext(PlayerContext);
    
    return (
        <Section as={"button"}
                 className={`${styles.rightSection}${(!canChangeEpisodeId("next") &&
                     watchedEpisodes.has(currentEpisodeId)) ? " hide-immediate" : " show"}`}
                 onClick={() => {
                     if (!watchedEpisodes.has(currentEpisodeId)) {
                         const newWE = new Set<number>(watchedEpisodes);
                         newWE.add(currentEpisodeId);
                         updateAnimeRecord(animeRecord.animejoyID, { watchedEpisodes: newWE },
                             () => queryClient.refetchQueries(['animeRecord', animejoyData.id]));
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
    );
};

export default RightButton;