import { FC, memo, useEffect } from 'react';
import Player from './Player';
import styles from "./AnimePage.module.scss";
import AnimeHeader from "./AnimeHeader";
import { useAnimeJoyPlaylistQuery } from "../../Api/useAnimeJoyPlaylistQuery";
import { AnimeJoyData } from "../../types";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getFranchise, getTitles } from "../../Utils/scraping";
import { useParams } from "react-router-dom";
import { tryAddAnime } from "../../Dexie";
import PlayerSkeleton from "./PlayerSkeleton";
import { useAnimeRecord } from "../../Hooks/useAnimeRecord";
import Characters from "./Characters";
import MainAndAsideWrapper from "../MainAndAsideWrapper";
import Franchise from "./Franchise";
import { useQueryClient } from "react-query";
import AnimeAside from "./AnimeAside";


const MainElement: FC = memo(({}) => {

    const queryClient = useQueryClient();

    const { id: fullID } = useParams();
    const animeID = fullID!.split('-')[0];

    const { isLoading: isLoadingStudios, isFetching: isFetchingStudios, data: studioData } = useAnimeJoyPlaylistQuery(animeID);
    const { isLoading: isLoadingPage, isFetching: isFetchingPage, data: pageDocument } = useAnimeJoyAnimePageQuery(
        window.location.pathname);

    const animejoyData: AnimeJoyData | undefined = (animeID && studioData && pageDocument) ? {
        id: animeID,
        titles: getTitles(pageDocument)!,
        franchise: getFranchise(pageDocument),
        studios: studioData
    } : undefined;

    useEffect(() => {
        if (animejoyData) {
            tryAddAnime(animejoyData).then(async _ => {
                await queryClient.refetchQueries(["animeRecord", animeID]);
            });
        }
    }, [animeID, pageDocument, studioData]);

    const { data: animeRecord } = useAnimeRecord(animeID);
    console.log({ animeRecord, animejoyData });

    if ((!isLoadingStudios && !studioData) || (!isLoadingPage && !pageDocument)) {
        return (
            <div><h1>Data was not found or some error occurred!</h1></div>
        );
    }
    if (isLoadingPage || isLoadingStudios || isFetchingPage || isFetchingStudios || !animeRecord || !animejoyData) {
        return (
            <div className={styles.animePage}>
                <AnimeHeader titles={undefined} />
                <PlayerSkeleton />
                <Characters />
            </div>
        );
    }

    return (
        <div className={styles.animePage}>
            <AnimeHeader titles={animejoyData.titles} />
            <Franchise franchise={animejoyData.franchise} />
            <Player animejoyData={animejoyData} animeRecord={animeRecord} />
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
