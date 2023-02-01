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


type AnimePageProps = {}

const AnimePage: FC<AnimePageProps> = memo(({}) => {

    const { id: fullID } = useParams();
    const id = fullID!.split('-')[0];

    useEffectOnce(() => { tryAddAnime(id) });

    const { isLoading: isLoadingStudios, isFetching: isFetchingStudios, data: studioData } = useAnimeJoyPlaylistQuery(id);
    const { isLoading: isLoadingPage, isFetching: isFetchingPage, data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    if ((!isLoadingStudios && !studioData) || (!isLoadingPage && !pageDocument)) {
        return (
            <section><h1>Data was not found or some error occurred!</h1></section>
        );
    }

    if (isLoadingPage || isLoadingStudios || isFetchingPage || isFetchingStudios) {
        return (
            <section className={styles.animePage}>
                <AnimeHeader titles={undefined}/>
                {/*TODO:<Player animejoyData={undefined}/>*/}
            </section>
        );
    }

    const animejoyData: AnimeJoyData = {
        id: id,
        titles: getTitles(pageDocument),
        studios: studioData
    }

    return (
        <section className={styles.animePage}>
            <AnimeHeader titles={animejoyData.titles}/>
            <Player animejoyData={animejoyData}/>
        </section>
    );

});

export default AnimePage;
