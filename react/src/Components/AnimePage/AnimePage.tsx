import { FC, memo, useEffect } from 'react';
import Player from './Player';
import styles from "./AnimePage.module.scss";
import AnimeHeader from "./AnimeHeader";
import { useAnimeJoyPlaylistQuery } from "../../Api/useAnimeJoyPlaylistQuery";
import { AnimeJoyData } from "../../types";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getTitles } from "../../Utils/scraping";
import { useParams } from "react-router-dom";
import { tryAddAnime } from "../../Dexie";
import PlayerSkeleton from "./PlayerSkeleton";
import { useAnimeRecord } from "../../Hooks/useAnimeRecord";


type AnimePageProps = {}

const AnimePage: FC<AnimePageProps> = memo(({}) => {

    const { id: fullID } = useParams();
    const animeID = fullID!.split('-')[0];

    const { isLoading: isLoadingStudios, isFetching: isFetchingStudios, data: studioData } = useAnimeJoyPlaylistQuery(animeID);
    const { isLoading: isLoadingPage, isFetching: isFetchingPage, data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    const animejoyData: AnimeJoyData | undefined = (animeID && studioData && pageDocument) ? {
        id: animeID,
        titles: getTitles(pageDocument),
        studios: studioData
    } : undefined;

    useEffect(() => {
        if (animejoyData)
            tryAddAnime(animejoyData)
    }, [animeID, pageDocument, studioData]);

    const animeRecord = useAnimeRecord(animeID);
    console.log(animeRecord);

    if ((!isLoadingStudios && !studioData) || (!isLoadingPage && !pageDocument)) {
        return (
            <section><h1>Data was not found or some error occurred!</h1></section>
        );
    }

    if (isLoadingPage || isLoadingStudios || isFetchingPage || isFetchingStudios || !animeRecord || !animejoyData) {
        return (
            <section className={styles.animePage}>
                <AnimeHeader titles={undefined}/>
                <PlayerSkeleton />
            </section>
        );
    }

    return (
        <section className={styles.animePage}>
            <AnimeHeader titles={animejoyData.titles}/>
            <Player animejoyData={animejoyData} animeRecord={animeRecord}/>
        </section>
    );

});

export default AnimePage;
