import { FC } from 'react';
import { useQuery } from "react-query";
import { ShikimoriAnimeCoreData, ShikimoriAnimePreviewData } from "../../types";
import AnimeDescription from "./AnimeDescription";
import { useParams } from "react-router-dom";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getTitles } from "../../Utils/scraping";
import Searchbar from "../Searchbar";
import styles from "./AnimeAside.module.scss";
import ky from "ky";
import { useShikiJoyAnimeSearch } from "../../Api/useShikiJoyAnimeSearch";


type AnimeAsideProps = {}

const AnimeAside: FC<AnimeAsideProps> = () => {

    const { id: fullID } = useParams();
    const id = fullID!.split('-')[0];

    const { data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    const {
        isLoading,
        isFetching,
        error,
        data
    } = useShikiJoyAnimeSearch(pageDocument)

    if (error) {
        return (
            <div className={styles.animeAside}>
                <Searchbar className={styles.searchbar} />
                <section>
                    <h3>Произошла ошибка! Попробуйте позже</h3>
                </section>
            </div>
        );
    }

    return (
        <div className={styles.animeAside}>
            <Searchbar className={styles.searchbar} />
            <AnimeDescription data={data?.coreData} />
        </div>
    );
};

export default AnimeAside;