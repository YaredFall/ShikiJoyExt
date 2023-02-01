import { FC, memo } from 'react';
import Player from './Player';
import styles from "./AnimePage.module.scss"
import AnimeHeader from "./AnimeHeader";
import { useAnimeJoyPlaylistQuery } from "../../Api/useAnimeJoyPlaylistQuery";
import { AnimeJoyData } from "../../types";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getTitles } from "../../Utils/scraping";
import { useParams } from "react-router-dom";
import { tryAddAnime } from "../../Dexie";
import { useEffectOnce } from "../../Hooks/useEffectOnce";
import PlayerSkeleton from "./PlayerSkeleton";
import { useAnimeRecord } from "../../Hooks/useAnimeRecord";


type AnimePageProps = {}

const AnimePage: FC<AnimePageProps> = memo(({}) => {

    const { id: fullID } = useParams();
    const animeID = fullID!.split('-')[0];

    useEffectOnce(() => { tryAddAnime(animeID) });

    const animeRecord = useAnimeRecord(animeID);
    console.log(animeRecord);

    const { isLoading: isLoadingStudios, isFetching: isFetchingStudios, data: studioData } = useAnimeJoyPlaylistQuery(animeID);
    const { isLoading: isLoadingPage, isFetching: isFetchingPage, data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    if ((!isLoadingStudios && !studioData) || (!isLoadingPage && !pageDocument)) {
        return (
            <section><h1>Data was not found or some error occurred!</h1></section>
        );
    }

    if (isLoadingPage || isLoadingStudios || isFetchingPage || isFetchingStudios || !animeRecord) {
        return (
            <section className={styles.animePage}>
                <AnimeHeader titles={undefined}/>
                <PlayerSkeleton />
            </section>
        );
    }

    const animejoyData: AnimeJoyData = {
        id: animeID,
        titles: getTitles(pageDocument),
        studios: studioData
    }

    return (
        <section className={styles.animePage}>
            <AnimeHeader titles={animejoyData.titles}/>
            <Player animejoyData={animejoyData} animeRecord={animeRecord}/>
        </section>
    );

});

export default AnimePage;
