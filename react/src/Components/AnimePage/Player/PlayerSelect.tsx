import { Listbox, Transition } from '@headlessui/react';
import React, { FC, Fragment, memo, useContext, useRef } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import { fullStudioName, splitTitleOrStudioAndEpisodeCount } from "../../../Utils/scraping";
import styles from "./Player.module.scss";
import { useParams } from "react-router-dom";
import { updateAnimeRecord } from "../../../Dexie";
import DotSplitter from "../../Common/DotSplitter";
import { PlayerContext } from "./Player";
import { useQueryClient } from "react-query";

const MemoizedIcon = memo(SlArrowDown);

type PlayerSelectProps = {}

const PlayerSelect: FC<PlayerSelectProps> = (() => {

    const { id: fullID } = useParams();
    const id = fullID!.split('-')[0];

    const {
        animejoyData,
        currentStudioId,
        currentPlayerId,
    } = useContext(PlayerContext);

    const queryClient = useQueryClient();

    const setCurrentPlayerId = (newId: number) => updateAnimeRecord(animejoyData.id, { lastPlayer: +newId },
        () => queryClient.refetchQueries(['animeRecord', animejoyData.id]));
    const setCurrentStudioId = (newId: number) => updateAnimeRecord(animejoyData.id, { lastStudio: +newId },
        () => queryClient.refetchQueries(['animeRecord', animejoyData.id]));

    const availableStudiosAndPlayers = animejoyData?.studios;

    const shouldShowSkeleton = availableStudiosAndPlayers === undefined || currentStudioId === undefined || currentPlayerId === undefined;

    if (shouldShowSkeleton) {
        return (
            <Listbox as={"div"} className={`select ${styles.playerSelect}`} disabled>
                <Listbox.Button className="select-btn" title={"Выбор плеера"}>
                    <span className={"hide-immediate"}>Player</span>
                </Listbox.Button>
            </Listbox>
        );
    }

    const currentStudio = availableStudiosAndPlayers[currentStudioId];
    const currentPlayer = currentStudio.players[currentPlayerId];

    const btnRef = useRef(null);

    return (
        <Listbox as={"div"}
                 className={`select ${styles.playerSelect}`}
                 value={`${currentStudioId}-${currentPlayerId}`}
                 onChange={(value) => {
                     const ids = value.split("-");
                     setCurrentStudioId(+ids[0]);
                     setCurrentPlayerId(+ids[1]);
                     updateAnimeRecord(id, {
                         lastStudio: +ids[0],
                         lastPlayer: +ids[1]
                     });

                 }}
        >
            <Listbox.Button
                ref={btnRef}
                className="select-btn"
                title={"Выбор плеера"}
                onKeyDown={(e: React.KeyboardEvent) => {
                    console.log("active on down", document.activeElement);

                    if (e.code !== "Space" && e.code !== "Enter" && e.code !== "Tab") {
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                    }
                }}
            >
                <span>{currentPlayer.name}</span>
                <MemoizedIcon />
            </Listbox.Button>
            <Transition as={Fragment}>
                <Listbox.Options key={"options"} className={"select-options"} children={
                    availableStudiosAndPlayers.map((studio, sID) => {
                            const [studioName, studioAvailableEpisodes] = splitTitleOrStudioAndEpisodeCount(studio.name);
                            return (
                                <Fragment key={"fragment" + sID}>
                                    {studioName !== undefined &&
                                        <div key={studioName + sID} className={"select-options-header"}>
                                        <span title={fullStudioName(studioName)}
                                              children={fullStudioName(studioName)!.length <= (studioAvailableEpisodes ? 6 : 9) ? fullStudioName(studioName) : studioName}
                                        />
                                            {studioAvailableEpisodes &&
                                                <><DotSplitter /><span title={`${studioAvailableEpisodes} серий`}
                                                                       children={studioAvailableEpisodes}
                                                /></>
                                            }
                                        </div>
                                    }
                                    {
                                        studio.players.map((player, pID) => <Listbox.Option
                                            key={"player" + sID + "-" + pID}
                                            className={({ active, selected }) =>
                                                `select-option${active ? " active" : ""}${selected ? " selected" : ""}`}
                                            value={`${sID}-${pID}`}
                                            children={player.name}
                                        />)
                                    }
                                </Fragment>
                            );
                        }
                    )
                }
                />
            </Transition>
        </Listbox>
    );
});

export default PlayerSelect;
