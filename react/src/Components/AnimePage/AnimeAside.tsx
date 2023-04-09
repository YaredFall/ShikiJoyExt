import { FC } from 'react';
import AnimeDescription from "./AnimeDescription";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getShikimoriID } from "../../Utils/scraping";
import Searchbar from "../Common/Searchbar";
import styles from "./AnimeAside.module.scss";
import { useShikiJoyAnimeSearch } from "../../Api/useShikiJoyAnimeSearch";


type AnimeAsideProps = {}

const AnimeAside: FC<AnimeAsideProps> = () => {

    const { data: pageDocument } = useAnimeJoyAnimePageQuery(window.location.pathname);

    const {
        isLoading,
        isFetching,
        error,
        data
    } = useShikiJoyAnimeSearch(getShikimoriID(pageDocument))

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