import { FC, memo, useState } from 'react';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { useAnimeJoyLegacyStore } from "../Hooks/useAnimeJoyLegacyStore";
import { isSinglePagePlayer } from '../misc';
import { AnimeData } from "../types";
import PlayerSelect from './PlayerSelect';


type PlayerProps = {
    animeData: AnimeData
}

const MemoizedLeftIcon = memo(SlArrowLeft);
const MemoizedRightIcon = memo(SlArrowRight);

const Player: FC<PlayerProps> = memo(({ animeData }) => {

    const [watchedEpisodes, playersUsage] = useAnimeJoyLegacyStore(animeData);

    const lastNotWatched = watchedEpisodes.size > 1 ? Math.max(...watchedEpisodes) + 1 : 0;
    const mostUsedPlayerId = playersUsage.indexOf(Math.max(...playersUsage))

    const [currentPlayerId, setCurrentPlayerId] = useState(mostUsedPlayerId);
    const [currentEpisodeId, setCurrentEpisodeId] = useState(lastNotWatched);

    const currentPlayer = animeData.players[currentPlayerId];

    const changeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") newId = currentEpisodeId - 1;

        if (currentPlayer.files[+newId]) {
            setCurrentEpisodeId(_ => +newId);
        }
    }

    const canChangeEpisodeId = (to: "next" | "prev" | number) => {
        if (isSinglePagePlayer(currentPlayer.name)) return false;

        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") newId = currentEpisodeId - 1;

        return (currentPlayer.files[+newId] !== undefined)
    }

    const epLabel = isSinglePagePlayer(currentPlayer.name) ? currentPlayer.name : `Серия ${currentEpisodeId + 1}`;


    return (
        <section className="player">
            <div className="player-top-section">
                <div className={`current-ep-label${isSinglePagePlayer(currentPlayer.name) ? " hide" : " show"}`}>
                    <span children={epLabel} />
                    {watchedEpisodes.has(currentEpisodeId) &&
                     <span className="current-ep-watched" children={"Посмотрено"} />}
                </div>
                <PlayerSelect availablePlayers={animeData.players}
                              currentPlayerId={currentPlayerId}
                              setCurrentPlayerId={setCurrentPlayerId} />
            </div>
            <button className={`player-left-section${!canChangeEpisodeId("prev") ? " hide" : " show"}`}
                    onClick={() => changeEpisodeId("prev")}>
                <div className="wrapper">
                    <MemoizedLeftIcon />
                    <div className="hint" children={"Предыдущая серия"} />
                </div>
            </button>
            <iframe
                className="player-iframe"
                src={currentPlayer.files[isSinglePagePlayer(currentPlayer.name) ? 0 : currentEpisodeId]}
                allowFullScreen={true}
            />
            <button className={`player-right-section${!canChangeEpisodeId("next") ? " hide" : " show"}`}
                    onClick={() => changeEpisodeId("next")}>
                <div className="wrapper">
                    <MemoizedRightIcon />
                    <div className="hint" children={"Следующая серия"} />
                </div>
            </button>
        </section>
    );
});

export default Player;
