import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimeJoyLegacyStorage } from "../../../Hooks/useAnimeJoyLegacyStorage";
import { isSinglePagePlayer } from '../../../Utils/misc';
import { AnimeJoyData } from "../../../types";
import styles from './Player.module.scss';
import { usePlayersFixes } from "./hooks/usePlayersFixes";
import { updateAnimeRecord } from "../../../Dexie";
import PlayerMiddleSection from "./PlayerMiddleSection";
import { Anime } from "../../../Dexie/db";
import { addMessageListener, removeMessageListener } from "../../../Utils/messaging";
import { useQueryClient } from "react-query";
import LeftButton from "./LeftButton";
import RightButton from "./RightButton";
import PlayerTopSection from "./PlayerTopSection";
import { useOptionsHeightFix } from "./hooks/useOptionsHeightFix";


type PlayerContextProps = {
    animeRecord: Anime,
    animejoyData: AnimeJoyData,
    setEpisodeAsWatched: ReturnType<typeof useAnimeJoyLegacyStorage>["setEpisodeAsWatched"],
    removeEpisodeFromWatched: ReturnType<typeof useAnimeJoyLegacyStorage>["removeEpisodeFromWatched"],
    watchedEpisodes: Anime["watchedEpisodes"],
    currentStudioId: number,
    currentPlayerId: number,
    currentStudio: Exclude<AnimeJoyData["studios"], undefined>[number] | undefined,
    currentPlayer: Exclude<AnimeJoyData["studios"], undefined>[number]["players"][number] | undefined,
    currentEpisodeId: number,
    setCurrentEpisodeId: React.Dispatch<React.SetStateAction<number>>,
    singlePageEpisodeID: number | undefined,
    setSinglePageEpisodeID: React.Dispatch<React.SetStateAction<number | undefined>>,
    singlePageEpisodesAvailable: number | undefined,
    setSinglePageEpisodesAvailable: React.Dispatch<React.SetStateAction<number | undefined>>,
    canChangeEpisodeId: (to: "next" | "prev" | number) => boolean,
    changeEpisodeId: (to: "next" | "prev" | number) => void
}
export const PlayerContext = React.createContext<PlayerContextProps>({} as PlayerContextProps);


type PlayerProps = {
    animejoyData: AnimeJoyData,
    animeRecord: Anime
}
const Player: FC<PlayerProps> = memo(({ animejoyData, animeRecord }) => {

    const queryClient = useQueryClient();

    const { setEpisodeAsWatched, removeEpisodeFromWatched, } = useAnimeJoyLegacyStorage(animejoyData);
    const watchedEpisodes = animeRecord.watchedEpisodes;

    const currentStudioId = animeRecord.lastStudio;
    const currentPlayerId = animeRecord.lastPlayer;

    const currentStudio = animejoyData.studios ? animejoyData.studios[currentStudioId] || animejoyData.studios[0] : undefined;
    const currentPlayer = currentStudio ? currentStudio.players[currentPlayerId] || currentStudio.players[0] : undefined;

    const [currentEpisodeId, setCurrentEpisodeId] = useState(0);
    console.log({ currentStudioId, currentPlayerId, currentEpisodeId, animejoyData });

    const [singlePageEpisodeID, setSinglePageEpisodeID] = useState<number | undefined>(undefined);
    const [singlePageEpisodesAvailable, setSinglePageEpisodesAvailable] = useState<number | undefined>(undefined);
    useEffect(() => {
        const onMessage = (msg: any) => {
            if (msg.episodesAvailable !== undefined && singlePageEpisodesAvailable !== msg.episodesAvailable) {
                setSinglePageEpisodesAvailable(msg.episodesAvailable);
            }
            if (msg.currentEpisodeID !== undefined) {
                setSinglePageEpisodeID(msg.currentEpisodeID);
                if (currentPlayer?.files.length === 1) {
                    changeEpisodeId(msg.currentEpisodeID);
                }
            }
        };
        addMessageListener(onMessage);

        return () => {
            removeMessageListener(onMessage);
        };
    }, []);

    useEffect(() => {
        setSinglePageEpisodesAvailable(undefined);
        setSinglePageEpisodeID(undefined);
    }, [currentStudioId, currentPlayerId]);

    useEffect(() => {
        let availableEps;
        if ((isSinglePagePlayer(currentPlayer?.name) || isSinglePagePlayer(currentPlayer?.files[0].label))
            && singlePageEpisodesAvailable && currentPlayer?.files.length === 1) {
            availableEps = singlePageEpisodesAvailable;
        } else if (!isSinglePagePlayer(currentPlayer?.name) || currentPlayer?.files?.length! > 1 || !singlePageEpisodesAvailable) {
            availableEps = currentPlayer?.files.length;
        }
        console.log({ availableEps, currentEpisodeId, singlePageEpisodesAvailable });
        if (availableEps) {
            setCurrentEpisodeId(animeRecord.lastEpisode >= availableEps ? availableEps - 1 : animeRecord.lastEpisode);
        }
    }, [currentStudioId, currentPlayerId, animeRecord, singlePageEpisodesAvailable]);


    const changeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") {
            newId = currentEpisodeId - 1;
        }

        setCurrentEpisodeId(_ => +newId);
        updateAnimeRecord(animejoyData.id, { lastEpisode: +newId },
            () => queryClient.refetchQueries(['animeRecord', animejoyData.id]));
    };

    const canChangeEpisodeId = (to: "next" | "prev" | number) => {
        let newId = to;
        if (to === "next") {
            newId = currentEpisodeId + 1;
        } else if (to === "prev") {
            newId = currentEpisodeId - 1;
        }

        if ((isSinglePagePlayer(currentPlayer?.name) || isSinglePagePlayer(currentPlayer?.files[0].label))
            && currentPlayer?.files.length === 1 && singlePageEpisodesAvailable && singlePageEpisodeID !== undefined) {
            return newId >= 0 && newId < singlePageEpisodesAvailable;
        }

        return (currentPlayer?.files[+newId] !== undefined);
    };


    const leftBtnRef = useRef<HTMLButtonElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    usePlayersFixes(iframeRef);

    //sets player select options max-height to iframe height
    useOptionsHeightFix(iframeRef, [animejoyData?.studios, iframeRef]);


    const source = useMemo(() => {
        if (isSinglePagePlayer(currentPlayer?.name) || isSinglePagePlayer(currentPlayer?.files[0].label)) {
            if (currentPlayer?.files.length === 1) {
                const file = currentPlayer.files[0].file;
                return file + (file.includes('?') ? "&" : "?") + `episode=${animeRecord.lastEpisode + 1}`;
            }
            return currentPlayer?.files[currentEpisodeId] ? currentPlayer.files[currentEpisodeId].file : (currentPlayer?.files.at(-1)!.file || "");
        } else {
            return currentPlayer?.files[currentEpisodeId] ? currentPlayer.files[currentEpisodeId].file : "";
        }
    }, [currentStudioId, currentPlayerId, animejoyData, currentEpisodeId, animeRecord?.lastEpisode]);

    if (!animejoyData.studios) return <section className={styles.player}><div className={styles.middleSection}>Видеоисточник отсутсвует</div></section>;
    
    return (
        <PlayerContext.Provider value={{
            animeRecord,
            animejoyData,
            setEpisodeAsWatched,
            removeEpisodeFromWatched,
            watchedEpisodes,
            currentStudioId,
            currentPlayerId,
            currentStudio,
            currentPlayer,
            currentEpisodeId,
            setCurrentEpisodeId,
            singlePageEpisodeID,
            setSinglePageEpisodeID,
            singlePageEpisodesAvailable,
            setSinglePageEpisodesAvailable,
            canChangeEpisodeId,
            changeEpisodeId
        }}
        >
            <section className={styles.player}>
                <PlayerTopSection />
                <LeftButton buttonRef={leftBtnRef} />
                <PlayerMiddleSection iframeRef={iframeRef}
                                     leftBtnRef={leftBtnRef}
                                     source={source}
                />
                <RightButton />
            </section>
        </PlayerContext.Provider>
    );
});

export default Player;
