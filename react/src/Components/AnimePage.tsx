import { FC } from 'react';
import Player from './Player';
import {useParams} from "react-router-dom";

import mockupData from '../devMockupData.json';

type AnimePageProps = {

}

const AnimePage: FC<AnimePageProps> = ({ }) => {

    const { id } = useParams<{id: string}>();

    // @ts-ignore
    const animeData = window.shikijoyData || mockupData;

    return (
        <main>
            <h1 className="anime-title-ru" children={"Title ru"} />
            <h2 className="anime-title-romaji" children={"Title romaji"} />

            <Player animeData={animeData} />

        </main>
    );
};

export default AnimePage;
