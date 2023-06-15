import { FC, memo, useEffect, useMemo } from 'react';
import Player from './Player/Player';
import styles from "./AnimePage.module.scss";
import AnimeHeader from "./AnimeHeader";
import { useAnimeJoyPlaylistQuery } from "../../Api/useAnimeJoyPlaylistQuery";
import { AnimeJoyData } from "../../types";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getFranchise, getShowTitle } from "../../Utils/scraping";
import { useParams } from "react-router-dom";
import { tryAddAnime, updateAnimeRecord } from "../../Dexie";
import PlayerSkeleton from "./Player/PlayerSkeleton";
import { useAnimeRecord } from "../../Hooks/useAnimeRecord";
import Characters from "./Characters";
import MainAndAsideWrapper from "../Layout/MainAndAsideWrapper";
import Franchise from "./Franchise";
import { useQueryClient } from "react-query";
import AnimeAside from "./AnimeAside";


const MainElement: FC = memo(({}) => {

    const queryClient = useQueryClient();

    const { id: fullID } = useParams();
    const animeID = useMemo(() => fullID!.split('-')[0], [fullID]);

    const { isLoading: isLoadingStudios, isFetching: isFetchingStudios, data: studioData } = useAnimeJoyPlaylistQuery(animeID);
    const { isLoading: isLoadingPage, isFetching: isFetchingPage, data: pageDocument } = useAnimeJoyAnimePageQuery(location.pathname);

    const animejoyData: AnimeJoyData | undefined = useMemo(() => {
        return (animeID && pageDocument) ? {
            id: animeID,
            titles: getShowTitle(pageDocument)!,
            franchise: getFranchise(pageDocument),
            studios: studioData
        } : undefined;
    }, [animeID && pageDocument && isLoadingStudios]);

    useEffect(() => {
        if (animejoyData) {
            tryAddAnime(animejoyData).then(async _ => {
                await queryClient.refetchQueries(["animeRecord", animeID]);
            });
        }
    }, [animejoyData]);

    const { data: animeRecord } = useAnimeRecord(animeID);

    console.log({ animeRecord, animejoyData });

    if (animeRecord && animejoyData && animejoyData.studios) {
        let resetStudioId = false;
        let resetPlayerId = false;
        if (!animejoyData.studios[animeRecord.lastStudio]?.players[animeRecord.lastPlayer]) {
            resetPlayerId = true;
        }
        if (!animejoyData.studios[animeRecord.lastStudio]) {
            resetStudioId = true;
        }

        if (resetStudioId || resetPlayerId) {
            updateAnimeRecord(animeID, { lastPlayer: 0, lastStudio: resetStudioId ? 0 : undefined });
            return null;
        }
    }

    if ((!isLoadingPage && !pageDocument)) {
        return (
            <div><h1>Data was not found or some error occurred!</h1></div>
        );
    }

    const isLoading = isLoadingPage || isLoadingStudios || isFetchingPage || isFetchingStudios || !animeRecord || !animejoyData;

    return (
        <div className={styles.animePage}>
            <AnimeHeader titles={animejoyData?.titles} />
            {isLoading ?
                <PlayerSkeleton />
                :
                <>
                    <Franchise franchise={animejoyData.franchise} />
                    <Player animejoyData={animejoyData} animeRecord={animeRecord} />
                </>
            }
            <Characters />
        </div>
    );

});

const AnimePage: FC = memo(() => {
    return (
        <MainAndAsideWrapper main={<MainElement />} aside={<AnimeAside />} />
    );
});

export default AnimePage;
