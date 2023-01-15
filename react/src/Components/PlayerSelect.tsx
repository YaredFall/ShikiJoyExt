import { Listbox, Transition } from '@headlessui/react';
import React, { FC, Fragment } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import {playerData} from "../types";


type PlayerSelectProps = {
    availablePlayers: playerData[]
    currentPlayerId: number;
    setCurrentPlayerId: React.Dispatch<React.SetStateAction<number>>
}

const PlayerSelect: FC<PlayerSelectProps> = ({ availablePlayers, currentPlayerId, setCurrentPlayerId }) => {

    const currentPlayer = availablePlayers[currentPlayerId];

    return (
        <Listbox as={"div"} className="select player-select" value={currentPlayerId} onChange={setCurrentPlayerId}>
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
    );
};

export default PlayerSelect;
