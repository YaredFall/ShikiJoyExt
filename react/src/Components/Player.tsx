import { Listbox, Transition } from '@headlessui/react';
import { FC, useState, Fragment } from 'react';
import { SlArrowDown, SlArrowLeft, SlArrowRight } from 'react-icons/sl'

type PlayerProps = {
    availablePlayers: { name: string, files: string[] }[]
}

const Player: FC<PlayerProps> = ({ availablePlayers }) => {

    const [currentPlayerId, setCurrentPlayerId] = useState(0);
    const [currentEpisodeId, setCurrentEpisodeId] = useState(0);
    
    const currentPlayer = availablePlayers[currentPlayerId];
    
    const changeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") newId = currentEpisodeId + 1;
        else if (to === "prev") newId = currentEpisodeId - 1;
        
        if (currentPlayer.files[+newId])
            setCurrentEpisodeId(_ => +newId);
    }
    
    const canChangeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") newId = currentEpisodeId + 1;
        else if (to === "prev") newId = currentEpisodeId - 1;
        
        return (currentPlayer.files[+newId] !== undefined)
    }

    const epLabel = currentPlayer.name === "Kodik" ? "Kodik" : currentPlayer.name === "Alloha" ? "Alloha" : `Серия ${currentEpisodeId + 1}`;

    return (
        <section className="player">
            <div className="player-top-section">
                <div className="current-ep-label" children={epLabel} />
                <Listbox as={"div"} className="player-select" value={currentPlayerId} onChange={setCurrentPlayerId}>
                    <Listbox.Button className="select-btn">
                        <span>{currentPlayer.name}</span>
                        <SlArrowDown />
                    </Listbox.Button>
                    <Transition as={Fragment}>
                        <Listbox.Options className={"select-options"}>
                            {availablePlayers.map((p, i) => <Listbox.Option
                                key={i}
                                className={({ active, selected }) => `select-option${active ? " active" : ""}${selected ? " selected" : ""}`}
                                value={i}
                                children={p.name}
                            />)
                            }
                        </Listbox.Options>
                    </Transition>
                </Listbox>
            </div>
            <button className={`player-left-section${!canChangeEpisodeId("prev") ? " hide": " show"}`} onClick={() => changeEpisodeId("prev")}>
                <div className="wrapper">
                    <SlArrowLeft />
                    <div className="hint" children={"Предыдущая серия"} />
                </div>
            </button>
            <iframe
                className="player-iframe"
                src={currentPlayer.files[currentEpisodeId]}
                allowFullScreen={true}
            />
            <button className={`player-right-section${!canChangeEpisodeId("next") ? " hide": " show"}`} onClick={() => changeEpisodeId("next")}>
                <div className="wrapper">
                    <SlArrowRight />
                    <div className="hint" children={"Следующая серия"} />
                </div>
            </button>
        </section>
    );
};

export default Player;
