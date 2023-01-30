import { FC, memo } from 'react';
import Player from './Player';
import styles from "./AnimePage.module.scss"
import AnimeHeader from "./AnimeHeader";
import { useAnimeJoyPlaylistQuery } from "../../Api/useAnimeJoyPlaylistQuery";
import { AnimeJoyData } from "../../types";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getTitles } from "../../Utils/scraping";
import { useParams } from "react-router-dom";


type AnimePageProps = {}

const AnimePage: FC<AnimePageProps> = memo(({}) => {

    const { id: fullID } = useParams();
    const id = fullID!.split('-')[0];

    const { isLoading: isLoadingStudios, data: studioData } = useAnimeJoyPlaylistQuery(id);
    const { isLoading, data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    if (!studioData) {
        return (
            <section><h1>Data was not found or some error occurred!</h1></section>
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
