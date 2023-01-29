import { Listbox, Transition } from '@headlessui/react';
import React, { FC, Fragment, memo, useRef } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import { PlayerData, StudioData } from "../../types";
import { fullStudioName } from "../../Utils/scraping";
import styles from "./Player.module.scss"

type PlayerSelectProps = {
    availableStudiosAndPlayers: StudioData[]
    currentStudioId: number
    currentPlayerId: number
    setCurrentStudioId: React.Dispatch<React.SetStateAction<number>>
    setCurrentPlayerId: React.Dispatch<React.SetStateAction<number>>
}

const MemoizedIcon = memo(SlArrowDown)

const PlayerSelect: FC<PlayerSelectProps> = (({
    availableStudiosAndPlayers,
    currentStudioId,
    currentPlayerId,
    setCurrentStudioId,
    setCurrentPlayerId
}) => {

    const currentPlayer = availableStudiosAndPlayers[currentStudioId].players[currentPlayerId];

    return (
        <Listbox as={"div"}
                 className={`select ${styles.playerSelect}`}
                 value={`${currentStudioId}-${currentPlayerId}`}
                 onChange={(value) => {
                     const ids = value.split("-");
                     setCurrentStudioId(+ids[0]);
                     setCurrentPlayerId(+ids[1]);
                 }}
        >
            <Listbox.Button className="select-btn" title={"Выбор плеера"}>
                <span>{currentPlayer.name}</span>
                <MemoizedIcon />
            </Listbox.Button>
            <Transition as={Fragment}>
                <Listbox.Options key={"options"} className={"select-options"} children={
                    availableStudiosAndPlayers.map((studio, sID) => (
                        <Fragment key={"fragment"+sID}>
                            {studio.name !== undefined && studio.name !== "undefined" &&
                             <div
                                 key={studio.name + sID} className={"select-options-header"}
                                 children={fullStudioName(studio.name)!.length < 12 ? fullStudioName(studio.name) : studio.name}
                             />}
                            {
                                studio.players.map((player, pID) => <Listbox.Option
                                    key={"player" + sID + "-" + pID}
                                    className={({ active, selected }) =>
                                        `select-option${active ? " active" : ""}${selected ? " selected" : ""}`
                                    }
                                    value={`${sID}-${pID}`}
                                    children={player.name}
                                />)
                            }
                        </Fragment>
                    ))
                }
                />
            </Transition>
        </Listbox>
    );
});

export default PlayerSelect;
