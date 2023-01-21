import { FC, memo } from 'react';
import Player from './Player';
import { useParams } from "react-router-dom";
import { useAnimeDataStore } from "../Store/animeDataStore";
import styles from "./AnimePage.module.scss"

type AnimePageProps = {}

const AnimePage: FC<AnimePageProps> = memo(({}) => {

    const { id } = useParams<{ id: string }>();

    const animeData = useAnimeDataStore(state => state.data)
    if (!animeData) return (
        <main><h1>Data was not found or some error occurred!</h1></main>
    ); else return (
        <main className={styles.animePage}>
            <div className={styles.topSection}>
                <h1 className={styles.titleRU} children={animeData.title.ru}/>
                <h2 className={styles.titleRomanji} children={animeData.title.romanji}/>
            </div>

            <Player animeData={animeData}/>

        </main>
    );

});

export default AnimePage;
