import { FC, memo, useEffect } from 'react';
import Player from './Player';
import styles from "./AnimePage.module.scss";
import AnimeHeader from "./AnimeHeader";
import { useAnimeJoyPlaylistQuery } from "../../Api/useAnimeJoyPlaylistQuery";
import { AnimeJoyData } from "../../types";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getTitles } from "../../Utils/scraping";
import { useParams } from "react-router-dom";
import { tryAddAnime } from "../../Dexie";
import PlayerSkeleton from "./PlayerSkeleton";
import { useAnimeRecord } from "../../Hooks/useAnimeRecord";
import Characters from "./Characters";
import MainContainer from "../MainContainer";
import AsideContainer from "../AsideContainer";
import AnimeAside from "./AnimeAside";


type AnimePageProps = {}

const AnimePage: FC<AnimePageProps> = memo(({}) => {

    const { id: fullID } = useParams();
    const animeID = fullID!.split('-')[0];

    const { isLoading: isLoadingStudios, isFetching: isFetchingStudios, data: studioData } = useAnimeJoyPlaylistQuery(animeID);
    const { isLoading: isLoadingPage, isFetching: isFetchingPage, data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    const animejoyData: AnimeJoyData | undefined = (animeID && studioData && pageDocument) ? {
        id: animeID,
        titles: getTitles(pageDocument)!,
        studios: studioData
    } : undefined;

    useEffect(() => {
        if (animejoyData)
            tryAddAnime(animejoyData)
    }, [animeID, pageDocument, studioData]);

    const animeRecord = useAnimeRecord(animeID);
    console.log(animeRecord);

    const MainSection:FC = () => {
        if ((!isLoadingStudios && !studioData) || (!isLoadingPage && !pageDocument)) {
            return (
                <section><h1>Data was not found or some error occurred!</h1></section>
            );
        } else if (isLoadingPage || isLoadingStudios || isFetchingPage || isFetchingStudios || !animeRecord || !animejoyData) {
            return (
                <section className={styles.animePage}>
                    <AnimeHeader titles={undefined} />
                    <PlayerSkeleton />
                    <Characters />
                </section>
            );
        } else {
            return (
                <section className={styles.animePage}>
                    <AnimeHeader titles={animejoyData.titles} />
                    <Player animejoyData={animejoyData} animeRecord={animeRecord} />
                    <Characters />
                </section>
            );
        }
    }

    return (
        <>
            <MainContainer>
                <MainSection />
            </MainContainer>
            <AsideContainer>
                <AnimeAside />
            </AsideContainer>
        </>
    );

});

export default AnimePage;
