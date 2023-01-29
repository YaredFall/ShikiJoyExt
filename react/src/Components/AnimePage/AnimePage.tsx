import { FC, memo } from 'react';
import Player from './Player';
import { useParams } from "react-router-dom";
import { useAnimeDataStore } from "../../Store/animeDataStore";
import styles from "./AnimePage.module.scss"
import { useQuery } from "react-query";
import { Titles } from "../../types";
import AnimeHeader from "./AnimeHeader";



type AnimePageProps = {}

const AnimePage: FC<AnimePageProps> = memo(({}) => {

    const animeData = useAnimeDataStore(state => state.data)
    if (!animeData) {
        return (
            <section><h1>Data was not found or some error occurred!</h1></section>
        );
    }

    return (
        <section className={styles.animePage}>
            <AnimeHeader titles={animeData.title}/>
            <Player animeData={animeData}/>
        </section>
    );

});

export default AnimePage;
