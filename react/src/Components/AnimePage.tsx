import { FC, memo } from 'react';
import Player from './Player';
import { useParams } from "react-router-dom";
import { useAnimeDataStore } from "../Store/animeDataStore";

type AnimePageProps = {}

const AnimePage: FC<AnimePageProps> = memo(({}) => {

    const { id } = useParams<{ id: string }>();

    const animeData = useAnimeDataStore(state => state.data)

    return (
        <main>
            <h1 className="anime-title-ru" children={"Title ru"}/>
            <h2 className="anime-title-romaji" children={"Title romaji"}/>

            <Player animeData={animeData!}/>

        </main>
    );
});

export default AnimePage;
