import { Listbox, Transition } from '@headlessui/react';
import React, { FC, Fragment, memo, useRef } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import { PlayerData } from "../types";
import styles from "./Player.module.scss"

type PlayerSelectProps = {
    availablePlayers: PlayerData[]
    currentPlayerId: number;
    setCurrentPlayerId: React.Dispatch<React.SetStateAction<number>>
}

const MemoizedIcon = memo(SlArrowDown)

const PlayerSelect: FC<PlayerSelectProps> = memo(({ availablePlayers, currentPlayerId, setCurrentPlayerId }) => {

    const currentPlayer = availablePlayers[currentPlayerId];

    return (
        <Listbox as={"div"} className={`select ${styles.playerSelect}`} value={currentPlayerId} onChange={setCurrentPlayerId}>
            <Listbox.Button className="select-btn">
                <span>{currentPlayer.name}</span>
                <MemoizedIcon />
            </Listbox.Button>
            <Transition as={Fragment}>
                <Listbox.Options className={"select-options"}>
                    {availablePlayers.map((p, i) => <Listbox.Option
                        key={i}
                        className={({ active, selected }) =>
                            `select-option${active ? " active" : ""}${selected ? " selected" : ""}`
                        }
                        value={i}
                        children={p.name}
                    />)
                    }
                </Listbox.Options>
            </Transition>
        </Listbox>
    );
});

export default PlayerSelect;
