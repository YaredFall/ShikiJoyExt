import { FC } from 'react';
import Player from './Player';

import players from '../devMockupPlayers.json';

type AnimePageProps = {
    
}

const AnimePage: FC<AnimePageProps> = ({ }) => {
    
    return (
        <main>
            <h1 className="anime-title-ru" children={"Title ru"} />
            <h2 className="anime-title-romaji" children={"Title romaji"} />
            <Player availablePlayers={players} />
        </main>
    );
};

export default AnimePage;
